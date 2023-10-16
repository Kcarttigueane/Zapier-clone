from models.user import User
from models.automation import Action, ActionAnswer
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from source.helpers import get_google_credentials
from googleapiclient.http import MediaIoBaseUpload
import io


async def add_file(user: User, action_answer: ActionAnswer):
    credentials = get_google_credentials(user.token_manager.google_drive_token)
    attachments = action_answer.objs
    header = action_answer.header
    body = action_answer.body

    try:
        service = build("drive", "v3", credentials=credentials)
        for filename, data in attachments:
            media = MediaIoBaseUpload(
                io.BytesIO(data), mimetype="application/octet-stream"
            )
            file_metadata = {
                "name": filename,
            }
            drive_file = (
                service.files()
                .create(body=file_metadata, media_body=media, fields="id")
                .execute()
            )

            print(f'Uploaded file: {filename}, File ID: {drive_file["id"]}')

        if body != "":
            file_metadata = {
                "name": header,
                "mimeType": "text/plain",
            }
            media = MediaIoBaseUpload(io.BytesIO(body.encode()), mimetype="text/plain")
            drive_file = (
                service.files()
                .create(body=file_metadata, media_body=media, fields="id")
                .execute()
            )

            print(f'Created file: {header}, File ID: {drive_file["id"]}')

    except HttpError as error:
        print(f"An error occurred: {error}")
