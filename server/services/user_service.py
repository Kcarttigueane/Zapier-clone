from typing import List

from fastapi import HTTPException, status

from models.py_object_id import PyObjectId
from models.user import User, UserCreate
from repository.user_repository import UserRepository


class UserService:
    def __init__(self):
        self.repository = UserRepository()

    async def create_user(self, user: UserCreate) -> User:
        try:
            return await self.repository.create(user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def get_users(self) -> List[User]:
        try:
            return await self.repository.get_all()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def get_user(self, user_id: PyObjectId) -> User:
        try:
            return await self.repository.get(user_id)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def update_user(self, user_id: PyObjectId, user: UserCreate) -> User:
        try:
            return await self.repository.update(user_id, user)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def delete_user(self, user_id: PyObjectId) -> User:
        try:
            return await self.repository.delete(user_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e
