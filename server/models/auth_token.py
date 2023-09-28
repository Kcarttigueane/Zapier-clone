from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId



class AuthToken(BaseModel):
    token: str
    refresh_token: Optional[str] = Field(None)
    scopes: Optional[List[str]] = Field(None)
    expires_in: Optional[int] = Field(None)
