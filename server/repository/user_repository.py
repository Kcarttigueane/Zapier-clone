from typing import List

from fastapi import HTTPException, status

from config.database import get_database
from config.constants import ALGORITHM, SECRET_KEY
from models.py_object_id import PyObjectId
from models.user import User, UserCreate
from models.auth_token import AuthToken
from utils.password_utils import get_password_hash, verify_password
import jwt


def encrypt_token(data: dict):
    return jwt.encode(data.copy(), SECRET_KEY, algorithm=ALGORITHM)

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
        print(f"Update User {user.dict()}")
        await self.collection.replace_one({"_id": user_id}, user.dict())
        return User(**await self.collection.find_one({"_id": user_id}))

    async def delete(self, user_id: PyObjectId) -> User:
        return User(**await self.collection.find_one_and_delete({"_id": user_id}))

    async def create(self, user: UserCreate) -> User:
        user_dict = user.dict()
        try:
            if user.password != None:
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
    
    async def get_by_google_id(self, id: str) -> User:
        user_data = await self.collection.find_one({"google_id": id})
        return None if user_data is None else User(**user_data)
    

    async def update_service_access_token(self, user_id: PyObjectId, token: AuthToken, service: str) -> AuthToken:
        user = await self.collection.find_one({"_id": user_id})
        token.token = encrypt_token({"token": token.token})
        token.refresh_token = encrypt_token({"refresh_token": token.refresh_token})
        if user:
            user["token_manager"][service] = token.dict()
            await self.collection.replace_one({"_id": user_id}, user)
            return token
        else:
            raise ValueError(f"User with ID {user_id} not found")