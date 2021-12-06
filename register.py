import sys
import json
import serial
from datetime import datetime

ser = serial.Serial('/dev/ttyACM0',9600)
date_format = "%d-%b-%Y %H:%M:%S.%f"

def write_json(projector_id, n):
    now = datetime.now()
    n = n+1 # start counting from 1
    
    out = {"n": n, "time":now.strftime(date_format)}
    print(f"{projector_id} | Play : {n} - {out['time']}") 
    with open(f"projectors_playing/{projector_id}.json",'w+') as f:
        json.dump(out,f)

def run(projector_id, total_audios):
    n = 0
    while True:
        read_serial=ser.readline()
        signal = int(read_serial)
        if signal == 0:
            n = 0
        else:
            n += 1 % total_audios
        write_json(projector_id, n)

if __name__ == "__main__":
    args = sys.argv # [this_script, projector_id, q_audios]
    projector_id = args[1]
    total_audios = int(args[2])
    run(projector_id,total_audios)