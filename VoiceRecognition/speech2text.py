from flask import Flask, request
from recordToCommand import *
import json
from audio_converter import *
from werkzeug.utils import secure_filename

app = Flask(__name__)

SERVER_IP = "192.168.2.10"

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

@app.route('/upload', methods=['POST'])
def upload_file():
    print("go to the upload ..........")
    print(request.files)
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    
    if file.filename == '':
        return 'No selected file'
    
    filename = secure_filename(file.filename)
    filepath = os.path.join('/tmp', filename)
    file.save(filepath)
    result = converter(filepath)
    return rec2Command(result)


if __name__ == "__main__":
    app.run(
        debug=True,
        host="192.168.2.10"
    )

