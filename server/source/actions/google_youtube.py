from models.user import User
from models.automation import Action, ActionAnswer
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from source.helpers import get_google_credentials


def check_youtube_like(user: User, action: Action) -> ActionAnswer:
    first_poll = action.first_poll
    stored_objs = action.stored_objs

    credentials = get_google_credentials(user.token_manager.google_youtube_token)

    try:
        service = build("youtube", "v3", credentials=credentials)
        request = service.videos().list(part="snippet", myRating="like", maxResults=10)
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
                video_title = video["snippet"]["title"]
                if video_title not in stored_objs:
                    objs.append(video_title)
                new_stored_objs.append(video_title)
            return ActionAnswer(stored_objs=new_stored_objs, objs=objs)

    except HttpError as error:
        print(f"An error occurred: {error}")
