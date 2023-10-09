from typing import List, Optional

from pydantic import BaseModel, Field


class AuthToken(BaseModel):
    token: str
    refresh_token: Optional[str] = Field(None)
    scopes: Optional[List[str]] = Field(None)
    expires_in: Optional[int] = Field(None)


class TokenManager(BaseModel):
    google_drive_token: Optional[AuthToken] = Field(None)
    google_gmail_token: Optional[AuthToken] = Field(None)
    google_calendar_token: Optional[AuthToken] = Field(None)
    google_youtube_token: Optional[AuthToken] = Field(None)
    spotify_token: Optional[AuthToken] = Field(None)
    tinder_token: Optional[AuthToken] = Field(None)
    twitter_token: Optional[AuthToken] = Field(None)
    discord_token: Optional[AuthToken] = Field(None)
