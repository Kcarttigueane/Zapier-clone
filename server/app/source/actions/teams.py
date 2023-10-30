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

    if response.status_code != status.HTTP_200_OK:
        logger.info(f"Failed to send message in chat 48:notes: {response.text}")


def send_message(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if service_auth := get_service_auth(user, "teams"):
        token = service_auth.access_token
    else:
        return

    if trigger_answer.body == "":
        return

    send_message_in_chat(token, trigger_answer.body)
