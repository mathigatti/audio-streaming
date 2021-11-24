from datetime import datetime
import json

date_format = "%d-%b-%Y %H:%M:%S.%f"

def save(projector_id, filename):
	now = datetime.now()
	with open(f"projectors_playing/{projector_id}.json",'w') as f:
		json.dump({"filename":filename, "time": now.strftime(date_format)},f)

if __name__ == "__main__":
	save("1", "test.mp3")