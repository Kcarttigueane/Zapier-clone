from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.source.helpers import get_google_credentials, get_service_auth
from app.schemas.users_dto import UserOutDTO
from app.schemas.triggers_dto import TriggerAnswer


def check_youtube_like(user: UserOutDTO) -> TriggerAnswer | None:
    service_auth = get_service_auth(user, "youtube")

    if not service_auth:
        return None

    credentials = get_google_credentials(service_auth.access_token)

    try:
        service = build("youtube", "v3", credentials=credentials, cache_discovery=False)
        request = service.videos().list(part="snippet", myRating="like", maxResults=10)
        response = request.execute()

        objs = []
        for video in response.get("items", []):
            objs.append(video["snippet"]["title"])
        return TriggerAnswer(objs=objs)

    except HttpError as error:
        print(f"An error occurred: {error}")
