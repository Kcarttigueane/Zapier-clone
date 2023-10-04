from models.user import User
from models.automation import ActionAnswer
from services.auth_service import decrypt_token
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client
from email.message import EmailMessage
import base64
from email.mime.text import MIMEText


from config.constants import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET


def send_email_to_user(user: User, action_answer: ActionAnswer):
    content = action_answer.body
    subject = action_answer.header
    google_access_token = user.token_manager.google_gmail_token
    token, refresh_token = decrypt_token(google_access_token)
    
    credentials = client.OAuth2Credentials(
        access_token=token,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        refresh_token=refresh_token,
        token_expiry=None,
        token_uri=GOOGLE_TOKEN_URI,
        user_agent=None,
        revoke_uri=GOOGLE_REVOKE_URI
    )

    try:
        service = build('gmail', 'v1', credentials=credentials)
        message = MIMEText(content, 'html')


        message['To'] = user.email
        message['From'] = user.email
        message['Subject'] = subject
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {
            'raw': encoded_message
        }
        service.users().messages().send(userId="me",
                                                body=create_message).execute()

    except HttpError as error:
        print(f'An error occurred: {error}')
