from datetime import datetime
import json

from flask import Flask, render_template

from arduino_register import date_format

app = Flask(__name__)

def load(projector_id):
    with open(f"projectors_playing/{projector_id}.json", 'r') as f:
        data = json.load(f)
        date_string = data["time"]
        audio = data["filename"]

    song_start_time = datetime.strptime(date_string, date_format)
    now = datetime.now()

    data = {"filename": audio, "seconds_since_started": (now - song_start_time).total_seconds()}
    return json.dumps(data)

@app.route('/<projector>')
def playaudio(projector):
    return load(projector)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, threaded=True,port=5000)
