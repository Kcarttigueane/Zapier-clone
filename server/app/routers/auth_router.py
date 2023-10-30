from typing import Dict

from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.users_dto import UserInDTO
from app.services.auth_service import AuthServices
from app.utils.auth_utils import Token, get_current_user

auth_router: APIRouter = APIRouter(prefix="/auth", tags=["Auth"])


AuthService = AuthServices()


@auth_router.get("/login/{provider}", description="Login with OAuth2 provider")
async def authenticate_with_provider(provider: str):
    return AuthService.authenticate_with_provider(provider, False)


@auth_router.get(
    "/login/mobile/{provider}", description="Login with OAuth2 provider for mobile"
)
async def authenticate_with_provider_mobile(provider: str):
    return AuthService.authenticate_with_provider(provider, True)


@auth_router.get("/login/{provider}/callback", description="Login with OAuth2 provider")
async def authenticate_with_provider_callback(
    provider: str, request: Request, code: str
):
    return await AuthService.authenticate_with_provider_callback(
        provider, request, code, False
    )


@auth_router.get(
    "/login/mobile/{provider}/callback",
    description="Login with OAuth2 provider for mobile",
)
async def authenticate_with_provider_callback_mobile(
    provider: str, request: Request, code: str
):
    return await AuthService.authenticate_with_provider_callback(
        provider, request, code, True
    )


@auth_router.post(
    "/token",
    description="Get access token",
    status_code=status.HTTP_200_OK,
    response_model=Token,
)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    jwt_token = await AuthService.authenticate_user_email(
        form_data.username, form_data.password
    )
    return {"accessToken": jwt_token, "tokenType": "bearer"}


@auth_router.post(
    "/register",
    response_model=Dict[str, str],
    status_code=status.HTTP_201_CREATED,
    description="Create new user",
)
async def register_user(user: UserInDTO):
    jwt = await AuthService.register_user_email_password(user)
    return {"accessToken": jwt, "tokenType": "bearer"}


@auth_router.get(
    "/authorize/{provider}/{service_name}",
    description="Authorize with OAuth2 provider",
)
async def authorize_additional_access(
    provider: str, service_name: str, current_user=Depends(get_current_user)
):
    return AuthService.authorize_additional_access(provider, service_name, current_user)


@auth_router.get(
    "/authorize/callback/{provider}/{service_name}",
    description="Authorize with OAuth2 provider",
)
async def authorize_additional_access_callback(
    provider: str, service_name: str, request: Request, code: str, state: str
):
    return await AuthService.authorize_additional_access_callback(
        provider, service_name, request, code, state
    )


@auth_router.post("/forgot-password", description="Forgot password")
async def forgot_password(email: str):
    return await AuthService.forgot_password(email)


@auth_router.post("/reset-password", description="Reset password")
async def reset_password(email: str, code: str, new_password: str):
    return await AuthService.reset_password(email, code, new_password)
