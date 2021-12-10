from datetime import datetime
import json
import ntpath
import os

from google.cloud import storage

date_format = "%d-%b-%Y %H:%M:%S.%f"

with open("audios/audios.json",'r') as f:
    audios = json.load(f)

with open("audios/captions.json", 'r') as f:
    captions = json.load(f)

with open("audios/code_authors.json", 'r') as f:
    authors = json.load(f)

def download(filepath):
    storage_client = storage.Client()
    bucket_name = "pav-data"
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(ntpath.basename(filepath))
    blob.download_to_filename(filepath)

def load(projector_id):
    data_path = f"/tmp/{projector_id[0:2]}.json"
    download(data_path)
    with open(data_path, 'r') as f:
        data = json.load(f)
        date_string = data["time"]
        audio_n = data["n"]

    os.remove(data_path)

    audio_id = projector_id+(str(audio_n).zfill(4))
    caption_id = audios[audio_id]['caption_id']
    code_author_id = audios[audio_id]['code_author_id']

    song_start_time = datetime.strptime(date_string, date_format)
    now = datetime.utcnow()
    elapsed_time = (now - song_start_time).total_seconds()
    #elapsed_time = elapsed_time % 10 # Sumo esto para testear. Para que el contador vaya de 0 a 1 todo el tiempo

    data = {

            "author": authors[code_author_id], 
            "caption": captions[caption_id],
            "audio_url": f"/audios/{projector_id}/{audio_id}.mp3",
            "current_time": elapsed_time

    }

    return data

def pidgeon(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    projector = request.args.get('projector')
    data = load(projector)
    return (json.dumps(data), 200, headers)