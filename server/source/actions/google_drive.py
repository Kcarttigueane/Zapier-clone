from models.user import User
from models.automation import Action, ActionAnswer
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime
from source.helpers import get_google_credentials


def check_latests_file(user: User, action: Action) -> ActionAnswer:
    last_polled = action.last_polled
    last_checked_file = action.last_obj_checked

    credentials = get_google_credentials(user.token_manager.google_drive_token)

    after_date = last_checked_file if last_checked_file != None else last_polled

    try:
        service = build("drive", "v3", credentials=credentials)
        results = (
            service.files()
            .list(
                pageSize=10,
                fields="nextPageToken, files(id, name, createdTime)",
                orderBy="createdTime desc",
            )
            .execute()
        )
        items = results.get("files", [])

        header = "[Area] New File(s) Created in your Google Drive"
        last_checked_file_date = after_date

        if not items:
            return "No files found."

        result_str = ""
        objs = []

        for item in items:
            file_name = item["name"]
            created_time = item["createdTime"]
            created_time_datetime = datetime.strptime(
                created_time, "%Y-%m-%dT%H:%M:%S.%fZ"
            )
            file_id = item["id"]

            if created_time_datetime > after_date:
                formatted_created_time = datetime.strptime(
                    created_time, "%Y-%m-%dT%H:%M:%S.%fZ"
                ).strftime("%d/%m/%Y")
                file_name_link = f'<a href="https://docs.google.com/document/d/{file_id}">{file_name}</a>'
                result_str += f"{file_name_link}: Created at {formatted_created_time}\n"
                objs.append(result_str)
                last_checked_file_date = created_time_datetime

        passed = bool(result_str != "")
        body = f"""
            <html>
                <body>
                    <p><strong>New Files Created</strong></p>
                    <br>
                    {result_str}
                </body>
            </html>
        """
        print(f"Passed: {passed}")
        response = ActionAnswer(
            last_obj_checked=last_checked_file_date,
            header=header,
            body=body,
            passed=passed,
            objs=objs,
        )
        return response

    except HttpError as error:
        print(f"An error occurred: {error}")
