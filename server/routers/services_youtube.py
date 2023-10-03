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


services_router_youtube = APIRouter(prefix="/services", tags=["Services"])
google_redirect_uri = 'http://localhost:8080/api/services/callback/google/youtube'

youtube_scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]

user_respository = UserRepository()


@services_router_youtube.get(
    "/google/youtube",
    summary="Request autorizathion to google youtube access data",
)
async def authorize_google_access(current_user: User = Depends(get_current_user)):
    username = current_user.username
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file='client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json',
        scopes=youtube_scopes,
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

@services_router_youtube.get("/callback/google/youtube")
async def authorize_google_access_callback(request: Request):
    state = request.query_params.get("state")

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file='client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json',
        scopes=youtube_scopes,
        state=state
    )
    flow.redirect_uri = google_redirect_uri
    authorization_response = str(request.url)
    flow.fetch_token(authorization_response=authorization_response)
    credentials = credentials_to_dict(flow.credentials)
    user = await user_respository.get_by_username(state)
    auth_token = AuthToken(
        token=credentials['token'],
        refresh_token=credentials['refresh_token'],
        scopes=credentials["scopes"]
    )
    token = await user_respository.update_service_access_token(user.id, auth_token, "google_youtube_token")
    return token
