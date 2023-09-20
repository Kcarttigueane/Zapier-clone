from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId

class UserCreate(BaseModel):
    username: str
    email: EmailStr = Field(...)
    password: Optional[str] = Field(None)

    class Config:
        schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "johndoe@example.com",
                "password": "your_password",
            }
        }

class User(DbModelMixin, UserCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")