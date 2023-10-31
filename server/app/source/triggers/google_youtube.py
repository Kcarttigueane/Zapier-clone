import logging
from typing import List
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
    if (
        service_auth := get_service_auth(user, "youtube")
    ) and service_auth.refresh_token:
        credentials = get_google_credentials(
            service_auth.access_token, service_auth.refresh_token
        )
    else:
        return None

    try:
        return extract_youtube_likes(credentials)

    except Exception as e:
        logger.info(f"An error occurred: {e}")
        return None


def get_subscribed_channels(service, last_polled):
    subscribed_channels = []

    response = (
        service.subscriptions()
        .list(part="snippet", mine=True, maxResults=5, pageToken=None)
        .execute()
    )

    subscribed_channels.extend(response["items"])

    return subscribed_channels


def get_latest_videos(service, last_polled, channels):
    latest_videos: List[dict] = []

    for channel in channels:
        channel_id = channel["snippet"]["resourceId"]["channelId"]
        response = (
            service.search()
            .list(
                part="snippet",
                channelId=channel_id,
                maxResults=5,
                order="date",
                type="video",
                publishedAfter=f"{last_polled.isoformat()}Z",
            )
            .execute()
        )

        if response["items"]:
            channel_title = channel["snippet"]["title"]
            latest_videos.extend(
                {
                    "channel_title": channel_title,
                    "video_title": video["snippet"]["title"],
                    "video_url": f'https://www.youtube.com/watch?v={video["id"]["videoId"]}',
                }
                for video in response["items"]
            )

    return latest_videos


def create_body_str(videos):
    body = "📢 New Videos Alert! 🎥\n\nYou have new videos from your subscribed channels:\n\n"

    for index, video in enumerate(videos, start=1):
        body += f"{index}. {video['channel_title']}\n"
        body += f"   - Title: {video['video_title']}\n"
        body += f"   - Watch Now: {video['video_url']}\n\n"

    body += "Don't miss out on the latest content from your favorite channels! Click the links above to watch these new videos."

    return body


def extract_new_videos(credentials, last_polled) -> TriggerAnswer | None:
    service = build("youtube", "v3", credentials=credentials, cache_discovery=False)
    channels = get_subscribed_channels(service, last_polled)
    print(f"Channels: {channels}")
    if channels == []:
        return None
    videos = get_latest_videos(service, last_polled, channels)
    print(f"Videos: {videos}")
    if videos == []:
        return None
    body = create_body_str(videos)
    print(body)
    return TriggerAnswer(
        objs=videos,
        header="[Area] Your Subscribed Channels Have New Content",
        body=body,
    )


def check_new_videos(user: UserOutDTO, last_polled: datetime) -> TriggerAnswer | None:
    if (
        service_auth := get_service_auth(user, "youtube")
    ) and service_auth.refresh_token:
        credentials = get_google_credentials(
            service_auth.access_token, service_auth.refresh_token
        )
    else:
        return None

    try:
        return extract_new_videos(credentials, last_polled)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
        return None
