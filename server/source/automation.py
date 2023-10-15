from datetime import datetime
from typing import Dict, Coroutine
from source.actions.google_drive import check_latests_file
from source.actions.google_youtube import check_youtube_like
from source.actions.google_gmail import check_latests_attachments
from source.reactions.google_gmail import send_email_to_user
from source.reactions.spotify import add_songs_to_playlist
from source.reactions.google_drive import add_file
from source.reactions.discord import send_message_to_user
from models.user import User
from models.automation import ActionAnswer, Action
from config.constants import POLLED_TIME
from config.database import connect_to_mongo, get_database


action_dict = {
    "drive_new_file": check_latests_file,
    "youtube_new_like": check_youtube_like,
    "gmail_new_attachment": check_latests_attachments,
}

reaction_dict = {
    "gmail_send_mail": send_email_to_user,
    "spotify_add_song": add_songs_to_playlist,
    "drive_add_file": add_file,
    # 'discord_send_message': send_message_to_user
}


async def get_all_users(collection):
    return [User(**user) for user in await collection.find().to_list(1000)]


async def automate_process(
    user: User, action_func: str, reaction_func: str, action_params: Action
) -> ActionAnswer:
    if action_func in action_dict:
        action_func = action_dict[action_func]
        action_answer = action_func(user=user, action=action_params)
        action_answer.action_func = action_func
        action_answer.reaction_func = reaction_func
        if reaction_func in reaction_dict and action_answer.passed:
            reaction_func = reaction_dict[reaction_func]
            await reaction_func(user=user, action_answer=action_answer)
            return action_answer
    return None


async def start_automation(user: User, automation: dict):
    action_params = Action(
        automation["last_polled"],
        automation["first_poll"],
        automation["last_obj_checked"],
        automation["stored_objs"],
    )
    action_func = automation["action"]
    reaction_func = automation["reaction"]
    action_answer = await automate_process(
        user, action_func, reaction_func, action_params
    )
    return action_answer


def check_poll_time(automation: dict) -> bool:
    last_polled = automation["last_polled"]
    time_difference = datetime.utcnow() - last_polled
    minutes_difference = time_difference.total_seconds() / 60
    return minutes_difference >= POLLED_TIME


def debug_automation(user_dict: dict, automation_answer: ActionAnswer):
    print(f"Automation Successful")
    print(f"\tUsersname: {user_dict['username']}")
    print(f"\tAction: {automation_answer.action_func}")
    print(f"\tReaction: {automation_answer.reaction_func}")


def update_user_dict(user: dict, index: int, automation_answer: ActionAnswer):
    user["automations"][index]["last_obj_checked"] = automation_answer.last_obj_checked
    user["automations"][index]["first_poll"] = False
    user["automations"][index]["stored_objs"] = automation_answer.stored_objs
    return user


async def automate(user_dict, automation, i):
    response = await start_automation(User(**user_dict), automation)
    if response:
        user_dict = update_user_dict(user_dict, i, response)
    user_dict["automations"][i]["last_polled"] = datetime.utcnow()
    return user_dict


async def get_automations():
    await connect_to_mongo()
    collection = get_database()["Users"]
    all_users = await get_all_users(collection)

    while True:
        for i, user in enumerate(all_users):
            user_dict = user.dict()
            user_changed = False

            for j, automation in enumerate(user_dict["automations"]):
                if check_poll_time(automation):
                    user_dict = await automate(user_dict, automation, j)
                    user_changed = True

            if user_changed:
                await collection.replace_one({"_id": user.id}, user_dict)
                all_users[i] = User(**user_dict)


# asyncio.run(get_automations())