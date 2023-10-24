import logging
from email.mime.text import MIMEText
import base64
from googleapiclient.discovery import build

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_google_credentials, get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def handle_mail(credentials, email, header, body, markdown):
    service = build("gmail", "v1", credentials=credentials, cache_discovery=False)
    message = MIMEText(body, "html" if markdown else "plain")

    message["To"] = email
    message["From"] = email
    message["Subject"] = header
    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    create_message = {"raw": encoded_message}
    service.users().messages().send(userId="me", body=create_message).execute()


def send_myself_mail(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if service_auth := get_service_auth(user, "gmail"):
        credentials = get_google_credentials(service_auth.access_token)
    else:
        return

    body = trigger_answer.body
    if body == "":
        return
    header = trigger_answer.header
    markdown = trigger_answer.markdown
    user_email = user.email

    try:
        handle_mail(credentials, user_email, header, body, markdown)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
