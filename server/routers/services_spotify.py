import base64
import urllib.parse

from fastapi import APIRouter, Query, HTTPException, Request, status
from httpx import AsyncClient
from starlette.responses import RedirectResponse

from config.constants import (
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
)
from models.auth_token import AuthToken
from models.user import User
from repository.user_repository import UserRepository
from services.auth_service import (
    get_current_user,
)

services_router_spotify = APIRouter(prefix="/services", tags=["Services"])

spotify_redirect_uri = "http://localhost:8080/api/services/callback/spotify"

user_repository = UserRepository()


@services_router_spotify.get(
    "/spotify",
    summary="Request authorization to spotify access data",
)
async def authorize_spotify_access(token: str = Query(..., description="Authorization token")):
    current_user = await get_current_user(token)
    state = current_user.username
    scope = "user-read-private user-read-email playlist-read-private playlist-modify-private user-library-modify"

    spotify_auth_url = (
        f"https://accounts.spotify.com/authorize?"
        f"response_type=code"
        f"&client_id={SPOTIFY_CLIENT_ID}"
        f"&scope={urllib.parse.quote(scope)}"
        f"&redirect_uri={urllib.parse.quote(spotify_redirect_uri)}"
        f"&state={state}"
    )

    print(f"Spotify URL: {spotify_auth_url}")
    return RedirectResponse(spotify_auth_url)


@services_router_spotify.get(
    "/callback/spotify",
)
async def authorize_spotify_access_callback(request: Request):
    code = request.query_params.get("code")
    state = request.query_params.get("state")

    if state is None:
        return {"error": "state_mismatch"}

    user = await user_repository.get_by_username(state)

    token_data = {
        "code": code,
        "redirect_uri": spotify_redirect_uri,
        "grant_type": "authorization_code",
    }

    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}'.encode()).decode()}"
    }

    async with AsyncClient() as client:
        response = await client.post(
            "https://accounts.spotify.com/api/token",
            data=token_data,
            headers=headers,
        )
        print(f"Spotify Response: {response.json()}")
        if response.status_code != status.HTTP_200_OK:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        response = response.json()
        auth_token = AuthToken(
            token=response["access_token"],
            refresh_token=response["refresh_token"],
            scopes=[response["scope"]],
            expires_in=response["expires_in"],
        )

        await user_repository.update_service_access_token(
            user.id, auth_token, "spotify_token"
        )
        
        access_token = user.access_token

        frontend_redirect_url = (
                    f"http://localhost:8081/dashboard?token={access_token}"
                )
        return RedirectResponse(url=frontend_redirect_url)
