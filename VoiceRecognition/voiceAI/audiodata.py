from voiceAI.header import *
from voiceAI.audio import *
from voiceAI.error import *
from voiceAI.recognizer import *
from voiceAI.getFlacConverter import *

class AudioData(object):
    def __init__(self, frame_data, sample_rate, sample_width):
        assert sample_rate > 0, "Sample rate must be a positive integer"
        assert sample_width % 1 == 0 and 1 <= sample_width <= 4, "Sample width must be between 1 and 4 inclusive"
        self.frame_data = frame_data
        self.sample_rate = sample_rate
        self.sample_width = int(sample_width)

    def get_raw_data(self, convert_rate=None, convert_width=None):
        assert convert_rate is None or convert_rate > 0, "Sample rate to convert to must be a positive integer"
        assert convert_width is None or (
        convert_width % 1 == 0 and 1 <= convert_width <= 4), "Sample width to convert to must be between 1 and 4 inclusive"

        raw_data = self.frame_data

        # make sure unsigned 8-bit audio (which uses unsigned samples) is handled like higher sample width audio (which uses signed samples)
        if self.sample_width == 1:
            raw_data = audioop.bias(raw_data, 1,
                                    -128)  # subtract 128 from every sample to make them act like signed samples

        # resample audio at the desired rate if specified
        if convert_rate is not None and self.sample_rate != convert_rate:
            raw_data, _ = audioop.ratecv(raw_data, self.sample_width, 1, self.sample_rate, convert_rate, None)

        # convert samples to desired sample width if specified
        if convert_width is not None and self.sample_width != convert_width:
            if convert_width == 3:  # we're converting the audio into 24-bit (workaround for https://bugs.python.org/issue12866)
                raw_data = audioop.lin2lin(raw_data, self.sample_width,
                                           4)  # convert audio into 32-bit first, which is always supported
                try:
                    audioop.bias(b"", 3,
                                 0)  # test whether 24-bit audio is supported (for example, ``audioop`` in Python 3.3 and below don't support sample width 3, while Python 3.4+ do)
                except audioop.error:  # this version of audioop doesn't support 24-bit audio (probably Python 3.3 or less)
                    raw_data = b"".join(raw_data[i + 1:i + 4] for i in range(0, len(raw_data),
                                                                             4))  # since we're in little endian, we discard the first byte from each 32-bit sample to get a 24-bit sample
                else:  # 24-bit audio fully supported, we don't need to shim anything
                    raw_data = audioop.lin2lin(raw_data, self.sample_width, convert_width)
            else:
                raw_data = audioop.lin2lin(raw_data, self.sample_width, convert_width)

        # if the output is 8-bit audio with unsigned samples, convert the samples we've been treating as signed to unsigned again
        if convert_width == 1:
            raw_data = audioop.bias(raw_data, 1,
                                    128)  # add 128 to every sample to make them act like unsigned samples again

        return raw_data

    def get_wav_data(self, convert_rate=None, convert_width=None):
        raw_data = self.get_raw_data(convert_rate, convert_width)
        sample_rate = self.sample_rate if convert_rate is None else convert_rate
        sample_width = self.sample_width if convert_width is None else convert_width

        # generate the WAV file contents
        with io.BytesIO() as wav_file:
            wav_writer = wave.open(wav_file, "wb")
            try:  # note that we can't use context manager, since that was only added in Python 3.4
                wav_writer.setframerate(sample_rate)
                wav_writer.setsampwidth(sample_width)
                wav_writer.setnchannels(1)
                wav_writer.writeframes(raw_data)
                wav_data = wav_file.getvalue()
            finally:  # make sure resources are cleaned up
                wav_writer.close()
        return wav_data

    def get_aiff_data(self, convert_rate=None, convert_width=None):
        raw_data = self.get_raw_data(convert_rate, convert_width)
        sample_rate = self.sample_rate if convert_rate is None else convert_rate
        sample_width = self.sample_width if convert_width is None else convert_width

        # the AIFF format is big-endian, so we need to covnert the little-endian raw data to big-endian
        if hasattr(audioop, "byteswap"):  # ``audioop.byteswap`` was only added in Python 3.4
            raw_data = audioop.byteswap(raw_data, sample_width)
        else:  # manually reverse the bytes of each sample, which is slower but works well enough as a fallback
            raw_data = raw_data[sample_width - 1::-1] + b"".join(
                raw_data[i + sample_width:i:-1] for i in range(sample_width - 1, len(raw_data), sample_width))

        # generate the AIFF-C file contents
        with io.BytesIO() as aiff_file:
            aiff_writer = aifc.open(aiff_file, "wb")
            try:  # note that we can't use context manager, since that was only added in Python 3.4
                aiff_writer.setframerate(sample_rate)
                aiff_writer.setsampwidth(sample_width)
                aiff_writer.setnchannels(1)
                aiff_writer.writeframes(raw_data)
                aiff_data = aiff_file.getvalue()
            finally:  # make sure resources are cleaned up
                aiff_writer.close()
        return aiff_data

    def get_flac_data(self, convert_rate=None, convert_width=None):
        assert convert_width is None or (
        convert_width % 1 == 0 and 1 <= convert_width <= 3), "Sample width to convert to must be between 1 and 3 inclusive"

        if self.sample_width > 3 and convert_width is None:  # resulting WAV data would be 32-bit, which is not convertable to FLAC using our encoder
            convert_width = 3  # the largest supported sample width is 24-bit, so we'll limit the sample width to that

        # run the FLAC converter with the WAV data to get the FLAC data
        wav_data = self.get_wav_data(convert_rate, convert_width)
        flac_converter = get_flac_converter()
        print("\n\n\n")
        print(str(flac_converter))
        print('\n\n\n')
        process = subprocess.Popen([
            flac_converter,
            "--stdout", "--totally-silent",
            # put the resulting FLAC file in stdout, and make sure it's not mixed with any program output
            "--best",  # highest level of compression available
            "-",  # the input FLAC file contents will be given in stdin
        ], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
        flac_data, stderr = process.communicate(wav_data)
        return flac_data

    class Recognizer(AudioSource):
        def __init__(self):
            self.energy_threshold = 300  # minimum audio energy to consider for recording
            self.dynamic_energy_threshold = True
            self.dynamic_energy_adjustment_damping = 0.15
            self.dynamic_energy_ratio = 1.5
            self.pause_threshold = 0.8  # seconds of non-speaking audio before a phrase is considered complete
            self.operation_timeout = None  # seconds after an internal operation (e.g., an API request) starts before it times out, or ``None`` for no timeout

            self.phrase_threshold = 0.3  # minimum seconds of speaking audio before we consider the speaking audio a phrase - values below this are ignored (for filtering out clicks and pops)
            self.non_speaking_duration = 0.5  # seconds of non-speaking audio to keep on both sides of the recording

        def record(self, source, duration=None, offset=None):
            assert isinstance(source, AudioSource), "Source must be an audio source"
            assert source.stream is not None, "Audio source must be entered before recording, see documentation for ``AudioSource``; are you using ``source`` outside of a ``with`` statement?"

            frames = io.BytesIO()
            seconds_per_buffer = (source.CHUNK + 0.0) / source.SAMPLE_RATE
            elapsed_time = 0
            offset_time = 0
            offset_reached = False
            while True:  # loop for the total number of chunks needed
                if offset and not offset_reached:
                    offset_time += seconds_per_buffer
                    if offset_time > offset:
                        offset_reached = True

                buffer = source.stream.read(source.CHUNK)
                if len(buffer) == 0: break

                if offset_reached or not offset:
                    elapsed_time += seconds_per_buffer
                    if duration and elapsed_time > duration: break

                    frames.write(buffer)

            frame_data = frames.getvalue()
            frames.close()
            return AudioData(frame_data, source.SAMPLE_RATE, source.SAMPLE_WIDTH)

        def adjust_for_ambient_noise(self, source, duration=1):
            assert isinstance(source, AudioSource), "Source must be an audio source"
            assert source.stream is not None, "Audio source must be entered before adjusting, see documentation for ``AudioSource``; are you using ``source`` outside of a ``with`` statement?"
            assert self.pause_threshold >= self.non_speaking_duration >= 0

            seconds_per_buffer = (source.CHUNK + 0.0) / source.SAMPLE_RATE
            elapsed_time = 0

            # adjust energy threshold until a phrase starts
            while True:
                elapsed_time += seconds_per_buffer
                if elapsed_time > duration: break
                buffer = source.stream.read(source.CHUNK)
                energy = audioop.rms(buffer, source.SAMPLE_WIDTH)  # energy of the audio signal

                # dynamically adjust the energy threshold using asymmetric weighted average
                damping = self.dynamic_energy_adjustment_damping ** seconds_per_buffer  # account for different chunk sizes and rates
                target_energy = energy * self.dynamic_energy_ratio
                self.energy_threshold = self.energy_threshold * damping + target_energy * (1 - damping)

        def listen(self, source, timeout=None, phrase_time_limit=None):
            assert isinstance(source, AudioSource), "Source must be an audio source"
            assert source.stream is not None, "Audio source must be entered before listening, see documentation for ``AudioSource``; are you using ``source`` outside of a ``with`` statement?"
            assert self.pause_threshold >= self.non_speaking_duration >= 0

            seconds_per_buffer = (source.CHUNK + 0.0) / source.SAMPLE_RATE
            pause_buffer_count = int(math.ceil(
                self.pause_threshold / seconds_per_buffer))  # number of buffers of non-speaking audio during a phrase, before the phrase should be considered complete
            phrase_buffer_count = int(math.ceil(
                self.phrase_threshold / seconds_per_buffer))  # minimum number of buffers of speaking audio before we consider the speaking audio a phrase
            non_speaking_buffer_count = int(math.ceil(
                self.non_speaking_duration / seconds_per_buffer))  # maximum number of buffers of non-speaking audio to retain before and after a phrase

            # read audio input for phrases until there is a phrase that is long enough
            elapsed_time = 0  # number of seconds of audio read
            buffer = b""  # an empty buffer means that the stream has ended and there is no data left to read
            while True:
                frames = collections.deque()

                # store audio input until the phrase starts
                while True:
                    # handle waiting too long for phrase by raising an exception
                    elapsed_time += seconds_per_buffer
                    if timeout and elapsed_time > timeout:
                        raise WaitTimeoutError("listening timed out while waiting for phrase to start")

                    buffer = source.stream.read(source.CHUNK)
                    if len(buffer) == 0: break  # reached end of the stream
                    frames.append(buffer)
                    if len(
                            frames) > non_speaking_buffer_count:  # ensure we only keep the needed amount of non-speaking buffers
                        frames.popleft()

                    # detect whether speaking has started on audio input
                    energy = audioop.rms(buffer, source.SAMPLE_WIDTH)  # energy of the audio signal
                    if energy > self.energy_threshold: break

                    # dynamically adjust the energy threshold using asymmetric weighted average
                    if self.dynamic_energy_threshold:
                        damping = self.dynamic_energy_adjustment_damping ** seconds_per_buffer  # account for different chunk sizes and rates
                        target_energy = energy * self.dynamic_energy_ratio
                        self.energy_threshold = self.energy_threshold * damping + target_energy * (1 - damping)

                # read audio input until the phrase ends
                pause_count, phrase_count = 0, 0
                phrase_start_time = elapsed_time
                while True:
                    # handle phrase being too long by cutting off the audio
                    elapsed_time += seconds_per_buffer
                    if phrase_time_limit and elapsed_time - phrase_start_time > phrase_time_limit:
                        break

                    buffer = source.stream.read(source.CHUNK)
                    if len(buffer) == 0: break  # reached end of the stream
                    frames.append(buffer)
                    phrase_count += 1

                    # check if speaking has stopped for longer than the pause threshold on the audio input
                    energy = audioop.rms(buffer,
                                         source.SAMPLE_WIDTH)  # unit energy of the audio signal within the buffer
                    if energy > self.energy_threshold:
                        pause_count = 0
                    else:
                        pause_count += 1
                    if pause_count > pause_buffer_count:  # end of the phrase
                        break

                # check how long the detected phrase is, and retry listening if the phrase is too short
                phrase_count -= pause_count  # exclude the buffers for the pause before the phrase
                if phrase_count >= phrase_buffer_count or len(
                    buffer) == 0: break  # phrase is long enough or we've reached the end of the stream, so stop listening

            # obtain frame data
            for i in range(
                        pause_count - non_speaking_buffer_count): frames.pop()  # remove extra non-speaking frames at the end
            frame_data = b"".join(list(frames))

            return AudioData(frame_data, source.SAMPLE_RATE, source.SAMPLE_WIDTH)

        def listen_in_background(self, source, callback, phrase_time_limit=None):
            assert isinstance(source, AudioSource), "Source must be an audio source"
            running = [True]

            def threaded_listen():
                with source as s:
                    while running[0]:
                        try:  # listen for 1 second, then check again if the stop function has been called
                            audio = self.listen(s, 1)
                        except WaitTimeoutError:  # listening timed out, just try again
                            pass
                        else:
                            if running[0]: callback(self, audio)

            def stopper():
                running[0] = False
                listener_thread.join()  # block until the background thread is done, which can be up to 1 second

            listener_thread = threading.Thread(target=threaded_listen)
            listener_thread.daemon = True
            listener_thread.start()
            return stopper

        def recognize_sphinx(self, audio_data, language="en-US", keyword_entries=None, show_all=False):
            assert isinstance(audio_data, AudioData), "``audio_data`` must be audio data"
            assert isinstance(language, str), "``language`` must be a string"
            assert keyword_entries is None or all(
                isinstance(keyword, (type(""), type(u""))) and 0 <= sensitivity <= 1 for keyword, sensitivity in
                keyword_entries), "``keyword_entries`` must be ``None`` or a list of pairs of strings and numbers between 0 and 1"

            # import the PocketSphinx speech recognition module
            try:
                from pocketsphinx import pocketsphinx
            except ImportError:
                raise RequestError("missing PocketSphinx module: ensure that PocketSphinx is set up correctly.")
            except ValueError:
                raise RequestError(
                    "bad PocketSphinx installation detected; make sure you have PocketSphinx version 0.0.9 or better.")

            language_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), "pocketsphinx-data",
                                              language)
            if not os.path.isdir(language_directory):
                raise RequestError("missing PocketSphinx language data directory: \"{}\"".format(language_directory))
            acoustic_parameters_directory = os.path.join(language_directory, "acoustic-model")
            if not os.path.isdir(acoustic_parameters_directory):
                raise RequestError("missing PocketSphinx language model parameters directory: \"{}\"".format(
                    acoustic_parameters_directory))
            language_model_file = os.path.join(language_directory, "language-model.lm.bin")
            if not os.path.isfile(language_model_file):
                raise RequestError("missing PocketSphinx language model file: \"{}\"".format(language_model_file))
            phoneme_dictionary_file = os.path.join(language_directory, "pronounciation-dictionary.dict")
            if not os.path.isfile(phoneme_dictionary_file):
                raise RequestError(
                    "missing PocketSphinx phoneme dictionary file: \"{}\"".format(phoneme_dictionary_file))

            # create decoder object
            config = pocketsphinx.Decoder.default_config()
            config.set_string("-hmm",
                              acoustic_parameters_directory)  # set the path of the hidden Markov model (HMM) parameter files
            config.set_string("-lm", language_model_file)
            config.set_string("-dict", phoneme_dictionary_file)
            config.set_string("-logfn", os.devnull)  # disable logging (logging causes unwanted output in terminal)
            decoder = pocketsphinx.Decoder(config)

            # obtain audio data
            raw_data = audio_data.get_raw_data(convert_rate=16000,
                                               convert_width=2)  # the included language models require audio to be 16-bit mono 16 kHz in little-endian format

            # obtain recognition results
            if keyword_entries is not None:  # explicitly specified set of keywords
                with tempfile.NamedTemporaryFile("w") as f:
                    # generate a keywords file - Sphinx documentation recommendeds sensitivities between 1e-50 and 1e-5
                    f.writelines("{} /1e{}/\n".format(keyword, 100 * sensitivity - 110) for keyword, sensitivity in
                                 keyword_entries)
                    f.flush()

                    # perform the speech recognition with the keywords file (this is inside the context manager so the file isn;t deleted until we're done)
                    decoder.set_kws("keywords", f.name)
                    decoder.set_search("keywords")
                    decoder.start_utt()  # begin utterance processing
                    decoder.process_raw(raw_data, False,
                                        True)  # process audio data with recognition enabled (no_search = False), as a full utterance (full_utt = True)
                    decoder.end_utt()  # stop utterance processing
            else:  # no keywords, perform freeform recognition
                decoder.start_utt()  # begin utterance processing
                decoder.process_raw(raw_data, False,
                                    True)  # process audio data with recognition enabled (no_search = False), as a full utterance (full_utt = True)
                decoder.end_utt()  # stop utterance processing

            if show_all: return decoder

            # return results
            hypothesis = decoder.hyp()
            if hypothesis is not None: return hypothesis.hypstr
            raise UnknownValueError()  # no transcriptions available

        def recognize_google(self, audio_data, key=None, language="en-US", show_all=False):
            assert isinstance(audio_data, AudioData), "``audio_data`` must be audio data"
            assert key is None  or isinstance(key, str), "``key`` must be ``None`` or a string"
            assert isinstance(language, str), "``language`` must be a string"

            flac_data = audio_data.get_flac_data(
                convert_rate=None if audio_data.sample_rate >= 8000 else 8000, #8000 -> 200
                convert_width=2
            )
            if key is None: key = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw"
            url = "http://www.google.com/speech-api/v2/recognize?{}".format(urlencode({
                "client": "chromium",
                "lang": language,
                "key": key,
            }))
            request = Request(url, data=flac_data, headers={"Content-Type": "audio/x-flac; rate={}".format(audio_data.sample_rate)})

            #Obtain Audio Transcription results
            try:
                response = urlopen(request, timeout=self.operation_timeout)
            except HTTPError as e:
                raise RequestError("recognition request failed: {}".format(e.reason))
            except URLError as e:
                raise Recognizer("recognition connection faile: {}".format(e.reason))
            response_text = response.read().decode("utf-8")

            #ignore any blank blocks
            actual_result = []
            for line in response_text.split("\n"):
                if not line: continue
                result = json.loads(line)["result"]
                if len(result) != 0:
                    actual_result = result[0]
                    break
            
            #return results
            if show_all: return actual_result
            if not isinstance(actual_result, dict) or len(actual_result.get("alternative", [])) == 0: raise UnknownValueError()

            #return alternative with highest confidence score
            best_hypothesis = max(actual_result["alternative"], key=lambda alternative: alternative["confidence"])
            if "transcript" not in best_hypothesis: raise UnknownValueError()
            return best_hypothesis["transcript"]
