import sys
import json
import serial
from datetime import datetime
import ntpath
from threading import Timer

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
        try:
            signal = int(read_serial)
        except:
            signal = -1
        if signal == 0:
            n = 0
        elif signal == 1:
            n += 1
        write_json(projector_id, n)

def begin():
        ser.write(b'1')

if __name__ == "__main__":
    try:
        ser = serial.Serial('/dev/ttyUSB0',9600)
    except:
        ser = serial.Serial('/dev/ttyUSB1',9600)
    storage_client = storage.Client()
    bucket_name = "pav-data"
    bucket = storage_client.bucket(bucket_name)
    args = sys.argv
    projector_id = args[1]
    Timer(4.0,begin).start()
    run(projector_id)