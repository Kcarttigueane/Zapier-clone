from datetime import datetime, timedelta
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId

from pydantic import BaseModel, Field


class AuthToken(BaseModel):
    token: str
    refresh_token: Optional[str] = Field(None)
    scopes: Optional[List[str]] = Field(None)
    expires_in: Optional[int] = Field(None)
    created_at: datetime = Field(default_factory=datetime.utcnow)


def is_expired(token: AuthToken):
    expiration_time = token.created_at + timedelta(seconds=token.expires_in)
    return expiration_time <= datetime.utcnow()


class TokenManager(BaseModel):
    google_drive_token: Optional[AuthToken] = Field(None)
    google_gmail_token: Optional[AuthToken] = Field(None)
    google_calendar_token: Optional[AuthToken] = Field(None)
    google_youtube_token: Optional[AuthToken] = Field(None)
    spotify_token: Optional[AuthToken] = Field(None)
    tinder_token: Optional[AuthToken] = Field(None)
    twitter_token: Optional[AuthToken] = Field(None)
    discord_token: Optional[AuthToken] = Field(None)
