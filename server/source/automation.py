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



def automate_process(user: User, action_func: str, reaction_func: str, action_params: Action) -> ActionAnswer:
    if action_func in action_dict:
        action_func = action_dict[action_func]
        action_answer = action_func(user=user, action=action_params)
        print(f"Action Answer: {action_answer}")
        if reaction_func in reaction_dict:
            reaction_func = reaction_dict[reaction_func]
            reaction_func(user=user, action_answer=action_answer)
            return action_answer
    return None


async def get_automations():
    await connect_to_mongo()
    collection = get_database()["Users"]
    all_users = [User(**user) for user in await collection.find().to_list(1000)]

    for user in all_users:
        user_dict = user.dict()
        automations = user_dict['automations']
        for i, auto in enumerate(automations):
            print(f"Auto: {auto}")
            last_polled = auto['last_polled']
            time_difference = datetime.now() - last_polled
            minutes_difference = time_difference.total_seconds() / 60
            if minutes_difference >= POLLED_TIME:
                action_params = Action(auto['last_polled'], auto['last_obj_checked'])
                action_func = auto['action']
                reaction_func = auto['reaction']
                action_answer = automate_process(user, action_func, reaction_func, action_params)
                if action_answer != None:
                    print(f"Automation Result: {'Success' if action_answer != None else 'Fail'}")
                    user_dict['automations'][i]['last_polled'] = action_answer.last_polled
                    user_dict['automations'][i]['last_obj_checked'] = action_answer.last_obj_checked
                    await collection.replace_one({"_id": user.id}, user_dict)

# Create an event loop and run the async function
if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(get_automations())