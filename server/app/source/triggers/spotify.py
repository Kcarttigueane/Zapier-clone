import logging
import requests
from datetime import datetime
from fastapi import status

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_spotify_likes(token) -> TriggerAnswer | None:
    url = "https://api.spotify.com/v1/me/tracks"

    headers = {"Authorization": f"Bearer {token}"}
    params = {"limit": 20}

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != status.HTTP_200_OK:
        logger.info(f"Status Code: {response.status_code}")
        logger.info(f"response message: {response.text}")
        return None

    data = response.json()

    song_names = [
        track["track"]["name"] + " " + track["track"]["artists"][0]["name"]
        for track in data["items"]
    ]
    return TriggerAnswer(objs=song_names)


def check_spotify_like(
    user: UserOutDTO, last_polled: datetime, first_poll: bool
) -> TriggerAnswer | None:
    if service_auth := get_service_auth(user, "spotify"):
        token = service_auth.access_token
    else:
        return None

    try:
        return extract_spotify_likes(token)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
        return None
