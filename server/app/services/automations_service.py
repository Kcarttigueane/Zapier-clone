from typing import List

from app.repository.automations_repository import AutomationRepository
from app.schemas.automations_dto import (
    AutomationInDTO,
    AutomationOutDTO,
    EnrichedAutomationOutDTO,
)
from app.schemas.py_object_id import PyObjectId
from app.schemas.services_dto import ServiceOutWithAuthorizationDTO
from app.services.actions_service import ActionsService
from app.services.services_service import ServiceService
from app.services.triggers_service import TriggersService
from app.services.users_services import UserService
from fastapi import HTTPException, status


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

    async def get_all_user_automations(
        self, user_id: PyObjectId
    ) -> List[AutomationOutDTO]:
        try:
            return await self.repository.get_all_user_automations(user_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def get_all_detailed_automations(
        self, user_id: PyObjectId
    ) -> List[EnrichedAutomationOutDTO]:
        try:
            automations = await self.repository.get_all_user_automations(user_id)
            enriched_automations = []

            for automation in automations:
                trigger_service_id = await TriggersService().get_service_by_trigger_id(
                    automation.trigger_id
                )
                action_service_id = await ActionsService().get_service_by_action_id(
                    automation.action_id
                )
                if not trigger_service_id or not action_service_id:
                    continue
                trigger_service = await ServiceService().get_service(trigger_service_id)
                action_service = await ServiceService().get_service(action_service_id)
                is_trigger_service_authorized = (
                    await UserService().has_user_authorized_service(
                        user_id, trigger_service.name
                    )
                )
                is_action_service_authorized = (
                    await UserService().has_user_authorized_service(
                        user_id, action_service.name
                    )
                )
                enriched_automations.append(
                    EnrichedAutomationOutDTO(
                        **automation.dict(),
                        trigger_service=ServiceOutWithAuthorizationDTO(
                            **trigger_service.dict(),
                            is_authorized=is_trigger_service_authorized,
                        ),
                        action_service=ServiceOutWithAuthorizationDTO(
                            **action_service.dict(),
                            is_authorized=is_action_service_authorized,
                        ),
                    )
                )
            return enriched_automations
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e
