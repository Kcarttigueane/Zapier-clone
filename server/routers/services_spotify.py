import base64
from typing import List

from fastapi import APIRouter, Depends, status, HTTPException, Request

from httpx import AsyncClient
from typing import Optional

from models.py_object_id import PyObjectId
from models.user import User, UserCreate
from models.auth_token import AuthToken
from services.auth_service import get_current_user, check_access_token, raise_unauthorized_exception
from services.user_service import UserService
from config.constants import ACCESS_TOKEN_EXPIRE_MINUTES,\
    GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTHLIB_INSECURE_TRANSPORT,\
    SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from starlette.responses import RedirectResponse
import random
import string
import urllib.parse
from urllib.parse import urlparse, parse_qs
from repository.user_repository import UserRepository
from source.actions.google_drive import check_latests_file
from source.reactions.google_gmail import send_email_to_user


services_router_spotify = APIRouter(prefix="/services", tags=["Services"])

spotify_redirect_uri = 'http://localhost:8080/api/services/callback/spotify'

user_respository = UserRepository()

@services_router_spotify.get(
    "/spotify",
    summary="Request autorizathion to spotify access data",    
)
async def authorize_spotify_access(current_user: User = Depends(get_current_user)):
    state = current_user.username
    scope = 'user-read-private user-read-email playlist-read-private'

    spotify_auth_url = f"https://accounts.spotify.com/authorize?" \
                        f"response_type=code" \
                        f"&client_id={SPOTIFY_CLIENT_ID}" \
                        f"&scope={urllib.parse.quote(scope)}" \
                        f"&redirect_uri={urllib.parse.quote(spotify_redirect_uri)}" \
                        f"&state={state}"
    
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
    
    user = await user_respository.get_by_username(state)

    token_data = {
        "code": code,
        "redirect_uri": spotify_redirect_uri,
        "grant_type": "authorization_code"
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
        if response.status_code == 200:
            response = response.json()
            auth_token = AuthToken(
                token=response['access_token'],
                refresh_token=response['refresh_token'],
                scopes=[response['scopes']],
                expires_in=response['expires_in']
            )
            token = await user_respository.update_service_access_token(user.id, auth_token, "spotify_token")
            return token
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)