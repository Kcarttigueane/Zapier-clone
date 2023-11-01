import logging
from googleapiclient.discovery import build

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_google_credentials, get_service_auth


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def check_playlist_created(service):
    playlists = service.playlists().list(part="snippet", mine=True).execute()
    return next(
        (
            playlist["id"]
            for playlist in playlists.get("items", [])
            if playlist["snippet"]["title"] == "Area"
        ),
        None,
    )


def create_playlist(service):
    if playlist_id := check_playlist_created(service):
        return playlist_id

    playlist_details = {
        "snippet": {
            "title": "Area",
            "description": "Your automatically updated playlist created by Area",
        },
        "status": {"privacyStatus": "public"},
    }

    request = service.playlists().insert(part="snippet,status", body=playlist_details)
    response = request.execute()
    return response["id"]


def get_video_ids_in_playlist(service, playlist_id):
    playlist_items = (
        service.playlistItems()
        .list(part="snippet", playlistId=playlist_id, maxResults=50)
        .execute()
    )

    return [
        item["snippet"]["resourceId"]["videoId"]
        for item in playlist_items.get("items", [])
    ]


def add_songs_to_playlist(service, playlist_id, songs):
    playlist_video_ids = get_video_ids_in_playlist(service, playlist_id)
    for song in songs:
        search_response = (
            service.search()
            .list(q=song, type="video", part="id", maxResults=1)
            .execute()
        )
        video_id = search_response["items"][0]["id"]["videoId"]
        if video_id not in playlist_video_ids:
            playlist_item_details = {
                "snippet": {
                    "playlistId": playlist_id,
                    "resourceId": {"kind": "youtube#video", "videoId": video_id},
                }
            }
            request = service.playlistItems().insert(
                part="snippet", body=playlist_item_details
            )
            request.execute()


def handle_add_songs_to_playlist(credentials, objs):
    service = build("youtube", "v3", credentials=credentials, cache_discovery=False)

    playlist_id = create_playlist(service)
    add_songs_to_playlist(service, playlist_id, objs)


def add_songs_to_playlist_youtube(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if (
        service_auth := get_service_auth(user, "youtube")
    ) and service_auth.refresh_token:
        credentials = get_google_credentials(
            service_auth.access_token, service_auth.refresh_token
        )
    else:
        return

    if trigger_answer.objs == []:
        return

    try:
        handle_add_songs_to_playlist(credentials, trigger_answer.objs)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
