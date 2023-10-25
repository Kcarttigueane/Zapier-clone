from typing import List

from app.core.database import get_database
from app.schemas.automations_dto import AutomationInDTO, AutomationOutDTO
from app.schemas.py_object_id import PyObjectId


class AutomationRepository:
    @property
    def collection(self):
        return get_database()["Automations"]

    async def get(self, automation_id: PyObjectId) -> AutomationOutDTO | None:
        result = await self.collection.find_one({"_id": automation_id})
        return AutomationOutDTO.from_mongo(result) if result else None

    async def create(self, automation: AutomationInDTO):
        result = await self.collection.insert_one(automation.dict())
        return await self.get(result.inserted_id)

    async def update(self, automation_id: PyObjectId, automation: AutomationInDTO):
        await self.collection.update_one(
            {"_id": automation_id}, {"$set": automation.dict()}
        )
        return await self.get(automation_id)

    async def delete(self, automation_id: PyObjectId):
        await self.collection.delete_one({"_id": automation_id})

    async def get_all(self) -> List[AutomationOutDTO]:
        automations = await self.collection.find().to_list(1000)
        return [AutomationOutDTO.from_mongo(automation) for automation in automations]

    async def get_automation_by_name(self, name: str) -> AutomationOutDTO | None:
        result = await self.collection.find_one({"name": name})
        return AutomationOutDTO.from_mongo(result) if result else None
