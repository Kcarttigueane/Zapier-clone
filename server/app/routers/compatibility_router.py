from typing import List

from fastapi import APIRouter, Response, status

from app.schemas.compatibility_dto import (
    ServiceCompatibilityInDTO,
    ServiceCompatibilityOutDTO,
    TriggerActionCompatibilityInDTO,
    TriggerActionCompatibilityOutDTO,
)
from app.schemas.py_object_id import PyObjectId
from app.services.compatibility_service import CompatibilityService

compatibility_router = APIRouter(prefix="/compatibility", tags=["Compatibility"])

CompatibilityServices = CompatibilityService()


@compatibility_router.post(
    "/",
    response_model=ServiceCompatibilityInDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create a compatibility between 2 services",
)
async def create_service_compatibility(
    compatibility_data: ServiceCompatibilityInDTO,
) -> ServiceCompatibilityOutDTO:
    """Create a new compatibility."""
    return await CompatibilityServices.create_service_compatibility(compatibility_data)


@compatibility_router.get(
    "/services/{compatibility_id}",
    response_model=ServiceCompatibilityOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve a compatibility by ID",
)
async def read_service_compatibility(compatibility_id: PyObjectId):
    """Retrieve an existing compatibility by its ID."""
    return await CompatibilityServices.get_service_compatibility(compatibility_id)


@compatibility_router.patch(
    "/services/{compatibility_id}",
    response_model=ServiceCompatibilityOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update a compatibility by ID",
)
async def update_service_compatibility(
    compatibility_id: PyObjectId, compatibility: ServiceCompatibilityInDTO
):
    """Update an existing compatibility by its ID."""
    return await CompatibilityServices.update_service_compatibility(
        compatibility_id, compatibility
    )


@compatibility_router.delete(
    "/services/{compatibility_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete a compatibility by ID",
)
async def delete_service_compatibility(compatibility_id: PyObjectId):
    """Delete an existing compatibility by its ID."""
    return await CompatibilityServices.delete_service_compatibility(compatibility_id)


@compatibility_router.get(
    "/services/",
    response_model=List[ServiceCompatibilityOutDTO],
    description="Retrieve all compatibility",
)
async def compatibility_service():
    """Retrieve all existing compatibility."""
    return await CompatibilityServices.get_all_service_compatibilities()


@compatibility_router.post(
    "/triggerAction/",
    response_model=TriggerActionCompatibilityOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create a trigger action compatibility between 2 services",
)
async def create_compatibility(
    compatibility_data: TriggerActionCompatibilityInDTO,
) -> TriggerActionCompatibilityOutDTO:
    """Create a new compatibility."""
    return await CompatibilityServices.create_trigger_action_compatibility(
        compatibility_data
    )


@compatibility_router.get(
    "/triggerAction/{compatibility_id}",
    response_model=TriggerActionCompatibilityOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve a trigger action compatibility by ID",
)
async def read_compatibility(compatibility_id: PyObjectId):
    """Retrieve an existing compatibility by its ID."""
    return await CompatibilityServices.get_trigger_action_compatibility(
        compatibility_id
    )


@compatibility_router.patch(
    "/triggerAction/{compatibility_id}",
    response_model=TriggerActionCompatibilityOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update a trigger action compatibility by ID",
)
async def update_compatibility(
    compatibility_id: PyObjectId, compatibility: TriggerActionCompatibilityInDTO
):
    """Update an existing compatibility by its ID."""
    return await CompatibilityServices.update_trigger_action_compatibility(
        compatibility_id, compatibility
    )


@compatibility_router.delete(
    "/triggerAction/{compatibility_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete a trigger action compatibility by ID",
)
async def delete_compatibility(compatibility_id: PyObjectId):
    """Delete an existing compatibility by its ID."""
    return await CompatibilityServices.delete_trigger_action_compatibility(
        compatibility_id
    )


@compatibility_router.get(
    "/triggerAction/",
    response_model=List[TriggerActionCompatibilityOutDTO],
    description="Retrieve all trigger action compatibility",
)
async def compatibility():
    """Retrieve all existing compatibility."""
    return await CompatibilityServices.get_all_trigger_action_compatibilities()
