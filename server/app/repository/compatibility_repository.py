from typing import List

from app.core.database import get_database
from app.schemas.compatibility_dto import (
    ServiceCompatibilityInDTO,
    ServiceCompatibilityOutDTO,
    TriggerActionCompatibilityInDTO,
    TriggerActionCompatibilityOutDTO,
)
from app.schemas.py_object_id import PyObjectId


class CompatibilityRepository:
    @property
    def service_compatibility_collection(self):
        return get_database()["ServiceCompatibility"]

    @property
    def trigger_action_compatibility_collection(self):
        return get_database()["TriggerActionCompatibility"]

    async def create_service_compatibility(
        self, compatibility: ServiceCompatibilityInDTO
    ) -> ServiceCompatibilityOutDTO | None:
        result = await self.service_compatibility_collection.insert_one(
            compatibility.dict()
        )
        return await self.get_service_compatibility(result.inserted_id)

    async def get_service_compatibility_by_service_ids(
        self, service_id_1: PyObjectId, service_id_2: PyObjectId
    ) -> ServiceCompatibilityOutDTO | None:
        query = {"service_id_1": service_id_1, "service_id_2": service_id_2}
        result = await self.service_compatibility_collection.find_one(query)
        return ServiceCompatibilityOutDTO.from_mongo(result) if result else None

    async def get_service_compatibility(
        self, compatibility_id: PyObjectId
    ) -> ServiceCompatibilityOutDTO | None:
        result = await self.service_compatibility_collection.find_one(
            {"_id": compatibility_id}
        )
        return ServiceCompatibilityOutDTO.from_mongo(result) if result else None

    async def update_service_compatibility(
        self, compatibility_id: PyObjectId, compatibility: ServiceCompatibilityInDTO
    ) -> ServiceCompatibilityOutDTO | None:
        await self.service_compatibility_collection.update_one(
            {"_id": compatibility_id}, {"$set": compatibility.dict()}
        )
        return await self.get_service_compatibility(compatibility_id)

    async def delete_service_compatibility(self, compatibility_id: PyObjectId):
        await self.service_compatibility_collection.delete_one(
            {"_id": compatibility_id}
        )

    async def get_all_service_compatibilities(self) -> List[ServiceCompatibilityOutDTO]:
        result = await self.service_compatibility_collection.find().to_list(length=1000)
        return [ServiceCompatibilityOutDTO.from_mongo(item) for item in result]

    async def create_trigger_action_compatibility(
        self, compatibility: TriggerActionCompatibilityInDTO
    ) -> TriggerActionCompatibilityOutDTO | None:
        result = await self.trigger_action_compatibility_collection.insert_one(
            compatibility.dict()
        )
        return await self.get_trigger_action_compatibility(result.inserted_id)

    async def get_trigger_action_compatibility(
        self, compatibility_id: PyObjectId
    ) -> TriggerActionCompatibilityOutDTO | None:
        result = await self.trigger_action_compatibility_collection.find_one(
            {"_id": compatibility_id}
        )
        return TriggerActionCompatibilityOutDTO.from_mongo(result) if result else None

    async def get_trigger_action_compatibility_by_ids(
        self, trigger_id: PyObjectId, action_id: PyObjectId
    ) -> TriggerActionCompatibilityOutDTO | None:
        query = {"trigger_id": trigger_id, "action_id": action_id}
        result = await self.trigger_action_compatibility_collection.find_one(query)
        return TriggerActionCompatibilityOutDTO.from_mongo(result) if result else None

    async def update_trigger_action_compatibility(
        self,
        compatibility_id: PyObjectId,
        compatibility: TriggerActionCompatibilityInDTO,
    ) -> TriggerActionCompatibilityOutDTO | None:
        await self.trigger_action_compatibility_collection.update_one(
            {"_id": compatibility_id}, {"$set": compatibility.dict()}
        )
        return await self.get_trigger_action_compatibility(compatibility_id)

    async def delete_trigger_action_compatibility(self, compatibility_id: PyObjectId):
        await self.trigger_action_compatibility_collection.delete_one(
            {"_id": compatibility_id}
        )

    async def get_all_trigger_action_compatibilities(
        self,
    ) -> List[TriggerActionCompatibilityOutDTO]:
        result = await self.trigger_action_compatibility_collection.find().to_list(
            length=1000
        )  # Adjust the length as necessary
        return [TriggerActionCompatibilityOutDTO.from_mongo(item) for item in result]
