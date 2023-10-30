import logging
from datetime import datetime
import requests
from fastapi import status

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def event_after_polled(event, last_polled):
    event_start_datetime = datetime.strptime(
        event["start"]["dateTime"][:23], "%Y-%m-%dT%H:%M:%S.%f"
    )
    return event_start_datetime > last_polled.replace(tzinfo=None)


def extract_upcoming_events(token, last_polled: datetime):
    events_url = "https://graph.microsoft.com/v1.0/me/events"

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.get(events_url, headers=headers)

    if response.status_code != status.HTTP_200_OK:
        logger.info(f"Failed to retrieve calendar events: {response.text}")
        return None

    events_data = response.json()
    objs = []
    calendar_str = ""

    for event in events_data["value"]:
        if event_after_polled(event, last_polled):
            calendar_str += f"{event['subject']} {event['start']['dateTime'].split('.')[0]} {event['end']['dateTime'].split('.')[0]}\n"
            objs.append(
                [
                    event["subject"],
                    event["start"]["dateTime"].split(".")[0],
                    event["end"]["dateTime"].split(".")[0],
                ]
            )

    return (
        TriggerAnswer(objs=objs, header="[Area] Teams Events", body=calendar_str)
        if objs
        else None
    )


def check_upcoming_events_team(
    user: UserOutDTO, last_polled: datetime
) -> TriggerAnswer | None:
    if service_auth := get_service_auth(user, "teams"):
        token = service_auth.access_token
    else:
        return None

    try:
        return extract_upcoming_events(token, last_polled)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
        return None
