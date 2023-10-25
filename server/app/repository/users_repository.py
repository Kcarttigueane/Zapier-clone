from typing import List

from fastapi import HTTPException, status

from app.core.database import get_database
from app.schemas.py_object_id import PyObjectId
from app.schemas.users_dto import UserInDTO, UserOutDTO
from app.utils.password_utils import (
    create_code_password_recovery,
    send_mail_forgot_password,
)


class UserRepository:
    @property
    def collection(self):
        return get_database()["Users"]

    async def get(self, user_id: str) -> UserOutDTO | None:
        result = await self.collection.find_one({"_id": PyObjectId(user_id)})
        return UserOutDTO.from_mongo(result) if result else None

    async def create(self, user: UserInDTO):
        result = await self.collection.insert_one(user.dict())
        return await self.get(result.inserted_id)

    async def update(self, user_id: str, user: UserInDTO):
        update_data = user.dict(exclude_none=True)

        if len(update_data["oauth"]) == 0:
            del update_data["oauth"]

        await self.collection.update_one(
            {"_id": PyObjectId(user_id)}, {"$set": update_data}
        )
        return await self.get(user_id)

    async def delete(self, user_id: str):
        await self.collection.delete_one({"_id": PyObjectId(user_id)})

    async def get_all(self) -> List[UserOutDTO]:
        users = await self.collection.find().to_list(1000)
        return [UserOutDTO.from_mongo(user) for user in users]

    async def get_by_email(self, email: str) -> UserOutDTO | None:
        result = await self.collection.find_one({"email": email})
        return UserOutDTO.from_mongo(result) if result else None

    async def get_user_by_oauth_by_provider_user_id(
        self, provider: str, provider_user_id: str
    ) -> UserOutDTO | None:
        query = {
            "oauth": {
                "$elemMatch": {
                    "provider": provider,
                    "provider_user_id": provider_user_id,
                }
            }
        }
        result = await self.collection.find_one(query)
        return UserOutDTO.from_mongo(result) if result else None

    async def update_user_recovery_code(self, user_id: str, recovery_code: str):
        await self.collection.update_one(
            {"_id": PyObjectId(user_id)}, {"$set": {"recovery_code": recovery_code}}
        )
        return await self.get(user_id)

    async def update_user_password(self, user_id: str, password: str):
        await self.collection.update_one(
            {"_id": PyObjectId(user_id)}, {"$set": {"password": password}}
        )
        return await self.get(user_id)

    async def forgot_password(self, email: str):
        user = await self.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The user with this email does not exist in the system.",
            )
        code = create_code_password_recovery()
        await self.update_user_recovery_code(str(user.id), code)
        send_mail_forgot_password(email, user.profile.first_name, code)
        return {"message": "Email send"}

    async def reset_password(self, email: str, code: str, new_password: str):
        user = await self.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found",
            )
        if user.recovery_code != code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Code not valid",
            )
        await self.update_user_password(str(user.id), new_password)
        return {"message": "Password updated"}
