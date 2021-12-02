from datetime import datetime
import json

date_format = "%d-%b-%Y %H:%M:%S.%f"

def save(projector_id, n):
	now = datetime.now()
	with open(f"projectors_playing/{projector_id}.json",'w') as f:
		json.dump({"n":n, "time": now.strftime(date_format)},f)

if __name__ == "__main__":
	save("p1", 1)