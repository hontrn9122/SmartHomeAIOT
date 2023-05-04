from flask import Flask
from speech import *

app = Flask(__name__)

@app.route('/get', methods = ['GET'])
def getAPI():
    path = 'C:\\Users\\Tai\\OneDrive\\Desktop\\Computer Vision\\SmartHome\\VoiceRecognition\\speech2text.txt'
    speech2text(path)
    file = open(path, 'r')
    taskList = file.read().split('\n')
    result = taskList[1:-1]
    return result

if __name__ == "__main__":
    app.run()
