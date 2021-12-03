import RPi.GPIO as g
from time import sleep
from datetime import datetime
import json
import sys


global revcount
revcount = 0
global projector_id
global q_audios
global n_audio
n_audio = 0

def increaserev(channel):
    global revcount
    revcount += 1

def setup_gpio(n):
    gpio_n = 4
    g.setmode(g.BCM)
    g.setup(gpio_n, g.IN)
    g.add_event_detect(gpio_n, g.FALLING, 
        callback=increaserev) #, bouncetime=50)

date_format = "%d-%b-%Y %H:%M:%S.%f"
save_path = ""

def write_json(n,now):
    out = {"n": n, "time":now.strftime(date_format)}
    print(f"{projector_id} | Play : {n} - {out['time']}") 
    with open(f"projectors_playing/{projector_id}.json",'w+') as f:
        json.dump(out,f)

def begin(now):
    global n_audio
    n_audio = 0
    write_json(0,now)

def next(now):
    global n_audio
    global q_audios
    n_audio+=1
    n_audio%=q_audios
    write_json(n_audio,now)

def run(bounce,period):
    global revcount
    bps = period/bounce
    reg = 0
    now = datetime.now()
    while True:
        was_zero = False
        pulses = 0
        for i in range(int(bps)):
            sleep(bounce)
            if revcount == 0 and not was_zero:
                if (reg==0 and pulses==0):
                    now = datetime.now()
                was_zero = True
                pulses+=1
            elif revcount != 0:
                was_zero = False
            revcount = 0
        print(f"{projector_id} | Detecto {pulses} pulso(s)")
        if pulses == 2:
            begin(now)
        elif pulses == 1 and reg == 0:
            reg = 1
            continue
        elif (reg+pulses) == 2:
            begin(now)
        elif (reg+pulses) == 1:
            next(now)
        reg = 0

                # [0            1           2           3   ]
args = sys.argv # [this_script,projector_id,q_audios,gpio_n]
setup_gpio(int(args[3]))
projector_id = args[1]
q_audios = int(args[2])
run(25/1000,0.5)

    






