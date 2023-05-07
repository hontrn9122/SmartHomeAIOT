import os
import logging
import logging.handlers
import subprocess
import json
from multiprocessing.pool import ThreadPool

def converter(input_filename):
    input_file = input_filename
    output_file = input_filename[:-4] + ".wav"

    if input_file.endswith(".mp4"):
        cmd = ["ffmpeg", "-i", input_file, "-ac", "1", "-ar", "44100", output_file]
    elif input_file.endswith(".aac"):
        cmd = ["ffmpeg", "-i", input_file, output_file]
    elif input_file.endswith(".ogg"):
        cmd = ["ffmpeg", "-i", input_file, output_file]
    elif input_file.endswith(".ac3"):
        cmd = ["ffmpeg", "-i", input_file, output_file]

    subprocess.run(cmd, shell=True)
    return output_file
