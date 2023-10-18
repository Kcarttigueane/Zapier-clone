import logging
from typing import List

from fastapi import HTTPException, status

from app.repository.service_repository import ServiceRepository
from app.schemas.py_object_id import PyObjectId
from app.schemas.services_dto import ServiceInDTO, ServiceOutDTO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ServiceService:
    def __init__(self):
        self.repository = ServiceRepository()

    async def create_service(self, service: ServiceInDTO) -> ServiceOutDTO:
        existing_service = await self.repository.get_service_by_name(service.name)

        if existing_service:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A service with this name already exists.",
            )

        try:
            return await self.repository.create(service)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while creating the service.",
            ) from e

    async def get_service(self, service_id: PyObjectId) -> ServiceOutDTO:
        try:
            service = await self.repository.get(service_id)
            if service is None:
                raise HTTPException(status_code=404, detail="Service not found")

            return service
        except HTTPException as he:
            logger.error(f"An error occurred while fetching a service:: {he}")
            raise he
        except Exception as e:
            logger.error(f"An error occurred while fetching a service:: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching the service.",
            ) from e

    async def get_all_services(self) -> List[ServiceOutDTO]:
        try:
            return await self.repository.get_all()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching services.",
            ) from e

    async def update_service(
        self, service_id: PyObjectId, service: ServiceInDTO
    ) -> ServiceOutDTO:
        existing_service = await self.repository.get(service_id)
        if existing_service is None:
            raise HTTPException(status_code=404, detail="Service not found")

        try:
            return await self.repository.update(service_id, service)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the service.",
            ) from e

    async def delete_service_service(self, service_id: PyObjectId):
        existing_service = await self.repository.get(service_id)
        if existing_service is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
            )

        try:
            await self.repository.delete(service_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the service.",
            ) from e
