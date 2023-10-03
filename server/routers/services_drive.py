from fastapi import APIRouter, Depends, status, HTTPException, Request
from models.user import User
from models.auth_token import AuthToken
from services.auth_service import get_current_user, check_access_token, raise_unauthorized_exception
from config.constants import ACCESS_TOKEN_EXPIRE_MINUTES,\
    GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTHLIB_INSECURE_TRANSPORT,\
    SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from starlette.responses import RedirectResponse
from urllib.parse import urlparse, parse_qs
from repository.user_repository import UserRepository
from source.actions.google_drive import check_latests_file


import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery


services_router_drive = APIRouter(prefix="/services", tags=["Services"])
google_redirect_uri = 'http://localhost:8080/api/services/callback/google/drive'

drive_scopes = [
    "https://www.googleapis.com/auth/drive",
]

user_respository = UserRepository()


@services_router_drive.get(
    "/google/drive",
    summary="Request autorizathion to google drive access data",
)
async def authorize_google_access(current_user: User = Depends(get_current_user)):
    username = current_user.username
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file='client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json',
        scopes=drive_scopes,
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

@services_router_drive.get("/callback/google/drive")
async def authorize_google_access_callback(request: Request):
    state = request.query_params.get("state")

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file='client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json',
        scopes=drive_scopes,
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
    token = await user_respository.update_service_access_token(user.id, auth_token, "google_drive_token")
    return token
