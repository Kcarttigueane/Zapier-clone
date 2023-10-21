from typing import List

from fastapi import HTTPException, status

from app.repository.triggers_repository import TriggerRepository
from app.schemas.py_object_id import PyObjectId
from app.schemas.triggers_dto import TriggerInDTO, TriggerOutDTO


class TriggersService:
    def __init__(self):
        self.repository = TriggerRepository()

    async def create_trigger(self, trigger: TriggerInDTO) -> TriggerOutDTO:
        existing_trigger = await self.repository.get_by_name_and_service_id(
            trigger.name, trigger.service_id
        )

        if existing_trigger:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trigger with this name already exists for this service.",
            )

        try:
            return await self.repository.create(trigger)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e

    async def get_trigger(self, trigger_id: PyObjectId) -> TriggerOutDTO:
        trigger = await self.repository.get(trigger_id)
        if trigger:
            return trigger
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Trigger not found"
        )

    async def update_trigger(
        self, trigger_id: PyObjectId, trigger: TriggerInDTO
    ) -> TriggerOutDTO:
        if await self.repository.get(trigger_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Trigger not found"
            )

        try:
            return await self.repository.update(trigger_id, trigger)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e

    async def delete_trigger(self, trigger_id: PyObjectId):
        if await self.repository.get(trigger_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Trigger not found"
            )

        try:
            await self.repository.delete(trigger_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e

    async def get_all_triggers(self) -> List[TriggerOutDTO]:
        try:
            return await self.repository.get_all()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def get_triggers_by_service(
        self, service_id: PyObjectId
    ) -> List[TriggerOutDTO]:
        try:
            return await self.repository.get_by_service_id(service_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def get_triggers_by_action(
        self, action_id: PyObjectId, service_id: PyObjectId
    ) -> List[TriggerOutDTO]:
        trigger_action_compatibilities = await self.repository.find_by_action_id(
            action_id
        )

        triggers = []
        for compatibility in trigger_action_compatibilities:
            trigger = await TriggerRepository().get(compatibility.trigger_id)
            if trigger and str(trigger.service_id) == str(service_id):
                triggers.append(trigger)
        return triggers
