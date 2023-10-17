from datetime import datetime

import google_auth_oauthlib.flow
from fastapi import APIRouter, Depends, Request, Query
from starlette.responses import RedirectResponse

from models.auth_token import AuthToken
from models.automation import Action
from models.user import User
from repository.user_repository import UserRepository
from services.auth_service import get_current_user
from source.actions.google_youtube import check_youtube_like

services_router_google = APIRouter(prefix="/services", tags=["Services"])
google_redirect_uri = "http://localhost:8080/api/services/callback/google/"


google_scopes = {
    "calendar": [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.events.readonly",
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.settings.readonly",
        "https://www.googleapis.com/auth/calendar.addons.execute",
    ],
    "drive": [
        "https://www.googleapis.com/auth/drive",
    ],
    "gmail": [
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.send",
    ],
    "youtube": [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
}


user_repository = UserRepository()


@services_router_google.get(
    "/google/{service:path}",
    summary="Request autorizathion to google access data",
)
async def authorize_google_access(
    service: str, token: str = Query(..., description="Authorization token"),
):
    current_user = await get_current_user(token)
    redirect_uri = google_redirect_uri + service
    scopes = google_scopes[service]
    username = current_user.username

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file="client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json",
        scopes=scopes,
    )

    flow.redirect_uri = redirect_uri
    authorization_url, _ = flow.authorization_url(access_type="offline", state=username)

    return RedirectResponse(authorization_url)


def credentials_to_dict(credentials):
    return {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }


@services_router_google.get("/callback/google/{service:path}")
async def authorize_google_access_callback(service: str, request: Request):
    state = request.query_params.get("state")
    scope = google_scopes[service]
    redirect_uri = google_redirect_uri + service

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        client_secrets_file="client_secret_648065420240-uhj68ojuts1bro413agqblc1e7q8bc96.apps.googleusercontent.com.json",
        scopes=scope,
        state=state,
    )

    flow.redirect_uri = redirect_uri
    authorization_response = str(request.url)
    flow.fetch_token(authorization_response=authorization_response)
    credentials = credentials_to_dict(flow.credentials)

    user = await user_repository.get_by_username(state)

    auth_token = AuthToken(
        token=credentials["token"],
        refresh_token=credentials["refresh_token"],
        scopes=credentials["scopes"],
    )
    await user_repository.update_service_access_token(
        user.id, auth_token, f"google_{service}_token"
    )
    
    access_token = user.access_token

    frontend_redirect_url = (
                f"http://localhost:8081/home?token={access_token}"
            )
    return RedirectResponse(url=frontend_redirect_url)
