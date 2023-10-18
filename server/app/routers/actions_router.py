from typing import List

from fastapi import APIRouter, Response, status

from app.schemas.actions_dto import ActionInDTO, ActionOutDTO
from app.schemas.py_object_id import PyObjectId
from app.services.actions_service import ActionsService

actions_router = APIRouter(prefix="/actions", tags=["Actions"])

ActionsServices = ActionsService()


@actions_router.post(
    "/",
    response_model=ActionOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create an action",
)
async def create_action(action_data: ActionInDTO) -> ActionOutDTO:
    """
    Endpoint to create a new action.

    Parameters:
    - action_data: The data of the action to be created.

    Returns:
    - The created action with additional information like ID.
    """
    return await ActionsServices.create_action(action_data)


@actions_router.get(
    "/{action_id}",
    response_model=ActionOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve an action by ID",
)
async def read_action(action_id: PyObjectId) -> ActionOutDTO:
    """
    Endpoint to retrieve an existing action by its ID.

    Parameters:
    - action_id: The ID of the action to be retrieved.

    Returns:
    - The retrieved action.
    """
    return await ActionsServices.get_action(action_id)


@actions_router.patch(
    "/{action_id}",
    response_model=ActionOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update an action by ID",
)
async def update_action(action_id: PyObjectId, action: ActionInDTO):
    """
    Endpoint to update an existing action by its ID.

    Parameters:
    - action_id: The ID of the action to be retrieved.

    Returns:
    - The new updated action.
    """
    return await ActionsServices.update_action(action_id, action)


@actions_router.delete(
    "/{action_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete an action by ID",
)
async def delete_action(action_id: PyObjectId):
    """
    Endpoint to delete an existing action by its ID.

    Parameters:
    - action_id: The ID of the action to be retrieved.

    Returns:
    - None
    """
    return await ActionsServices.delete_action(action_id)


@actions_router.get(
    "/",
    response_model=List[ActionOutDTO],
    description="Retrieve all actions",
)
async def read_actions():
    """
    Endpoint to retrieve all existing actions.

    Parameters:
    - None

    Returns:
    - The retrieved actions.
    """
    return await ActionsServices.get_all_actions()


@actions_router.get(
    "/service/{service_id}",
    response_model=List[ActionOutDTO],
    status_code=status.HTTP_200_OK,
    description="Retrieve all triggers associated with a service",
)
async def read_triggers_by_service(service_id: PyObjectId):
    """
    Endpoint to retrieve all existing actions associated with a service by service ID.

    Parameters:
    - service_id: The ID of the service to retrieve actions for.

    Returns:
    - The retrieved actions.
    """
    return await ActionsServices.get_actions_by_service(service_id)
