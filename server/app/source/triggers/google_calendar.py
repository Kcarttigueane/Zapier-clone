import logging
from datetime import datetime
from googleapiclient.discovery import build

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth, get_google_credentials


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_todays_event(credentials):
    service = build("calendar", "v3", credentials=credentials, cache_discovery=False)
    today = datetime.utcnow().date()

    start_of_day = datetime(today.year, today.month, today.day, 0, 0, 0)
    end_of_day = datetime(today.year, today.month, today.day, 23, 59, 59)

    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin=f"{start_of_day.isoformat()}Z",
            timeMax=f"{end_of_day.isoformat()}Z",
            maxResults=10,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )

    events = events_result.get("items", [])
    return (
        TriggerAnswer(
            header="[Area] Event Today Google Calendar", body=events[0]["summary"]
        )
        if events
        else None
    )


def check_todays_event(user: UserOutDTO, last_polled: datetime) -> TriggerAnswer | None:
    if service_auth := get_service_auth(user, "calendar"):
        credentials = get_google_credentials(service_auth.access_token)
    else:
        return None

    if last_polled.day == datetime.utcnow().day:
        return None

    try:
        return extract_todays_event(credentials)
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return None
