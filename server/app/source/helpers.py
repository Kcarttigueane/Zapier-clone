import base64
from datetime import datetime, timezone
from typing import List

import requests
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client

from app.core.config import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    POLLING,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
)
from app.repository.users_repository import UserRepository
from app.schemas.automations_dto import AutomationOutDTO
from app.schemas.users_dto import UserInDTO, UserOAuthDTO, UserOutDTO

user_repository = UserRepository()


def get_google_credentials(token: str):
    return client.OAuth2Credentials(
        access_token=token,
        refresh_token=None,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        token_expiry=None,
        token_uri=GOOGLE_TOKEN_URI,
        user_agent=None,
        revoke_uri=GOOGLE_REVOKE_URI,
    )


def get_service_auth(user: UserOutDTO, service_name: str) -> UserOAuthDTO | None:
    authentifications: List[UserOAuthDTO] = user.oauth

    for auth in authentifications:
        if auth.service_name == service_name:
            return auth

    return None


async def handle_spotify_refresh_token(user: UserOutDTO):
    auth = get_service_auth(user, "spotify")

    if not auth:
        return user

    headers = {
        "Authorization": (
            "Basic "
            + base64.b64encode(
                f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}".encode()
            ).decode()
        )
    }

    data = {"grant_type": "refresh_token", "refresh_token": auth.refresh_token}

    response = requests.post(
        "https://accounts.spotify.com/api/token", headers=headers, data=data
    )

    if response.status_code == 200:
        response_json = response.json()
        auth.access_token = response_json["access_token"]
        for i, user_auth in enumerate(user.oauth):
            if user_auth.service_name == "spotify":
                user.oauth[i] = auth

        user_in = UserInDTO(**user.dict())
        await user_repository.update(str(user.id), user_in)
        return user
    else:
        print("Error refreshing token:", response.status_code)
        print(response.text)
    return user


async def handle_refresh_token(user: UserOutDTO, service_name: str) -> UserOutDTO:
    if service_name == "spotify":
        user = await handle_spotify_refresh_token(user)
    return user


def automation_poll_status(automation: AutomationOutDTO):
    if automation.status == "disabled":
        return False
    return (
        datetime.now(timezone.utc) - automation.last_polled
    ).total_seconds() / 60 >= POLLING
