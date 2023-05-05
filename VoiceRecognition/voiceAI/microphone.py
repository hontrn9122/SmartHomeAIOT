from voiceAI.audio import *

class Microphone(AudioSource):
    def __init__(self, device_index=None, sample_rate=None, chunk_size=1024):
        assert device_index is None or isinstance(device_index, int), "Device Index must be None or an Integer"
        assert sample_rate is None or (isinstance(sample_rate, int) and sample_rate > 0),"Sample rate must be None or a positive Integer"
        assert isinstance(chunk_size, int) and chunk_size > 0, "Chunk Size must be a positive integer"

        #setup PyAudio
        self.pyaudio_module = self.get_pyaudio()
        audio = self.pyaudio_module.PyAudio()
        try:
            count = audio.get_device_count()#obtain device count
            if device_index is not None:
                assert 0 <= device_index < count, "Device index out of range ({} devices available; device index should be between 0 and {} inclusive)".format(count, count - 1)
            if sample_rate is None: #automatically set the sample rate to teh hardware's default sample rate
                device_info = audio.get_device_info_by_index(device_index) if device_index is not None else audio.get_default_input_device_info()
                assert isinstance(device_info.get("defaultSampleRate"), (float, int)) and device_info["defaultSampleRate"] > 0, "Invalid device info returned from PyAudio: {}".format(device_info)
                sample_rate = int(device_info["defaultSampleRate"])
        except:
            audio.terminate()
            raise

        self.device_index = device_index
        self.format = self.pyaudio_module.paInt16 #16-bit int sampling
        self.SAMPLE_WIDTH = self.pyaudio_module.get_sample_size(self.format) #size of each sample
        self.SAMPLE_RATE = sample_rate #sample rate in Hertz
        self.CHUNK = chunk_size #number of frames stored in each buffer

        self.audio = None
        self.stream = None

    @staticmethod
    def get_pyaudio():
        """Imports the pyAudio module and checks its version"""
        try:
            import pyaudio
        except ImportError:
            raise AttributeError("Could not find PyAudio: check installation")
        from distutils.version import LooseVersion
        if LooseVersion(pyaudio.__version__) < LooseVersion("0.2.9"):
            raise AttributeError("PyAudio 0.2.9 or later is required (found version{})".format(pyaudio.__version__))
        return pyaudio

    @staticmethod
    def list_microphone_names():
        """List of available Microphones"""
        audio = Microphone.get_pyaudio().PyAudio()
        try:
            result = []
            for i in range(audio.get_device_count()):
                device_info = audio.get_device_info_by_index(i)
                result.append(device_info.get("name"))
        finally:
            audio.terminate()
        return result

    def __enter__(self):
        assert self.stream is None, "This audio source id already inside a context manager"
        self.audio = self.pyaudio_module.PyAudio()
        try:
            self.stream = Microphone.MicrophoneStream(
                self.audio.open(
                    input_device_index=self.device_index, channels=1,
                    format=self.format, rate=self.SAMPLE_RATE, frames_per_buffer=self.CHUNK,
                    input=True, #stream is an input stream
                )
            )
        except:
            self.audio.terminate()
            raise
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        try:
            self.stream.close()
        finally:
            self.stream = None
            self.audio.terminate()

    class MicrophoneStream(object):
        def __init__(self, pyaudio_stream):
            self.pyaudio_stream = pyaudio_stream

        def read(self, size):
            return self.pyaudio_stream.read(size, exception_on_overflow=False)

        def close(self):
            try:
                if not self.pyaudio_stream.is_stopped():
                    self.pyaudio_stream.stop_stream()
            finally:
                self.pyaudio_stream.close()
