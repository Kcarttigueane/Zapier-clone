import urllib.parse

from fastapi import APIRouter, Depends, HTTPException, Request, status
from httpx import AsyncClient
from starlette.responses import RedirectResponse

from config.constants import DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
from models.auth_token import AuthToken
from models.user import User
from repository.user_repository import UserRepository
from services.auth_service import get_current_user

services_router_discord = APIRouter(prefix="/services", tags=["Services"])
discord_redirect_uri = "http://localhost:8080/api/services/callback/discord"

user_repository = UserRepository()


@services_router_discord.get(
    "/discord",
    summary="Request authorization to discord access data",
)
async def authorize_discord_access(current_user: User = Depends(get_current_user)):
    state = current_user.username
    scope = "identify"

    discord_auth_url = (
        f"https://discord.com/oauth2/authorize?"
        f"response_type=code"
        f"&client_id={DISCORD_CLIENT_ID}"
        f"&scope={urllib.parse.quote(scope)}"
        f"&redirect_uri={urllib.parse.quote(discord_redirect_uri)}"
        f"&state={state}"
        f"&prompt=consent"
    )
    print(f"Discord URL: {discord_auth_url}")
    return RedirectResponse(discord_auth_url)


@services_router_discord.get("/callback/discord")
async def authorize_discord_access_callback(request: Request):
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    if state is None:
        return {"error": "state_mismatch"}

    user = await user_repository.get_by_username(state)

    token_data = {
        "code": code,
        "redirect_uri": discord_redirect_uri,
        "grant_type": "authorization_code",
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    async with AsyncClient() as client:
        response = await client.post(
            "https://discord.com/api/oauth2/token",
            data=token_data,
            headers=headers,
            auth=(DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET),
        )
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        response = response.json()
        auth_token = AuthToken(
            token=response["access_token"],
            refresh_token=response["refresh_token"],
            scopes=[response["scope"]],
            expires_in=response["expires_in"],
        )
        token = await user_repository.update_service_access_token(
            user.id, auth_token, "discord_token"
        )
        return token
