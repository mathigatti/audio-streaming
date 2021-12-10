import sys
import json
import serial
from datetime import datetime
import ntpath

from google.cloud import storage

date_format = "%d-%b-%Y %H:%M:%S.%f"

def upload_file(filepath,blob_path=None):
    if blob_path is None:
        blob_path = ntpath.basename(filepath)
    blob = bucket.blob(blob_path)
    blob.upload_from_filename(filepath)

def write_json(projector_id, n):
    now = datetime.utcnow()
    n = n+1 # start counting from 1
    
    out = {"n": n, "time":now.strftime(date_format)}
    print(f"{projector_id} | Play : {n} - {out['time']}") 

    json_path = f"projectors_playing/{projector_id}.json"
    with open(json_path,'w+') as f:
        json.dump(out,f)

    upload_file(json_path)

def run(projector_id):
    n = 0
    while True:
        read_serial=ser.readline()
        signal = int(read_serial)
        if signal == 0:
            n = 0
        else:
            n += 1
        write_json(projector_id, n)

if __name__ == "__main__":
    ser = serial.Serial('/dev/ttyACM0',9600)

    storage_client = storage.Client()
    bucket_name = "pav-data"
    bucket = storage_client.bucket(bucket_name)

    args = sys.argv
    projector_id = args[1]
    run(projector_id)