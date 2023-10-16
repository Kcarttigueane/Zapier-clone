from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from models.auth_token import TokenManager
from models.automation import Automation
from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId


class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = Field(None)
    password: Optional[str] = Field(None)
    github_id: Optional[str] = Field(None)
    spotify_id: Optional[str] = Field(None)
    google_id: Optional[str] = Field(None)
    access_token: Optional[str] = Field(None)
    token_manager: Optional[TokenManager] = Field(TokenManager())
    automations: Optional[List[Automation]] = Field(default_factory=list)

    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password": "your_password",
                "github_id": "your_github_id",
                "spotify_id": "your_spotify_id",
                "google_id": "your_google_id",
                "tokenManger": "your_token_manager_object",
                "automations": "your_automation_list",
            }
        }


class User(DbModelMixin, UserCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
