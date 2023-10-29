import logging
import base64
from datetime import datetime
from typing import List
from fastapi import status
import requests
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client

from app.core.config import (
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    POLLING,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET,
    AZURE_TENANT_ID,
)
from app.repository.users_repository import UserRepository
from app.schemas.automations_dto import AutomationOutDTO
from app.schemas.users_dto import UserInDTO, UserOAuthDTO, UserOutDTO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

user_repository = UserRepository()


def get_google_credentials(token: str, refresh_token: str):
    return client.OAuth2Credentials(
        access_token=token,
        refresh_token=refresh_token,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        token_expiry=None,
        token_uri=GOOGLE_TOKEN_URI,
        user_agent=None,
        revoke_uri=GOOGLE_REVOKE_URI,
    )


def get_service_auth(user: UserOutDTO, service_name: str) -> UserOAuthDTO | None:
    authentications: List[UserOAuthDTO] = user.oauth

    return next(
        (auth for auth in authentications if auth.service_name == service_name),
        None,
    )


async def handle_microsoft_refresh_token(user: UserOutDTO):
    auth = get_service_auth(user, "teams")

    if not auth:
        return user

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    data = {
        "client_id": AZURE_CLIENT_ID,
        "scope": "offline_access User.Read Mail.Read",
        "refresh_token": auth.refresh_token,
        "grant_type": "refresh_token",
        "client_secret": AZURE_CLIENT_SECRET,
    }

    token_url = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token"

    response = requests.post(token_url, headers=headers, data=data)

    if response.status_code != status.HTTP_200_OK:
        logger.info("Error refreshing token:", response.status_code)
        logger.info(response.text)
        return user

    response_json = response.json()
    auth.access_token = response_json["access_token"]
    auth.refresh_token = response_json["refresh_token"]
    for i, user_auth in enumerate(user.oauth):
        if user_auth.service_name == "teams":
            user.oauth[i] = auth

    user_in = UserInDTO(**user.dict())
    await user_repository.update(str(user.id), user_in)
    return user


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

    if response.status_code == status.HTTP_200_OK:
        response_json = response.json()
        auth.access_token = response_json["access_token"]
        for i, user_auth in enumerate(user.oauth):
            if user_auth.service_name == "spotify":
                user.oauth[i] = auth

        user_in = UserInDTO(**user.dict())
        await user_repository.update(str(user.id), user_in)
        return user
    else:
        logger.info("Error refreshing token:", response.status_code)
        logger.info(response.text)
    return user


async def handle_refresh_token(user: UserOutDTO, service_name: str) -> UserOutDTO:
    if service_name == "spotify":
        user = await handle_spotify_refresh_token(user)
    elif service_name == "teams":
        user = await handle_microsoft_refresh_token(user)
    return user


def automation_poll_status(automation: AutomationOutDTO):
    if automation.status == "disabled":
        return False
    utc_now = datetime.utcnow()
    automation_last_polled = automation.last_polled.replace(tzinfo=None)
    return (utc_now - automation_last_polled).total_seconds() / 60 >= POLLING
