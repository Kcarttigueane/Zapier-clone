from dotenv import dotenv_values

config = dotenv_values(".env")

MONGODB_URL = config["MONGODB_URL"]
CLIENT_URL = config["CLIENT_URL"]
SECRET_KEY = config["SECRET_KEY"]
ALGORITHM = config["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = config["ACCESS_TOKEN_EXPIRE_MINUTES"]
GITHUB_CLIENT_ID = config["GITHUB_CLIENT_ID"]
GITHUB_CLIENT_SECRET = config["GITHUB_CLIENT_SECRET"]
OAUTHLIB_INSECURE_TRANSPORT = config["OAUTHLIB_INSECURE_TRANSPORT"]
SPOTIFY_CLIENT_ID = config["SPOTIFY_CLIENT_ID"]
SPOTIFY_CLIENT_SECRET = config["SPOTIFY_CLIENT_SECRET"]
GOOGLE_CLIENT_ID = config["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = config["GOOGLE_CLIENT_SECRET"]
DISCORD_CLIENT_ID = config["DISCORD_CLIENT_ID"]
DISCORD_CLIENT_SECRET = config["DISCORD_CLIENT_SECRET"]
DISCORD_BOT_TOKEN = config["DISCORD_BOT_TOKEN"]

POLLED_TIME = 0.2

action_dict_format = {"head": "", "body": "", "tail": "", "last_checked": None}