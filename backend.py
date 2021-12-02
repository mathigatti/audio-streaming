from datetime import datetime
import json

from flask import Flask, render_template

from arduino_register import date_format

app = Flask(__name__)

audios = {}

def load(projector_id):
    with open(f"projectors_playing/{projector_id[0:2]}.json", 'r') as f:
        data = json.load(f)
        date_string = data["time"]
        audio_n = data["n"]

    filename = projector_id+(str(audio_n).zfill(4))
    caption_id = audios[filename]['caption_id']
    code_author_id = audios[filename]['code_author_id']

    song_start_time = datetime.strptime(date_string, date_format)
    now = datetime.now()

    data = {"filename": filename, 
            "caption_id": caption_id,
            "code_author_id": code_author_id,
            "current_time": (now - song_start_time).total_seconds()}

    return json.dumps(data)

@app.route('/<projector>')
def playaudio(projector):
    return load(projector)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, threaded=True,port=5000)
    with open(f"audios/audios.json", 'r') as f:
        audios = json.load(f)
