from dotenv import dotenv_values

config = dotenv_values(".env")

MONGODB_URL = config["MONGODB_URL"]
CLIENT_URL = config["CLIENT_URL"]
SECRET_KEY = config["SECRET_KEY"]
ALGORITHM = config["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = config["ACCESS_TOKEN_EXPIRE_MINUTES"]
