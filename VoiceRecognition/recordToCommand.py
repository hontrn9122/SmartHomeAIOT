from voiceAI.microphone import *
from voiceAI.recognizer import *
from voiceAI.audiofile import *

def rec2Command(filename):
    r = Recognizer()
    with AudioFile(filename) as source:
        audio = r.record(source)
        try:
            s = r.recognize_google(audio)
            activation = "banana"
            ending = "thank you"
            command = ["turn on the lights", "turn off the lights", "turn on the fan", "turn off the fan", "open the door", "close the door"]
            s = s[s.find(activation):s.find(ending)] if s.find(ending) != -1 else ""
            temp = s.split(' ')
            result = []
            for index in range(1, len(temp)):
                if temp[index] in ["lights", "fan"]:
                    if index >= 2 and temp[index-3] == 'turn' and temp[index-1] == 'the' and (temp[index-2] in ["on", "off"]):
                        result.append(temp[index-3] + " " + temp[index-2] + " " + temp[index-1] + " " + temp[index])
                elif temp[index] == 'door':
                    if index >= 1 and temp[index-1] == 'the' and (temp[index-2] in ['open', 'close']):
                        result.append(temp[index-2] + " " + temp[index-1] + " " + temp[index])
            print(result)
            return result
        except Exception as e:
            print("Exception: " + str(e))
