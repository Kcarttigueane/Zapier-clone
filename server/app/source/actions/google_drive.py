import io
import logging

from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_google_credentials, get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_new_files(credentials, objs):
    service = build("drive", "v3", credentials=credentials, cache_discovery=False)
    for filename, data in objs:
        media = MediaIoBaseUpload(io.BytesIO(data), mimetype="application/octet-stream")
        file_metadata = {
            "name": filename,
        }

        service.files().create(
            body=file_metadata, media_body=media, fields="id"  # type: ignore
        ).execute()


def add_attachments_to_drive(user: UserOutDTO, trigger_answer: TriggerAnswer):
    if (service_auth := get_service_auth(user, "drive")) and service_auth.refresh_token:
        credentials = get_google_credentials(
            service_auth.access_token, service_auth.refresh_token
        )
    else:
        return

    objs = trigger_answer.objs

    try:
        create_new_files(credentials, objs)
    except Exception:
        logger.info("An error occurred: {e}")
