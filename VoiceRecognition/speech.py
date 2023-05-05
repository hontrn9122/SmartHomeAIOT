from voiceAI.microphone import *
from voiceAI.recognizer import *

def recognize_speech(recognizer: Recognizer, microphone: Microphone):
    if not isinstance(recognizer, Recognizer):
        raise TypeError("Invalid type: recognizer")
    
    if not isinstance(microphone, Microphone):
        raise TypeError("Invalid type: microphone")

    with microphone as source:
        recognizer.adjust_for_ambient_noise(source, duration = 5)
        listener = recognizer.listen(source)
    
    response = {
        "success": True,
        "error": None,
        "transcription": None
    }

    try:
        response["transcription"] = recognizer.recognize_google(listener)
    except RequestError:
        response["success"] = False
        response["error"] = "API is currently unavailable"
    
    except UnknownValueError:
        response["success"] = False
        response["error"] = "Unable to recognize speech"

    return response


def speech2text(filename):
    speech = Recognizer()
    microphone = Microphone()
    text = open(filename, 'w')

    with microphone as source:
        speech.adjust_for_ambient_noise(source)
        print("Please say something")

        while True:
            response = recognize_speech(Recognizer(), Microphone())
            #print(response)
            if response["error"] != None:
                print("ERROR: ", response["error"])

            if response["transcription"] != 'hello world':
                print("Invalid activation command: " + response["transcription"] + '\n')
            
            else:
                text.write(response["transcription"])
                text.write('\n')
                break

        print("Recognizing your command...")

        while True:
            response = recognize_speech(Recognizer(), Microphone())

            if response["error"] != None:
                print("ERROR: ", response["error"])

            elif response["transcription"] != 'thank you':
                try:
                    print("You have said \n" + response["transcription"])
                    text.write(response["transcription"])
                    text.write('\n')
                    print("Audio recorded successfully\n")

                except Exception as e:
                    print("Error: " + str(e))

            else:
                break
        
        text.close()


def handleTask(filename):
    file = open(filename, 'r')
    taskList = file.read().split('\n')

    for task in taskList[1:-1]:
        print("Your command: ", task)

speech2text('speech2text.txt')
handleTask('speech2text.txt')
