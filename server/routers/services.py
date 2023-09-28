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


import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery


services_router = APIRouter(prefix="/services", tags=["Services"])

spotify_redirect_uri = 'http://localhost:8080/api/services/callback/spotify'
google_redirect_uri = 'http://localhost:8080/api/services/callback/google'

google_scopes = [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtubepartner",
        "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
        "https://www.googleapis.com/auth/yt-analytics.readonly",
        "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtubepartner-channel-audit"
]

user_respository = UserRepository()


def generate_random_string(length):
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for _ in range(length))


@services_router.get(
    "/spotify",
    summary="Request autorizathion to spotify access data",    
)
async def authorize_spotify_access():
    state = generate_random_string(16)
    scope = 'user-read-private user-read-email playlist-read-private'

    spotify_auth_url = f"https://accounts.spotify.com/authorize?" \
                        f"response_type=code" \
                        f"&client_id={SPOTIFY_CLIENT_ID}" \
                        f"&scope={urllib.parse.quote(scope)}" \
                        f"&redirect_uri={urllib.parse.quote(spotify_redirect_uri)}" \
                        f"&state={state}"
    
    print(f"Spotify URL: {spotify_auth_url}")
    return RedirectResponse(spotify_auth_url)


@services_router.get(
    "/callback/spotify",
)
async def authorize_spotify_access_callback(request: Request):
    code = request.query_params.get("code")
    state = request.query_params.get("state")
    
    if state is None:
        return {"error": "state_mismatch"}
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
            return {"access_token": response.json()['access_token'], "expires_in": response.json()["expires_in"]}
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        

@services_router.get(
    "/google",
    summary="Request autorizathion to google access data",
)
async def authorize_google_acces(current_user: User = Depends(get_current_user)):
    username = current_user.username
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file='client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json',
        scopes=google_scopes,
    )

    flow.redirect_uri = google_redirect_uri
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        state = username
    )

    return RedirectResponse(authorization_url)


def credentials_to_dict(credentials):
    return {'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes}

@services_router.get("/callback/google")
async def authorize_google_access_callback(request: Request):
    state = request.query_params.get("state")

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file='client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json',
        scopes=google_scopes,
        state=state
    )
    flow.redirect_uri = google_redirect_uri
    authorization_response = str(request.url)
    flow.fetch_token(authorization_response=authorization_response)
    credentials = credentials_to_dict(flow.credentials)
    user = await user_respository.get_by_username(state)
    print(f"User Info: {user}")
    auth_token = AuthToken(
        token=credentials['token'],
        refresh_token=credentials['refresh_token'],
        scopes=credentials["scopes"]
    )
    await user_respository.update_google_access_token(user.id, auth_token)
    return credentials
