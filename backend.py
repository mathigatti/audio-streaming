from datetime import datetime
import json

import flask
from flask import Flask, render_template

from register import date_format

app = Flask(__name__)

with open("audios/audios.json",'r') as f:
    audios = json.load(f)

with open("audios/captions.json", 'r') as f:
    captions = json.load(f)

with open("audios/code_authors.json", 'r') as f:
    authors = json.load(f)

def load(projector_id):
    print(projector_id)
    with open(f"projectors_playing/{projector_id[0:2]}.json", 'r') as f:
        data = json.load(f)
        date_string = data["time"]
        audio_n = data["n"]

    audio_id = projector_id+(str(audio_n).zfill(4))
    caption_id = audios[audio_id]['caption_id']
    code_author_id = audios[audio_id]['code_author_id']

    song_start_time = datetime.strptime(date_string, date_format)
    now = datetime.now()
    elapsed_time = (now - song_start_time).total_seconds()
    elapsed_time = elapsed_time % 10 # Sumo esto para testear. Para que el contador vaya de 0 a 1 todo el tiempo

    data = {

            "author": authors[code_author_id], 
            "caption": captions[caption_id],
            "audio_url": f"https://storage.cloud.google.com/pav-audios/{projector_id}/{audio_id}.mp3",
            "current_time": elapsed_time

            }

    response = flask.jsonify(data)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/projector/<projector>')
def playaudio(projector):
    return load(projector)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, threaded=True,port=5000)
    with open(f"audios/audios.json", 'r') as f:
        audios = json.load(f)
