import json
import os


template = {
    "client": {
        "host": "REPLACE_HOST",
    },
    "server": {},
    "current_time": "REPLACE_CURRENT_TIME",
    "services": [
        {
            "name": "REPLACE_SERVICE_NAME",
            "actions": [
                {
                    "name": "REPLACE_ACTION_NAME",
                    "description": "REPLACE_ACTION_DESCRIPTION",
                },
            ],
            "reactions": [
                {
                    "name": "REPLACE_REACTION_NAME",
                    "description": "REPLACE_REACTION_DESCRIPTION",
                }
            ],
        }
    ],
}


def create_json(ip, date):
    template["client"]["host"] = ip
    template["current_time"] = date
    with open(os.path.join(os.getcwd(), "app", "about.json"), "w") as outfile:
        json.dump(template, outfile, indent=4)
