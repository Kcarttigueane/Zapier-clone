from typing import List

from fastapi import HTTPException, status

from app.repository.automations_repository import AutomationRepository
from app.schemas.automations_dto import AutomationInDTO, AutomationOutDTO
from app.schemas.py_object_id import PyObjectId


class AutomationsService:
    def __init__(self):
        self.repository = AutomationRepository()

    async def create_automation(self, automation: AutomationInDTO) -> AutomationOutDTO:
        existing_automation = await self.repository.get_automation_by_name(
            name=automation.name
        )

        if existing_automation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Automation with this name already exists for this service.",
            )

        try:
            return await self.repository.create(automation)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e

    async def get_automation(self, automation_id: PyObjectId) -> AutomationOutDTO:
        automation = await self.repository.get(automation_id)
        if automation:
            return automation
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Automation not found"
        )

    async def update_automation(
        self, automation_id: PyObjectId, automation: AutomationInDTO
    ) -> AutomationOutDTO:
        if await self.repository.get(automation_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Automation not found"
            )

        try:
            return await self.repository.update(automation_id, automation)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e

    async def delete_automation(self, automation_id: PyObjectId):
        if await self.repository.get(automation_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Automation not found"
            )

        try:
            await self.repository.delete(automation_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e

    async def get_all_automations(self) -> List[AutomationOutDTO]:
        try:
            return await self.repository.get_all()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e
