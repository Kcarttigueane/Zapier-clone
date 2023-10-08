import asyncio
import sys
from datetime import datetime

from config.constants import POLLED_TIME
from config.database import connect_to_mongo, get_database
from models.automation import Action, ActionAnswer
from models.user import User
from source.actions.google_drive import check_latests_file
from source.reactions.google_gmail import send_email_to_user

sys.path.insert(
    0,
    "/home/demisistired/Epitech/Projects2024/B-DEV-500-LYN-5-1-area-kevin.carttigueane/server",
)

action_dict = {"drive_new_file": check_latests_file}

reaction_dict = {"gmail_send_mail": send_email_to_user}


async def get_all_users(collection):
    return [User(**user) for user in await collection.find().to_list(1000)]


def automate_process(
    user: User, action_func: str, reaction_func: str, action_params: Action
) -> ActionAnswer:
    if action_func in action_dict:
        action_func = action_dict[action_func]
        action_answer = action_func(user=user, action=action_params)
        action_answer.action_func = action_func
        action_answer.reaction_func = reaction_func
        if reaction_func in reaction_dict and action_answer.passed:
            reaction_func = reaction_dict[reaction_func]
            reaction_func(user=user, action_answer=action_answer)
            return action_answer
    return None


def start_automation(user: User, automation: dict):
    action_params = Action(
        automation["last_polled"],
        automation["first_poll"],
        automation["last_obj_checked"],
        automation["stored_objs"],
    )
    action_func = automation["action"]
    reaction_func = automation["reaction"]
    return automate_process(user, action_func, reaction_func, action_params)


def check_poll_time(automation: dict) -> bool:
    last_polled = automation["last_polled"]
    time_difference = datetime.utcnow() - last_polled
    minutes_difference = time_difference.total_seconds() / 60
    return minutes_difference >= POLLED_TIME


def check_automation(user: User):
    user_dict = user.dict().copy()
    automations = user_dict["automations"]
    for i, automation in enumerate(automations):
        if check_poll_time(automation):
            print("Started Automation")
            return i, start_automation(user.copy(), automation)
    return -1, None


def debug_automation(user: User, automation_answer: ActionAnswer):
    user_dict = user.dict()
    print("Automation Successful")
    print(f"\tUsersname: {user_dict['username']}")
    print(f"\tAction: {automation_answer.action_func}")
    print(f"\tReaction: {automation_answer.reaction_func}")


def update_user_dict(user: dict, index: int, automation_answer: ActionAnswer):
    user["automations"][index]["last_polled"] = datetime.utcnow()
    user["automations"][index]["last_obj_checked"] = automation_answer.last_obj_checked
    user["automations"][index]["first_poll"] = False
    user["automations"][index]["stored_objs"] = automation_answer.stored_objs
    return user


async def get_automations():
    await connect_to_mongo()
    collection = get_database()["Users"]
    all_users = await get_all_users(collection)

    for user in all_users:
        automation_index, automation_answer = check_automation(user)
        if automation_answer:
            debug_automation(user, automation_answer)
            user_dict = user.dict()
            user_dict = update_user_dict(user_dict, automation_index, automation_answer)
            await collection.replace_one({"_id": user.id}, user_dict)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(get_automations())
