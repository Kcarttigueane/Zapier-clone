from models.user import User
from models.automation import Action, ActionAnswer
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime
from source.helpers import get_google_credentials
from base64 import urlsafe_b64decode


def check_latests_attachments(user: User, action: Action) -> ActionAnswer:
    last_polled = action.last_polled
    last_checked_mail = action.last_obj_checked

    credentials = get_google_credentials(user.token_manager.google_gmail_token)

    after_date = last_checked_mail if last_checked_mail else last_polled
    latest_date = after_date

    try:
        service = build("gmail", "v1", credentials=credentials)
        results = service.users().messages().list(userId="me", maxResults=10).execute()
        messages = results.get("messages", [])
        if not messages:
            return ActionAnswer(passed=False)
        attachments = []
        for message in messages:
            msg = (
                service.users().messages().get(userId="me", id=message["id"]).execute()
            )
            timestamp = int(msg["internalDate"])
            epoch_timestamp_sec = timestamp / 1000.0
            received_time = datetime.utcfromtimestamp(epoch_timestamp_sec)

            if received_time <= after_date:
                continue

            if received_time > latest_date:
                latest_date = received_time

            if "parts" in msg["payload"]:
                for part in msg["payload"]["parts"]:
                    if part["filename"]:
                        data = part["body"]["attachmentId"]
                        attachment = (
                            service.users()
                            .messages()
                            .attachments()
                            .get(userId="me", messageId=message["id"], id=data)
                            .execute()
                        )
                        file_data = urlsafe_b64decode(
                            attachment["data"].encode("UTF-8")
                        )
                        attachments.append((part["filename"], file_data))

        return ActionAnswer(last_obj_checked=latest_date, objs=attachments)

    except HttpError as error:
        print(f"An error occurred: {error}")
