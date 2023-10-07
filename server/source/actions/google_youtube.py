from models.user import User
from models.automation import Action, ActionAnswer
from services.auth_service import decrypt_token
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client
from datetime import datetime

from config.constants import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, action_dict_format


def check_youtube_like(user: User, action: Action) -> ActionAnswer :
    first_poll = action.first_poll
    stored_objs = action.stored_objs

    google_access_token = user.token_manager.google_youtube_token
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
        service = build('youtube', 'v3', credentials=credentials)
        request = service.videos().list(
            part="snippet",
            myRating="like",
            maxResults=10
        )
        response = request.execute()
        if first_poll:
            stored_objs = []
            for video in response.get("items", []):
                stored_objs.append(video["snippet"]["title"])
            return ActionAnswer(stored_objs=stored_objs)
        else:
            objs = []
            new_stored_objs = []
            for video in response.get("items", []):
                video_title = video_title
                if video_title not in stored_objs:
                    objs.append(video_title)
                new_stored_objs.append(video_title)
            return ActionAnswer(stored_objs=new_stored_objs, objs=objs)

    except HttpError as error:
        print(f'An error occurred: {error}')


