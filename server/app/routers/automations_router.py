from typing import List

from fastapi import APIRouter, Depends, Response, status

from app.schemas.automations_dto import AutomationInDTO, AutomationOutDTO
from app.schemas.py_object_id import PyObjectId
from app.services.automations_service import AutomationsService
from app.utils.auth_utils import check_access_token

automations_router: APIRouter = APIRouter(
    prefix="/automations",
    tags=["Automations"],
    dependencies=[Depends(check_access_token)],
)

AutomationService = AutomationsService()


@automations_router.post(
    "/",
    response_model=AutomationOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create a automation",
)
async def create_automation(automation_data: AutomationInDTO) -> AutomationOutDTO:
    """Create a new automation."""
    return await AutomationService.create_automation(automation_data)


@automations_router.get(
    "/{automation_id}",
    response_model=AutomationOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve a automation by ID",
)
async def read_automation(automation_id: PyObjectId) -> AutomationOutDTO:
    """Retrieve an existing automation by its ID."""
    return await AutomationService.get_automation(automation_id)


@automations_router.patch(
    "/{automation_id}",
    response_model=AutomationOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update a automation by ID",
)
async def update_automation(automation_id: PyObjectId, automation: AutomationInDTO):
    """Update an existing automation by its ID."""
    return await AutomationService.update_automation(automation_id, automation)


@automations_router.delete(
    "/{automation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete a automation by ID",
)
async def delete_automation(automation_id: PyObjectId):
    """Delete an existing automation by its ID."""
    return await AutomationService.delete_automation(automation_id)


@automations_router.get(
    "/",
    response_model=List[AutomationOutDTO],
    description="Retrieve all automations",
)
async def read_automations():
    """Retrieve all existing automations."""
    return await AutomationService.get_all_automations()
