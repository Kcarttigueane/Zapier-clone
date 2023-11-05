from typing import List

from app.core.database import get_database
from app.schemas.actions_dto import ActionInDTO, ActionOutDTO
from app.schemas.py_object_id import PyObjectId


class ActionRepository:
    @property
    def collection(self):
        return get_database()["Actions"]

    async def get(self, action_id: PyObjectId) -> ActionOutDTO | None:
        result = await self.collection.find_one({"_id": action_id})
        return ActionOutDTO.from_mongo(result) if result else None

    async def create(self, action: ActionInDTO):
        result = await self.collection.insert_one(action.dict())
        return await self.get(result.inserted_id)

    async def update(self, action_id: PyObjectId, action: ActionInDTO):
        await self.collection.update_one({"_id": action_id}, {"$set": action.dict()})
        return await self.get(action_id)

    async def delete(self, action_id: PyObjectId):
        await self.collection.delete_one({"_id": action_id})

    async def get_all(self) -> List[ActionOutDTO]:
        result = await self.collection.find().to_list(1000)
        return [ActionOutDTO.from_mongo(action) for action in result]

    async def get_by_name_and_service_id(
        self, name: str, service_id: PyObjectId
    ) -> ActionOutDTO | None:
        query = {"name": name, "service_id": service_id}
        result = await self.collection.find_one(query)
        return ActionOutDTO.from_mongo(result) if result else None

    async def get_by_service_id(self, service_id: PyObjectId) -> List[ActionOutDTO]:
        triggers = await self.collection.find({"service_id": service_id}).to_list(1000)
        return [ActionOutDTO.from_mongo(trigger) for trigger in triggers]
