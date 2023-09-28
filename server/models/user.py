from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId
from models.auth_token import AuthToken

class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = Field(None)
    password: Optional[str] = Field(None)
    github_id: Optional[str] = Field(None)
    spotify_id: Optional[str] = Field(None)
    google_id: Optional[str] = Field(None)
    google_access_token: Optional[AuthToken] = Field(None)
    spotify_access_token: Optional[AuthToken] = Field(None)


    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password": "your_password",
                "github_id": "your_github_id",
                "spotify_id": "your_spotify_id",
                "google_id": "your_google_id",
                "google_acces_token": "your_google_acces_token",
                "spotify_acces_token": "your_spotify_acces_token"
            }
        }

class User(DbModelMixin, UserCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")