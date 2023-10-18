from typing import List

from fastapi import APIRouter, Depends, Response, status

from app.schemas.py_object_id import PyObjectId
from app.schemas.triggers_dto import TriggerInDTO, TriggerOutDTO
from app.services.triggers_service import TriggersService
from app.utils.auth_utils import check_admin_access_token

triggers_router = APIRouter(
    prefix="/triggers",
    tags=["Triggers"],
    dependencies=[Depends(check_admin_access_token)],
)

TriggerServices = TriggersService()


@triggers_router.post(
    "/",
    response_model=TriggerOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create a trigger",
)
async def create_trigger(trigger_data: TriggerInDTO) -> TriggerOutDTO:
    """Create a new trigger."""
    return await TriggerServices.create_trigger(trigger_data)


@triggers_router.get(
    "/{trigger_id}",
    response_model=TriggerOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve a trigger by ID",
)
async def read_trigger(trigger_id: PyObjectId) -> TriggerOutDTO:
    """Retrieve an existing trigger by its ID."""
    return await TriggerServices.get_trigger(trigger_id)


@triggers_router.patch(
    "/{trigger_id}",
    response_model=TriggerOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update a trigger by ID",
)
async def update_trigger(trigger_id: PyObjectId, trigger: TriggerInDTO):
    """Update an existing trigger by its ID."""
    return await TriggerServices.update_trigger(trigger_id, trigger)


@triggers_router.delete(
    "/{trigger_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete a trigger by ID",
)
async def delete_trigger(trigger_id: PyObjectId):
    """Delete an existing trigger by its ID."""
    return await TriggerServices.delete_trigger(trigger_id)


@triggers_router.get(
    "/",
    response_model=List[TriggerOutDTO],
    description="Retrieve all triggers",
)
async def read_triggers():
    """Retrieve all existing triggers."""
    return await TriggerServices.get_all_triggers()


@triggers_router.get(
    "/service/{service_id}",
    response_model=List[TriggerOutDTO],
    status_code=status.HTTP_200_OK,
    description="Retrieve all triggers associated with a service",
)
async def read_triggers_by_service(service_id: PyObjectId):
    """Retrieve all triggers associated with a service by service ID."""
    return await TriggerServices.get_triggers_by_service(service_id)
