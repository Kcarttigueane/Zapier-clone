from typing import List

from fastapi import HTTPException, status

from config.database import get_database
from models.automation import Automation, AutomationCreate
from models.py_object_id import PyObjectId
from models.user import UserCreate
from repository.user_repository import UserRepository

user_repository = UserRepository()


class AutomationRepository:
    def __init__(self, userId: PyObjectId):
        self.userId = userId

    @property
    async def user(self):
        users = get_database()["Users"]
        return await users.find_one({"_id": self.userId})

    async def get(self, automation_id: PyObjectId) -> Automation:
        user = await self.user
        automations = user["automations"]

        for automation in automations:
            if automation["id"] == automation_id:
                return Automation(**automation)

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="(get) : Automation not found"
        )

    async def list_automations(self) -> List[Automation]:
        user = await self.user
        automations = user["automations"]
        return [Automation(**automation) for automation in automations]

    async def create(self, automation: AutomationCreate) -> Automation:
        automation_dict = automation.dict()
        user = await self.user
        automations = user["automations"]
        automations.append(automation_dict)
        user["automations"] = automations
        await user_repository.update(user["_id"], UserCreate(**user))
        return Automation(**automation_dict)

    async def update(
        self, automation_id: PyObjectId, update_automation: AutomationCreate
    ) -> Automation:
        user = await self.user
        automations = user["automations"]

        for i, automation in enumerate(automations):
            if automation["id"] == automation_id:
                automations[i] = update_automation.dict()

        user["automations"] = automations
        await user_repository.update(user["_id"], UserCreate(**user))
        return Automation(**update_automation.dict())

    async def delete(self, automation_id: PyObjectId) -> Automation:
        user = await self.user
        automations = user["automations"]
        return_automation = {}
        new_automations = []

        for automation in automations:
            if automation["id"] != automation_id:
                new_automations.append(automation)
            else:
                return_automation = automation

        user["automations"] = new_automations
        await user_repository.update(user["_id"], UserCreate(**user))
        return Automation(**return_automation)
