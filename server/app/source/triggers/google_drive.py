import logging
from datetime import datetime
from googleapiclient.discovery import build

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth, get_google_credentials


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_files(service):
    results = (
        service.files()
        .list(
            pageSize=10,
            fields="nextPageToken, files(id, name, createdTime)",
            orderBy="createdTime desc",
        )
        .execute()
    )
    return results.get("files", [])


def get_file_string(file, created_time_obj):
    file_name = file["name"]
    file_id = file["id"]
    formatted_time = created_time_obj.strftime("%d/%m%Y")
    html_file_link = (
        f"<a href='https://docs.google.com/document/d/{file_id}'>{file_name}</a>"
    )
    return f"{html_file_link}: Created at {formatted_time}\n"


def extract_new_files(credentials, last_polled):
    service = build("drive", "v3", credentials=credentials, cache_discovery=False)
    files = get_files(service)

    if not files:
        return None

    body_str = ""
    objs = []

    for file in files:
        created_time_str = file["createdTime"]
        created_time_obj = datetime.strptime(created_time_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        if created_time_obj >= last_polled.replace(tzinfo=None):
            body_str += get_file_string(file, created_time_obj)
            objs.append(file["name"])

    if body_str == "" or not objs:
        return None

    html_body = f"""
            <html>
                <body>
                    <p><strong>New Files Created</strong></p>
                    <br>
                    {body_str}
                </body>
            </html>
        """

    return TriggerAnswer(
        objs=objs,
        header="[Area] New File(s) Created in your Google Drive",
        body=body_str,
        markdown_body=html_body,
        markdown=True,
    )


def check_new_files(user: UserOutDTO, last_polled: datetime) -> TriggerAnswer | None:
    if service_auth := get_service_auth(user, "drive"):
        credentials = get_google_credentials(service_auth.access_token)
    else:
        return None

    try:
        return extract_new_files(credentials, last_polled)
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return None
