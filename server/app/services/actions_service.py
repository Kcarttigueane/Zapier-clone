import logging
from typing import List

from fastapi import HTTPException, status

from app.repository.actions_repository import ActionRepository
from app.schemas.actions_dto import ActionInDTO, ActionOutDTO
from app.schemas.py_object_id import PyObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ActionsService:
    def __init__(self):
        self.repository = ActionRepository()

    async def create_action(self, action: ActionInDTO) -> ActionOutDTO:
        """
        Create a new action.

        Parameters:
        - action: ActionInDTO : The data of the action to be created.

        Returns:
        - ActionOutDTO: The created action with additional information like ID.

        Raises:
        - HTTPException: An error occurred while creating the action.
        """

        existing_action = await self.repository.get_by_name_and_service_id(
            action.name, action.service_id
        )

        if existing_action:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Action with this name already exists for this service.",
            )

        try:
            return await self.repository.create(action)
        except Exception as e:
            logger.error(f"An error occurred while creating an action:: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An error occurred while creating the action.",
            ) from e

    async def get_action(self, action_id: PyObjectId) -> ActionOutDTO:
        """
        Retrieve an action by its ID.

        Parameters:
        - action_id: PyObjectId : The ID of the action to be retrieved.

        Returns:
        - ActionOutDTO: The retrieved action.

        Raises:
        - HTTPException: Error occurred while retrieving the action or action not found.
        """
        try:
            action = await self.repository.get(action_id)

            if action:
                return action
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Action not found."
            )
        except HTTPException as he:
            logger.error(f"HTTP Exception: {he.detail}")
            raise he
        except Exception as e:
            logger.error(f"An error occurred while retrieving an action: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving the action.",
            ) from e

    async def update_action(
        self, action_id: PyObjectId, action: ActionInDTO
    ) -> ActionOutDTO:
        """
        Update an existing action.

        Parameters:
        - action_id: PyObjectId : The ID of the action to be updated.
        - action: ActionInDTO : The updated data of the action.

        Returns:
        - ActionOutDTO: The updated action.

        Raises:
        - HTTPException: Error occurred while updating the action or action not found.
        """
        if await self.repository.get(action_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Action not found"
            )

        try:
            updated_action = await self.repository.update(action_id, action)
            if updated_action:
                return updated_action
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Action not found."
            )
        except Exception as e:
            logger.error(f"An error occurred while updating an action: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the action.",
            ) from e

    async def delete_action(self, action_id: PyObjectId):
        """
        Delete an action by its ID.

        Parameters:
        - action_id: PyObjectId : The ID of the action to be deleted.

        Raises:
        - HTTPException: An error occurred while deleting the action.
        """
        existing_action = await self.repository.get(action_id)
        if existing_action is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Action not found"
            )

        try:
            await self.repository.delete(action_id)
        except Exception as e:
            logger.error(f"An error occurred while deleting an action: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the action.",
            ) from e

    async def get_all_actions(self) -> List[ActionOutDTO]:
        """
        Retrieve all actions.

        Returns:
        - List[ActionOutDTO]: A list of all actions.

        Raises:
        - HTTPException: An error occurred while retrieving all actions.
        """
        try:
            return await self.repository.get_all()
        except Exception as e:
            logger.error(f"An error occurred while retrieving all actions: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving all actions.",
            ) from e

    async def get_actions_by_service(
        self, service_id: PyObjectId
    ) -> List[ActionOutDTO]:
        try:
            return await self.repository.get_by_service_id(service_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def get_actions_by_trigger(
        self, trigger_id: PyObjectId, service_id: PyObjectId
    ) -> List[ActionOutDTO]:
        trigger_action_compatibilities = await self.repository.find_by_trigger_id(
            trigger_id
        )
        actions = []
        for compatibility in trigger_action_compatibilities:
            action = await ActionRepository().get(compatibility.action_id)
            if action and str(action.service_id) == str(service_id):
                actions.append(action)
        return actions
