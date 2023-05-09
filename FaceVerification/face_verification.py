import torch
import torchvision
import os
from torch import nn
from torchvision import transforms
from facenet_pytorch import MTCNN
import glob
from PIL import Image
import numpy as np
from flask import Flask, request, Response
import jsonpickle
import cv2

device = "cuda" if torch.cuda.is_available() else "cpu"
print(device)

mtcnn = mtcnn = MTCNN(thresholds=[0.7, 0.7, 0.8], keep_all=True, device=device)
model_path = os.path.join('model', 'model_scripted.pt')
model = torch.jit.load(model_path)
model.eval()

@app.route('/faceapi/register', methods=['POST'])
def face_registration():
    file = request.files['file']

