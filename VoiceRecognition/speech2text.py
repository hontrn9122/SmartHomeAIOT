from flask import Flask
from recordToCommand import *
import json
from audio_converter import *

app = Flask(__name__)

@app.route('/get', methods = ['GET'])
def getAPI():
    recordFromApp = "sound.mp4"
    input_filename = converter(recordFromApp)
    input = rec2Command(input_filename)
    result = "{"
    for index in range(len(input)):
        result += """{\"id\": """ + str(index + 1) + "," + """\"command\"""" + ": \"" + input[index] + """\"}"""
        if index != len(input) - 1: result += ","
    result += "}"
    return result

if __name__ == "__main__":
    app.run()

