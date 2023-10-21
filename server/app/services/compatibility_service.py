from typing import List

from fastapi import HTTPException, status

from app.repository.compatibility_repository import CompatibilityRepository
from app.schemas.compatibility_dto import (
    ServiceCompatibilityInDTO,
    ServiceCompatibilityOutDTO,
    TriggerActionCompatibilityInDTO,
    TriggerActionCompatibilityOutDTO,
)
from app.schemas.py_object_id import PyObjectId


class CompatibilityService:
    def __init__(self):
        self.repository = CompatibilityRepository()

    async def create_service_compatibility(
        self, compatibility: ServiceCompatibilityInDTO
    ) -> ServiceCompatibilityOutDTO:
        existing_compatibility = (
            await self.repository.get_service_compatibility_by_service_ids(
                compatibility.service_id_1, compatibility.service_id_2
            )
        )
        if existing_compatibility:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Compatibility already exists for these services.",
            )

        return await self.repository.create_service_compatibility(compatibility)

    async def get_service_compatibility(
        self, compatibility_id: PyObjectId
    ) -> ServiceCompatibilityOutDTO:
        compatibility = await self.repository.get_service_compatibility(
            compatibility_id
        )
        if compatibility is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service compatibility not found",
            )
        return compatibility

    async def update_service_compatibility(
        self, compatibility_id: PyObjectId, compatibility: ServiceCompatibilityInDTO
    ) -> ServiceCompatibilityOutDTO:
        if await self.repository.get_service_compatibility(compatibility_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service compatibility not found",
            )
        return await self.repository.update_service_compatibility(
            compatibility_id, compatibility
        )

    async def get_all_service_compatibilities(self) -> List[ServiceCompatibilityOutDTO]:
        return await self.repository.get_all_service_compatibilities()

    async def delete_service_compatibility(self, compatibility_id: PyObjectId):
        if await self.repository.get_service_compatibility(compatibility_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service compatibility not found",
            )
        await self.repository.delete_service_compatibility(compatibility_id)

    async def create_trigger_action_compatibility(
        self, compatibility: TriggerActionCompatibilityInDTO
    ) -> TriggerActionCompatibilityOutDTO:
        existing_compatibility = (
            await self.repository.get_trigger_action_compatibility_by_ids(
                compatibility.trigger_id, compatibility.action_id
            )
        )
        if existing_compatibility:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Compatibility already exists for these trigger and action.",
            )

        return await self.repository.create_trigger_action_compatibility(compatibility)

    async def update_trigger_action_compatibility(
        self,
        compatibility_id: PyObjectId,
        compatibility: TriggerActionCompatibilityInDTO,
    ) -> TriggerActionCompatibilityOutDTO:
        if (
            await self.repository.get_trigger_action_compatibility(compatibility_id)
            is None
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trigger action compatibility not found",
            )
        return await self.repository.update_trigger_action_compatibility(
            compatibility_id, compatibility
        )

    async def delete_trigger_action_compatibility(self, compatibility_id: PyObjectId):
        if (
            await self.repository.get_trigger_action_compatibility(compatibility_id)
            is None
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trigger action compatibility not found",
            )

        await self.repository.delete_trigger_action_compatibility(compatibility_id)

    async def get_all_trigger_action_compatibilities(
        self,
    ) -> List[TriggerActionCompatibilityOutDTO]:
        return await self.repository.get_all_trigger_action_compatibilities()

    async def get_trigger_action_compatibility(
        self, compatibility_id: PyObjectId
    ) -> TriggerActionCompatibilityOutDTO:
        compatibility = await self.repository.get_trigger_action_compatibility(
            compatibility_id
        )
        if compatibility is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trigger action compatibility not found",
            )
        return compatibility
