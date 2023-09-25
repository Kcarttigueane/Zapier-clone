from datetime import timedelta
import os

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_sso.sso.github import GithubSSO

from config.constants import ACCESS_TOKEN_EXPIRE_MINUTES, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, OAUTHLIB_INSECURE_TRANSPORT
from models.user import User, UserCreate
from repository.user_repository import UserRepository
from services.auth_service import Token, create_access_token

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

repository = UserRepository()

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = OAUTHLIB_INSECURE_TRANSPORT

sso = GithubSSO(
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    redirect_uri="http://localhost:8080/api/auth/callback/github",
    allow_insecure_http=True,
)


@auth_router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await repository.authenticate_user(form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.post("/register", response_model=User)
async def register(user: UserCreate):
    existing_user = await repository.get_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return await repository.create(user)

@auth_router.get("/github")
async def auth_init():
    with sso:
        return await sso.get_login_redirect()

@auth_router.get("/callback/github")
async def auth_callback(request: Request):
    with sso:
        user = await sso.verify_and_process(request)
        return user