from datetime import datetime, timedelta

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client
from datetime import datetime, timedelta
from source.helpers import get_google_credentials
from models.automation import ActionAnswer

from config.constants import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from models.user import User
from services.auth_service import decrypt_token


def get_weeks_time_frame():
    today = datetime.utcnow()

    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=7)

    start_date = start_of_week.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_date = end_of_week.strftime("%Y-%m-%dT%H:%M:%SZ")
    return start_date, end_date


def get_this_weeks_events(user: User, action_answer: ActionAnswer):
    credentials = get_google_credentials(user.token_manager.google_calendar_token)

    try:
        service = build("calendar", "v3", credentials=credentials)
        start_date, end_date = get_weeks_time_frame()
        events = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=start_date,
                timeMax=end_date,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        if "items" in events:
            print("This week's events:")
            for event in events["items"]:
                start = event["start"].get("dateTime", event["start"].get("date"))
                print(f"{event['summary']} ({start})")
        else:
            print("No events found for this week.")

    except HttpError as error:
        print(f"An error occurred: {error}")
