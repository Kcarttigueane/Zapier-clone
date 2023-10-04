import asyncio
import sys
sys.path.insert(0, '/home/demisistired/Epitech/Projects2024/B-DEV-500-LYN-5-1-area-kevin.carttigueane/server')
from config.database import connect_to_mongo, get_database
from models.user import User
from models.automation import Action, ActionAnswer
from config.constants import POLLED_TIME
from datetime import datetime
from source.actions.google_drive import check_latests_file
from source.reactions.google_gmail import send_email_to_user

action_dict = {
    'drive_new_file': check_latests_file
}

reaction_dict = {
    'gmail_send_mail': send_email_to_user
}


async def get_all_users(collection):
    return [User(**user) for user in await collection.find().to_list(1000)]


def automate_process(user: User, action_func: str, reaction_func: str, action_params: Action) -> ActionAnswer:
    if action_func in action_dict:
        action_func = action_dict[action_func]
        action_answer = action_func(user=user, action=action_params)
        if reaction_func in reaction_dict and action_answer.passed:
            reaction_func = reaction_dict[reaction_func]
            reaction_func(user=user, action_answer=action_answer)
            return action_answer
    return None

def start_automation(user: User, automation: dict):
    action_params = Action(automation['last_polled'], automation['last_obj_checked'])
    action_func = automation['action']
    reaction_func = automation['reaction']
    action_answer = automate_process(user, action_func, reaction_func, action_params)
    return action_answer

def check_poll_time(automation: dict) -> bool:
    last_polled = automation['last_polled']
    time_difference = datetime.now() - last_polled
    minutes_difference = time_difference.total_seconds() / 60
    return minutes_difference >= POLLED_TIME

def check_automation(user: User):
    user_dict = user.dict()
    automations = user_dict['automations']
    for i, automation in enumerate(automations):
        if check_poll_time(automation):
            return i, start_automation(user, automation)
    return -1, None


async def get_automations():
    await connect_to_mongo()
    collection = get_database()["Users"]
    all_users = await get_all_users(collection)

    for user in all_users:
        automation_index, automation_answer = check_automation(user)
        if automation_answer:
            user_dict = user.dict()
            user_dict['automations'][automation_index]['last_polled'] = datetime.now()
            user_dict['automations'][automation_index]['last_obj_checked'] = automation_answer.last_obj_checked
            await collection.replace_one({"_id": user.id}, user_dict)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(get_automations())