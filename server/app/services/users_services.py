from typing import List

from fastapi import HTTPException, status

from app.repository.users_repository import UserRepository
from app.schemas.users_dto import UserInDTO, UserOutDTO
from app.utils.get_google_service_name import get_google_service_name
from app.utils.password_utils import get_password_hash


class UserService:
    def __init__(self):
        self.repository = UserRepository()

    async def create_user(self, user: UserInDTO) -> UserOutDTO:
        try:
            return await self.repository.create(user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while creating the user.",
            ) from e

    async def get_user(self, user_id: str) -> UserOutDTO:
        try:
            user = await self.repository.get(user_id)
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
            return user
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching the user.",
            ) from e

    async def update_user(self, user_id: str, user: UserInDTO) -> UserOutDTO:
        try:
            if await self.repository.get(user_id) is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
            return await self.repository.update(user_id, user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the user.",
            ) from e

    async def delete_user(self, user_id: str):
        try:
            if await self.repository.get(user_id) is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
            await self.repository.delete(user_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the user.",
            ) from e

    async def get_all_users(self) -> List[UserOutDTO]:
        try:
            return await self.repository.get_all()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while fetching users.",
            ) from e

    async def update_user_password(self, user_id: str, new_password: str):
        user = await self.get_user(user_id)
        user.password = get_password_hash(new_password)
        await self.update_user(user_id, user)

    async def has_user_authorized_service(self, user_id, serviceName: str) -> bool:
        user = await self.get_user(user_id)
        if not user:
            return False
        # TODO : Need to make a logic because the service name if google calendar but the service name if the oauth is calendar only,
        # TODO : potentially need to change how we store data but don't have the time for now
        googleServices = ['calendar', 'drive', 'gmail', 'youtube']
        googleServiceName = get_google_service_name(serviceName)
        if googleServiceName in googleServices:
            serviceName = googleServiceName
        return any(oauth_data.service_name == serviceName for oauth_data in user.oauth)
