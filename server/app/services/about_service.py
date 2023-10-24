import json
import os
import time


class AboutService:
    def create_json(self, ip):
        with open(os.path.join(os.getcwd(), "about.json"), "r") as outfile:
            template = json.load(outfile)
        template["client"]["host"] = ip
        template["server"]["current_time"] = int(time.time())
        with open(os.path.join(os.getcwd(), "about.json"), "w") as outfile:
            json.dump(template, outfile, indent=4)
