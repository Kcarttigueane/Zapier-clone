import logging
from googleapiclient.discovery import build

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth, get_google_credentials

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_event(obj):
    return {
        "summary": obj[0],
        "start": {
            "dateTime": obj[1],
            "timeZone": "UTC",
        },
        "end": {
            "dateTime": obj[2],
            "timeZone": "UTC",
        },
    }


def check_event_exists(service, calendar_id, event):
    events = service.events().list(calendarId=calendar_id).execute()

    if "items" in events:
        for existing_event in events["items"]:
            if existing_event.get("summary", "") == event.get("summary", ""):
                return True
    return False


def handle_events_creation(objs, credentials):
    service = build("calendar", "v3", credentials=credentials, cache_discovery=False)

    calendar_id = "primary"
    for obj in objs:
        event = create_event(obj)
        if not check_event_exists(service, calendar_id, event):
            service.events().insert(calendarId=calendar_id, body=event).execute()


def add_events(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if (
        service_auth := get_service_auth(user, "calendar")
    ) and service_auth.refresh_token:
        credentials = get_google_credentials(
            service_auth.access_token, service_auth.refresh_token
        )
    else:
        return

    if trigger_answer.objs == []:
        return

    handle_events_creation(trigger_answer.objs, credentials)
