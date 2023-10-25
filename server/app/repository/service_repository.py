from typing import List

from app.core.database import get_database
from app.schemas.py_object_id import PyObjectId
from app.schemas.services_dto import ServiceInDTO, ServiceOutDTO


class ServiceRepository:
    @property
    def collection(self):
        return get_database()["Services"]

    async def get(self, service_id: PyObjectId) -> ServiceOutDTO | None:
        result = await self.collection.find_one({"_id": service_id})
        return ServiceOutDTO.from_mongo(result) if result else None

    async def create(self, service: ServiceInDTO):
        result = await self.collection.insert_one(service.dict())
        return await self.get(result.inserted_id)

    async def update(self, service_id: PyObjectId, service: ServiceInDTO):
        await self.collection.update_one({"_id": service_id}, {"$set": service.dict()})
        return await self.get(service_id)

    async def delete(self, service_id: PyObjectId):
        await self.collection.delete_one({"_id": service_id})

    async def get_all(self) -> List[ServiceOutDTO]:
        services = await self.collection.find().to_list(1000)
        return [ServiceOutDTO.from_mongo(service) for service in services]

    async def get_service_by_name(self, name: str) -> ServiceOutDTO | None:
        result = await self.collection.find_one({"name": name})
        return ServiceOutDTO.from_mongo(result) if result else None
