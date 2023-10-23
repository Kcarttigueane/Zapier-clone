import asyncio
from typing import List
from datetime import datetime
from app.repository.automations_repository import (
    AutomationRepository,
    AutomationOutDTO,
    AutomationInDTO,
)
from app.repository.users_repository import UserRepository, UserOutDTO
from app.repository.service_repository import ServiceRepository
from app.repository.triggers_repository import TriggerRepository
from app.repository.actions_repository import ActionRepository
from app.schemas.triggers_dto import TriggerAnswer
from app.source.triggers.google_youtube import check_youtube_like
from app.source.actions.spotify import add_songs_to_playlist
from app.source.helpers import handle_refresh_token, automation_poll_status

user_repository = UserRepository()
automation_repository = AutomationRepository()
service_repository = ServiceRepository()
trigger_repository = TriggerRepository()
action_repository = ActionRepository()


trigger_dict = {
    "youtube": {
        "LikeSong": check_youtube_like,
    }
}

action_dict = {
    "spotify": {
        "AddToPlaylist": add_songs_to_playlist,
    }
}


async def handle_trigger(
    automation: AutomationOutDTO, user: UserOutDTO
) -> TriggerAnswer | None:
    trigger = await trigger_repository.get(automation.trigger_id)
    trigger_name = trigger.name
    trigger_service = await service_repository.get(trigger.service_id)
    trigger_service_name = trigger_service.name

    user = await handle_refresh_token(user, trigger_service_name)

    trigger_function = trigger_dict.get(trigger_service_name, {}).get(
        trigger_name, None
    )
    if not trigger_function:
        return None

    trigger_answer = trigger_function(user)
    return trigger_answer


async def handle_action(
    automation: AutomationOutDTO, user: UserOutDTO, trigger_answer: TriggerAnswer
):
    action = await action_repository.get(automation.action_id)
    action_name = action.name
    action_service = await service_repository.get(action.service_id)
    action_service_name = action_service.name

    user = await handle_refresh_token(user, action_service_name)

    action_function = action_dict.get(action_service_name, {}).get(action_name, None)
    if not action_function:
        return

    action_function(user, trigger_answer)


async def handle_automation(automation: AutomationOutDTO) -> AutomationOutDTO:
    if not automation_poll_status(automation=automation):
        return automation

    user = await user_repository.get(str(automation.user_id))

    trigger_answer = await handle_trigger(automation, user)
    if trigger_answer is not None:
        await handle_action(automation, user, trigger_answer)

    automation.last_polled = datetime.utcnow()
    automation.first_poll = False
    return automation


async def run_automations():
    automation_list: List[AutomationOutDTO] = await automation_repository.get_all()

    while True:
        for i, automation in enumerate(automation_list):
            automation_list[i] = await handle_automation(automation=automation)
            await automation_repository.update(
                automation_list[i].id, AutomationInDTO(**automation_list[i].dict())
            )
        await asyncio.sleep(5)
