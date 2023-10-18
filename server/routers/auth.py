import os

from config.constants import (
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    OAUTHLIB_INSECURE_TRANSPORT,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
)
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_sso.sso.github import GithubSSO
from fastapi_sso.sso.google import GoogleSSO
from fastapi_sso.sso.spotify import SpotifySSO
from models.user import User, UserCreate
from repository.user_repository import UserRepository
from services.auth_service import create_user_token

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

repository = UserRepository()

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = OAUTHLIB_INSECURE_TRANSPORT

sso = GithubSSO(
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    redirect_uri="http://localhost:8080/api/auth/callback/github",
    allow_insecure_http=True,
)

spotify_sso = SpotifySSO(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri="http://localhost:8080/api/auth/callback/spotify",
    allow_insecure_http=True,
)

google_sso = GoogleSSO(
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    redirect_uri="http://localhost:8080/api/auth/callback/google",
    allow_insecure_http=True,
)


@auth_router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await repository.authenticate_user(form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": create_user_token(user)}


@auth_router.post("/register", response_model=User)
async def register(user: UserCreate):
    existing_user = await repository.get_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return await repository.create(user)


@auth_router.get("/google")
async def auth_init():
    try:
        with google_sso:
            return await google_sso.get_login_redirect()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="An error occurred while initial"
        ) from e


@auth_router.get("/callback/google")
async def auth_callback(request: Request):
    with google_sso:
        code = request.query_params.get("code")
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing 'code' parameter in the callback URL.",
            )
        id = code
        google_user = await google_sso.verify_and_process(request)
        email = google_user.email
        username = google_user.display_name
        user_create = UserCreate(
            username=username,
            email=email,
            google_id=id,
        )
        existing_user = await repository.get_by_username(username)
        if existing_user:
            access_token = create_user_token(existing_user)
            await repository.update_access_token(existing_user.id, access_token)
            frontend_redirect_url = (
                f"http://localhost:8081/home?token={access_token}"
            )
            frontend_redirect_url = f"http://localhost:8081/home?token={access_token}"
            return RedirectResponse(url=frontend_redirect_url)

        new_user = await repository.create(user_create)

        access_token = create_user_token(new_user)
        await repository.update_access_token(new_user.id, access_token)
        frontend_redirect_url = f"http://localhost:8081/home?token={access_token}"
        return RedirectResponse(url=frontend_redirect_url)


@auth_router.get("/github")
async def github_auth_init():
    with sso:
        return await sso.get_login_redirect()


@auth_router.get("/callback/github")
async def github_auth_callback(request: Request):
    with sso:
        code = request.query_params.get("code")
        if not code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing 'code' parameter in the callback URL.",
            )

        github_user = await sso.verify_and_process(request)

        user_create = UserCreate(
            username=github_user.id,
            email=github_user.email,
            github_id=github_user.display_name,
        )

        existing_user = await repository.get_by_github_id(github_user.id)
        if existing_user:
            access_token = create_user_token(existing_user)
            await repository.update_access_token(existing_user.id, access_token)
            frontend_redirect_url = (
                f"http://localhost:8081/home?token={access_token}"
            )
            frontend_redirect_url = f"http://localhost:8081/home?token={access_token}"
            return RedirectResponse(url=frontend_redirect_url)

        new_user = await repository.create(user_create)

        access_token = create_user_token(new_user)
        await repository.update_access_token(new_user.id, access_token)
        frontend_redirect_url = f"http://localhost:8081/home?token={access_token}"
        return RedirectResponse(url=frontend_redirect_url)


@auth_router.get("/spotify")
async def spotify_auth_init():
    with spotify_sso:
        return await spotify_sso.get_login_redirect()


@auth_router.get("/callback/spotify")
async def spotify_auth_callback(request: Request):
    with spotify_sso:
        spotify_user = await spotify_sso.verify_and_process(request)

        user_create = UserCreate(
            username=spotify_user.display_name,
            email=spotify_user.email,
            spotify_id=spotify_user.id,
        )

        existing_user = await repository.get_by_spotify_id(spotify_user.id)
        if existing_user:
            access_token = create_user_token(existing_user)
            await repository.update_access_token(existing_user.id, access_token)
            frontend_redirect_url = (
                f"http://localhost:8081/home?token={access_token}"
            )
            frontend_redirect_url = f"http://localhost:8081/home?token={access_token}"
            return RedirectResponse(url=frontend_redirect_url)

        new_user = await repository.create(user_create)

        access_token = create_user_token(new_user)
        await repository.update_access_token(new_user.id, access_token)
        frontend_redirect_url = f"http://localhost:8081/home?token={access_token}"
        return RedirectResponse(url=frontend_redirect_url)
