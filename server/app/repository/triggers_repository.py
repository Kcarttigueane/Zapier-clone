from typing import List

from app.core.database import get_database
from app.schemas.py_object_id import PyObjectId
from app.schemas.triggers_dto import TriggerInDTO, TriggerOutDTO


class TriggerRepository:
    @property
    def collection(self):
        return get_database()["Triggers"]

    async def get(self, trigger_id: PyObjectId) -> TriggerOutDTO | None:
        result = await self.collection.find_one({"_id": trigger_id})
        return TriggerOutDTO.from_mongo(result) if result else None

    async def create(self, trigger: TriggerInDTO):
        result = await self.collection.insert_one(trigger.dict())
        return await self.get(result.inserted_id)

    async def update(self, trigger_id: PyObjectId, trigger: TriggerInDTO):
        await self.collection.update_one({"_id": trigger_id}, {"$set": trigger.dict()})
        return await self.get(trigger_id)

    async def delete(self, trigger_id: PyObjectId):
        await self.collection.delete_one({"_id": trigger_id})

    async def get_all(self) -> List[TriggerOutDTO]:
        triggers = await self.collection.find().to_list(1000)
        return [TriggerOutDTO.from_mongo(trigger) for trigger in triggers]

    async def get_by_name_and_service_id(
        self, name: str, service_id: PyObjectId
    ) -> TriggerOutDTO | None:
        query = {"name": name, "service_id": service_id}
        result = await self.collection.find_one(query)
        return TriggerOutDTO.from_mongo(result) if result else None

    async def get_by_service_id(self, service_id: PyObjectId) -> List[TriggerOutDTO]:
        triggers = await self.collection.find({"service_id": service_id}).to_list(1000)
        return [TriggerOutDTO.from_mongo(trigger) for trigger in triggers]

    async def find_by_action_id(self, action_id: PyObjectId):
        return await self.collection.find({"action_id": action_id}).to_list(1000)
