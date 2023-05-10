import torch
import torchvision
import os
from torch import nn
from torchvision import transforms
from facenet_pytorch import MTCNN
import glob
from PIL import Image
import numpy as np
from flask import Flask, request, make_response
import cv2
from flask_cors import CORS
import torch.nn.functional as F

device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)

mtcnn = MTCNN(thresholds=[0.6, 0.6, 0.7], margin=20, keep_all=False, post_process=False, device=device, image_size=112)
model_path = os.path.join('model', 'model_scripted.pt')
face_list_path = os.path.join('face_list', 'face_list.pt')
if not os.path.exists(face_list_path):
    torch.save({}, face_list_path)

model = torch.jit.load(model_path)
model.eval()
print(model)

# Initialize Flask Sever Backend
app = Flask(__name__)

# Apply Flask CORS
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = './receive'


def trans(img):
    normalize = transforms.Normalize(mean=[127.5, 127.5, 127.5],
                                     std=[127.5, 127.5, 127.5])
    data_transform = transforms.Compose([
        normalize
    ])
    return data_transform(img)


def face_extraction(img_path):
    img = cv2.imread(img_path)
    print(img)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    face_img = mtcnn(img)
    if face_img is None:
        return None
    face_img = trans(face_img).unsqueeze(0).to(device)
    print(face_img.shape)
    return face_img


@app.route('/faceapi/checkname', methods=['POST'])
def check_name():
    name = request.get_json()['name']
    face_list = torch.load(face_list_path)
    if name in face_list.keys():
        msg = 'Invalid'
    else:
        msg = 'Valid'
    response = make_response(msg, 200)
    response.headers['Content-Type'] = 'text/plain'
    return response


@app.route('/faceapi/register', methods=['POST'])
def face_registration():
    tmp_img_path = os.path.join(app.config['UPLOAD_FOLDER'], 'regis_tmp.jpg')

    file = request.files['file']
    name = request.form['name']
    count = int(request.form['count'])
    print(name)
    file.save(tmp_img_path)

    face_img = face_extraction(tmp_img_path)
    if face_img is None:
        msg = "Failed"
        response = make_response(msg, 200)
        response.headers['Content-Type'] = 'text/plain'
        return response

    with torch.inference_mode():
        face_embedding = model(face_img)
    face_embedding = F.normalize(face_embedding, dim=1)
    print(face_embedding)
    face_list = torch.load(face_list_path)
    if count > 0:
        embedding_list = [face_list[name] for _ in range(count)] + [face_embedding]
        face_list[name] = torch.mean(torch.cat(embedding_list, dim=0), dim=0, keepdim=True)
    else:
        face_list[name] = face_embedding
    torch.save(face_list, face_list_path)
    msg = "Successful"
    response = make_response(msg, 200)
    response.headers['Content-Type'] = 'text/plain'
    return response


@app.route('/faceapi/verify', methods=['POST'])
def face_verify():
    tmp_img_path = os.path.join(app.config['UPLOAD_FOLDER'], 'verify_tmp.jpg')

    file = request.files['file']
    file.save(tmp_img_path)

    face_img = face_extraction(tmp_img_path)
    if face_img is None:
        # msg = "No face is detected!"
        msg = "Failed"
        response = make_response(msg, 200)
        response.headers['Content-Type'] = 'text/plain'
        return response
    with torch.inference_mode():
        face_embedding = model(face_img)
    face_embedding = F.normalize(face_embedding, dim=1)

    face_list = torch.load(face_list_path)
    name_list = list(face_list.keys())
    print(name_list)
    if len(name_list) == 0:
        # msg = "Unverified identity!"
        msg = "Unknown"
        response = make_response(msg, 200)
        response.headers['Content-Type'] = 'text/plain'
        return response
    face_tensor = torch.cat(tuple([face for face in face_list.values()]), dim=0)
    cos_distance = face_embedding.mm(torch.transpose(face_tensor, 0, 1))
    print(cos_distance)
    pred_result = torch.where(cos_distance > 0.2, 1.0, 0.0).squeeze(0)
    true_index = torch.nonzero(pred_result, as_tuple=False).cpu().numpy().flatten()
    print(true_index)
    # return 'test'
    if len(true_index) == 0:
        msg = "Unknown"
    else:
        msg = ', '.join([name_list[idx] for idx in true_index])
    response = make_response(msg, 200)
    response.headers['Content-Type'] = 'text/plain'
    return response


# Start Backend
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='6868')
