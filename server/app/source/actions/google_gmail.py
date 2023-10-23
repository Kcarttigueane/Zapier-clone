from models.user import User
from models.automation import ActionAnswer
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
from email.mime.text import MIMEText
from source.helpers import get_google_credentials

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client


async def send_email_to_user(user: User, action_answer: ActionAnswer):
    content = action_answer.body
    subject = action_answer.header
    credentials = get_google_credentials(user.token_manager.google_gmail_token)

    try:
        service = build("gmail", "v1", credentials=credentials)
        message = MIMEText(content, "html")

        message["To"] = user.email
        message["From"] = user.email
        message["Subject"] = subject
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {"raw": encoded_message}
        service.users().messages().send(userId="me", body=create_message).execute()

    except HttpError as error:
        print(f"An error occurred: {error}")
