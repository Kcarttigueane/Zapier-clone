from typing import List

from app.core.database import get_database
from app.schemas.py_object_id import PyObjectId
from app.schemas.users_dto import UserInDTO, UserOutDTO


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
