from typing import List

from fastapi import HTTPException, status

from config.database import get_database
from models.py_object_id import PyObjectId
from models.user import User, UserCreate
from models.automation import AutomationCreate, Automation
from models.auth_token import AuthToken
from utils.password_utils import get_password_hash, verify_password
from repository.user_repository import UserRepository

user_repository = UserRepository()

class AutomationRepository:
    def __init__(self, userId: PyObjectId):
        self.userId = userId

    @property
    async def user(self):
        users = get_database()["Users"]
        user = await users.find_one({"_id": self.userId})
        return user
    
    # async def get(self, automation_id: PyObjectId) -> Automation:
    #     user = await self.user


    #     user_data = await self.collection.find_one({"_id": automation_id})
    #     if user_data is None:
    #         raise HTTPException(
    #             status_code=status.HTTP_404_NOT_FOUND, detail="(get) : User not found"
    #         )
    #     return User(**user_data)

    async def create(self, automation: AutomationCreate):
        automation_dict = automation.dict()
        print(automation_dict)
        user = await self.user
        print(user)
        user_automations = user["automations"]
        user_automations.append(automation_dict)
        user["automations"] = user_automations
        await user_repository.update(user["_id"], UserCreate(**user))

