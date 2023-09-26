from typing import List

from fastapi import HTTPException, status

from config.database import get_database
from models.py_object_id import PyObjectId
from models.user import User, UserCreate
from utils.password_utils import get_password_hash, verify_password


class UserRepository:
    @property
    def collection(self):
        return get_database()["Users"]

    async def get(self, user_id: PyObjectId) -> User:
        user_data = await self.collection.find_one({"_id": user_id})
        if user_data is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="(get) : User not found"
            )
        return User(**user_data)

    async def get_all(self) -> List[User]:
        return [User(**user) for user in await self.collection.find().to_list(1000)]

    async def update(self, user_id: PyObjectId, user: UserCreate) -> User:
        await self.collection.replace_one({"_id": user_id}, user.dict())
        return User(**await self.collection.find_one({"_id": user_id}))

    async def delete(self, user_id: PyObjectId) -> User:
        return User(**await self.collection.find_one_and_delete({"_id": user_id}))

    async def create(self, user: UserCreate) -> User:
        user_dict = user.dict()
        try:
            user_dict["password"] = get_password_hash(user_dict["password"])
        except TypeError:
            pass
        user_id = await get_database()["Users"].insert_one(user_dict)
        return await self.get(user_id.inserted_id)

    async def get_by_email(self, email: str) -> User:
        user_data = await self.collection.find_one({"email": email})
        return None if user_data is None else User(**user_data)

    async def authenticate_user(self, email: str, password: str) -> User:
        user = await self.get_by_email(email)
        print(user)
        return user if user and verify_password(password, user.password) else None

    async def get_by_username(self, username: str) -> User:
        user_data = await self.collection.find_one({"username": username})
        return None if user_data is None else User(**user_data)

    async def get_by_github_id(self, github_id: str) -> User:
        user_data = await self.collection.find_one({"github_id": github_id})
        return None if user_data is None else User(**user_data)

    async def get_by_spotify_id(self, spotify_id: str) -> User:
        user_data = await self.collection.find_one({"spotify_id": spotify_id})
        return None if user_data is None else User(**user_data)
