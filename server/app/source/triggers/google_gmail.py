import logging
from datetime import datetime
from googleapiclient.discovery import build
from base64 import urlsafe_b64decode


from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth, get_google_credentials


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def check_gmail_attachment(
    user: UserOutDTO, last_polled: datetime
) -> TriggerAnswer | None:
    if service_auth := get_service_auth(user, "gmail"):
        credentials = get_google_credentials(service_auth.access_token)
    else:
        return None

    try:
        return extract_gmail_attachments(credentials, last_polled)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
        return None


def download_attachment(service, message_id, attachment_id):
    try:
        attachment = (
            service.users()
            .messages()
            .attachments()
            .get(userId="me", messageId=message_id, id=attachment_id)
            .execute()
        )
        return urlsafe_b64decode(attachment["data"].encode("UTF-8"))
    except Exception as e:
        print(f"An error occurred while downloading attachment: {e}")
        return None


def download_and_extract_attachments(service, message, msg_data):
    if "parts" in msg_data["payload"]:
        for part in msg_data["payload"]["parts"]:
            if part.get("filename"):
                attachment_id = part["body"]["attachmentId"]
                if file_data := download_attachment(
                    service, message["id"], attachment_id
                ):
                    return (part["filename"], file_data)
                else:
                    return None


def extract_gmail_attachments(credentials, last_polled):
    service = build("gmail", "v1", credentials=credentials, cache_discovery=False)
    results = service.users().messages().list(userId="me", maxResults=10).execute()
    messages = results.get("messages", [])
    if not messages:
        return None

    attachments = []
    for message in messages:
        msg_data = (
            service.users().messages().get(userId="me", id=message["id"]).execute()
        )
        received_time = datetime.utcfromtimestamp(
            int(msg_data["internalDate"]) / 1000.0
        )

        if received_time <= last_polled.replace(tzinfo=None):
            continue

        if attachment := download_and_extract_attachments(service, message, msg_data):
            attachments.append(attachment)

    return TriggerAnswer(objs=attachments)
