import asyncio
from datetime import datetime, timezone
from typing import Tuple

from app.repository.actions_repository import ActionRepository
from app.repository.automations_repository import (
    AutomationInDTO,
    AutomationOutDTO,
    AutomationRepository,
)
from app.repository.service_repository import ServiceRepository
from app.repository.triggers_repository import TriggerRepository
from app.repository.users_repository import UserOutDTO, UserRepository
from app.schemas.automations_dto import AutomationLogInDTO
from app.schemas.triggers_dto import TriggerAnswer
from app.source.actions.google_calendar import add_events_google_calendar
from app.source.actions.google_drive import add_attachments_to_drive
from app.source.actions.google_gmail import send_myself_mail
from app.source.actions.google_youtube import add_songs_to_playlist_youtube
from app.source.actions.spotify import add_songs_to_playlist_spotify
from app.source.actions.teams import add_events_team, send_message
from app.source.helpers import automation_poll_status, handle_refresh_token
from app.source.triggers.google_calendar import (
    check_todays_event,
    check_upcoming_events_calendar,
)
from app.source.triggers.google_drive import check_new_files
from app.source.triggers.google_gmail import check_gmail_attachment
from app.source.triggers.google_youtube import check_new_videos, check_youtube_like
from app.source.triggers.open_meteo import check_todays_weather
from app.source.triggers.spotify import check_spotify_like
from app.source.triggers.teams import check_upcoming_events_team
from fastapi import HTTPException, status

user_repository = UserRepository()
automation_repository = AutomationRepository()
service_repository = ServiceRepository()
trigger_repository = TriggerRepository()
action_repository = ActionRepository()


trigger_dict = {
    "youtube": {
        "LikeSong": check_youtube_like,
        "NewVideo": check_new_videos,
    },
    "gmail": {
        "NewAttachment": check_gmail_attachment,
    },
    "google drive": {
        "NewFile": check_new_files,
    },
    "google calendar": {
        "TodayEvent": check_todays_event,
        "UpcomingEvents": check_upcoming_events_calendar,
    },
    "open meteo": {
        "TodayWeather": check_todays_weather,
    },
    "teams": {
        "UpcomingEvents": check_upcoming_events_team,
    },
    "spotify": {
        "LikeSong": check_spotify_like,
    },
}

action_dict = {
    "spotify": {
        "AddToPlaylist": add_songs_to_playlist_spotify,
    },
    "google drive": {
        "UploadToDrive": add_attachments_to_drive,
    },
    "gmail": {
        "SendMail": send_myself_mail,
    },
    "google calendar": {
        "AddEvents": add_events_google_calendar,
    },
    "teams": {
        "SendMessage": send_message,
        "AddEvents": add_events_team,
    },
    "youtube": {
        "AddToPlaylist": add_songs_to_playlist_youtube,
    },
}


async def handle_trigger(
    automation: AutomationOutDTO, user: UserOutDTO
) -> TriggerAnswer | None:
    trigger = await trigger_repository.get(automation.trigger_id)
    if trigger is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"trigger with id {automation.trigger_id} not found",
        )
    trigger_name = trigger.name
    trigger_service = await service_repository.get(trigger.service_id)
    if trigger_service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"trigger_service with id {trigger.service_id} not found",
        )
    trigger_service_name = trigger_service.name

    user = await handle_refresh_token(user, trigger_service_name)

    trigger_function = trigger_dict.get(trigger_service_name, {}).get(
        trigger_name, None
    )
    return (
        trigger_function(user, automation.last_polled, automation.first_poll)
        if trigger_function
        else None
    )


async def handle_action(
    automation: AutomationOutDTO, user: UserOutDTO, trigger_answer: TriggerAnswer
):
    action = await action_repository.get(automation.action_id)
    if action is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action with id {automation.action_id} not found",
        )
    action_name = action.name
    action_service = await service_repository.get(action.service_id)
    if action_service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Action_service with id {action.service_id} not found",
        )
    action_service_name = action_service.name

    user = await handle_refresh_token(user, action_service_name)

    if action_function := action_dict.get(action_service_name, {}).get(
        action_name, None
    ):
        action_function(user, trigger_answer)


async def handle_automation(
    automation: AutomationOutDTO,
) -> Tuple[AutomationOutDTO, bool]:
    if not automation_poll_status(automation=automation):
        return automation, False

    user = await user_repository.get(str(automation.user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"user with id {automation.action_id} not found",
        )

    trigger_answer = await handle_trigger(automation, user)
    if trigger_answer is not None:
        await handle_action(automation, user, trigger_answer)
        automation.last_polled = datetime.now(timezone.utc)
        automation.first_poll = False
        new_log = AutomationLogInDTO(
            triggered_at=automation.last_polled,
            details=f"Triggered automation with ID {automation.id}",
        )
        automation.logs.append(new_log)
        return automation, True

    return automation, False


async def run_automations():
    while True:
        automation_list = await automation_repository.get_all()
        for i, automation in enumerate(automation_list):
            automation_list[i], need_update = await handle_automation(
                automation=automation
            )
            if need_update:
                await automation_repository.update(
                    automation_list[i].id, AutomationInDTO(**automation_list[i].dict())
                )
        await asyncio.sleep(5)
