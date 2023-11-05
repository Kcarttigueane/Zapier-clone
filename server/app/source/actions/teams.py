import logging
from fastapi import status
import requests

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def send_message_in_chat(access_token, body):
    headers = {
        "Authorization": f"Bearer {access_token}",
    }

    message_data = {
        "body": {
            "content": body,
        },
    }

    send_message_url = "https://graph.microsoft.com/v1.0/me/chats/48:notes/messages"

    response = requests.post(send_message_url, json=message_data, headers=headers)

    if response.status_code != status.HTTP_201_CREATED:
        logger.info(f"Failed to send message in chat 48:notes: {response.text}")


def send_message(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if service_auth := get_service_auth(user, "teams"):
        token = service_auth.access_token
    else:
        return

    if trigger_answer.body == "":
        return

    try:
        send_message_in_chat(token, trigger_answer.body)
    except Exception as e:
        logger.info(f"An error occurred: {e}")


def create_event(obj):
    return {
        "subject": obj[0],
        "start": {
            "dateTime": obj[1],
            "timeZone": "UTC",
        },
        "end": {
            "dateTime": obj[2],
            "timeZone": "UTC",
        },
    }


def check_event_exists(token, new_event):
    url = "https://graph.microsoft.com/v1.0/me/events"
    headers = {
        "Authorization": f"Bearer {token}",
    }
    response = requests.get(url, headers=headers)
    if response.status_code != status.HTTP_200_OK:
        return True

    events = response.json()

    return any(event["subject"] == new_event["subject"] for event in events["value"])


def handle_events_creation(objs, token):
    url = "https://graph.microsoft.com/v1.0/me/events"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    for obj in objs:
        event = create_event(obj)
        if not check_event_exists(token, event):
            requests.post(url, headers=headers, json=event)


def add_events_team(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if service_auth := get_service_auth(user, "teams"):
        token = service_auth.access_token
    else:
        return

    if trigger_answer.objs == []:
        return

    try:
        handle_events_creation(trigger_answer.objs, token)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
