import logging
from googleapiclient.discovery import build
from datetime import datetime

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_google_credentials, get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_youtube_likes(credentials):
    service = build("youtube", "v3", credentials=credentials, cache_discovery=False)
    request = service.videos().list(part="snippet", myRating="like", maxResults=10)
    response = request.execute()

    objs = [video["snippet"]["title"] for video in response.get("items", [])]
    return TriggerAnswer(objs=objs)


def check_youtube_like(user: UserOutDTO, last_polled: datetime) -> TriggerAnswer | None:
    if service_auth := get_service_auth(user, "youtube"):
        credentials = get_google_credentials(service_auth.access_token)
    else:
        return None

    try:
        return extract_youtube_likes(credentials)

    except Exception as e:
        logger.info(f"An error occurred: {e}")
        return None
