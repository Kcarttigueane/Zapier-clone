import logging
from typing import List

from fastapi import HTTPException, status

from app.repository.service_repository import ServiceRepository
from app.schemas.py_object_id import PyObjectId
from app.schemas.services_dto import (
    ServiceInDTO,
    ServiceOutDTO,
    ServiceOutWithAuthorizationDTO,
)
from app.schemas.users_dto import UserOutDTO
from app.services.compatibility_service import CompatibilityService
from app.services.users_services import UserService

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
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Service not found",
                )

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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Service not found"
            )

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

    async def get_services_compatible_with_service(
        self, service_id: PyObjectId
    ) -> List[ServiceOutDTO]:
        service_compatibilities = (
            await CompatibilityService().find_service_compatibilities_by_service_id(
                service_id
            )
        )

        if len(service_compatibilities) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No services found associated with this service.",
            )

        compatible_services = []
        added_service_ids = set()

        for compatibility in service_compatibilities:
            other_service_id = (
                compatibility.service_id_1
                if str(compatibility.service_id_1) != str(service_id)
                else compatibility.service_id_2
            )

            if str(other_service_id) in added_service_ids:
                continue

            service_doc = await self.repository.get(other_service_id)
            if service_doc:
                compatible_services.append(service_doc)
                added_service_ids.add(str(other_service_id))

        return compatible_services

    async def get_all_services_with_authorization_status_by_user_id(
        self, user: UserOutDTO
    ):
        services = await self.get_all_services()
        services_with_authorized_status = []

        for service in services:
            is_authorized = await UserService().has_user_authorized_service(
                user.id, service.name
            )
            services_with_authorized_status.append(
                ServiceOutWithAuthorizationDTO(
                    **service.dict(),
                    is_authorized=is_authorized,
                )
            )
        return services_with_authorized_status
