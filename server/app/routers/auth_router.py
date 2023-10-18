from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.users_dto import UserInDTO, UserOutDTO
from app.services.auth_service import AuthServices
from app.utils.auth_utils import Token, get_current_user

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


AuthService = AuthServices()

# Methods:
# Login with OAuth2 provider (GET) - /api/v2/auth/login/{provider} ✅
# Login with OAuth2 provider callback (GET) - /api/v2/auth/login/{provider}/callback ✅
# Register a new user (POST) email password - /api/v2/auth/register ✅
# Login a user (POST) email password - /api/v2/auth/token ✅
# Authorize access (GET) - /api/v2/auth/authorize/{provider}/{service_name} ✅
# Authorize access (GET) - /api/v2/auth/authorize/{provider}/{service_name} ✅


@auth_router.get("/login/{provider}", description="Login with OAuth2 provider")
async def authenticate_with_provider(provider: str):
    return AuthService.authenticate_with_provider(provider)


@auth_router.get("/login/{provider}/callback", description="Login with OAuth2 provider")
async def authenticate_with_provider_callback(
    provider: str, request: Request, code: str
):
    return await AuthService.authenticate_with_provider_callback(
        provider, request, code
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
    return {"access_token": jwt_token, "token_type": "bearer"}


@auth_router.post(
    "/register",
    response_model=UserOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create new user",
)
async def register_user(user: UserInDTO):
    jwt = await AuthService.register_user_email_password(user)
    return {"access_token": jwt, "token_type": "bearer"}


@auth_router.get(
    "/authorize/{provider}/{service_name}",
    description="Login with OAuth2 provider",
)
async def authorize_additional_access(
    provider: str, service_name: str, current_user=Depends(get_current_user)
):
    return AuthService.authorize_additional_access(provider, service_name, current_user)


@auth_router.get(
    "/authorize/callback/{provider}/{service_name}",
    description="Login with OAuth2 provider",
)
async def authorize_additional_access_callback(
    provider: str, service_name: str, request: Request, code: str, state: str
):
    return await AuthService.authorize_additional_access_callback(
        provider, service_name, request, code, state
    )
