from typing import List

from fastapi import HTTPException, status

from app.repository.users_repository import UserRepository
from app.schemas.users_dto import UserInDTO, UserOutDTO
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
