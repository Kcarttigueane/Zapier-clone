from datetime import datetime
from typing import Any, Dict, Tuple

from fastapi import HTTPException, Request, status
from fastapi.responses import RedirectResponse

from app.core.oauth2 import PROVIDER_KEY_MAP, SERVICE_SCOPES, oauth2_providers
from app.main import WEB_CLIENT_URL
from app.repository.users_repository import UserRepository
from app.schemas.users_dto import UserInDTO, UserOAuthDTO, UserOutDTO, UserProfileDTO
from app.utils.auth_utils import (
    create_access_token,
    create_jwt_user_token,
    validate_user_info,
)
from app.utils.password_utils import (
    get_password_hash,
    verify_password,
    create_code_password_recovery,
    send_mail_forgot_password,
)


class AuthServices:
    def __init__(self):
        self.repository = UserRepository()

    def authenticate_with_provider(self, provider: str):
        oauth2_scheme = oauth2_providers.get(provider)
        if not oauth2_scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Provider {provider} not found",
            )

        redirect_uri = f"http://localhost:8080/api/v2/auth/login/{provider}/callback"

        uri, state = oauth2_scheme.create_authorization_url(redirect_uri)
        print("uri: ", uri)

        return RedirectResponse(uri)

    async def authenticate_with_provider_callback(
        self, provider: str, request: Request, code: str
    ):
        oauth2_scheme = oauth2_providers.get(provider)

        if not oauth2_scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Provider {provider} not found",
            )

        redirect_uri = f"http://localhost:8080/api/v2/auth/login/{provider}/callback"

        response = await oauth2_scheme.fetch_token(redirect_uri, code, str(request.url))

        user_info = await oauth2_scheme.get_user_info(response.get("access_token"))

        user = await self.update_or_create_user_by_provider(
            user_info, provider, response
        )

        jwt_token = create_access_token(data={"sub": user.email})

        frontend_url = f"{WEB_CLIENT_URL}/home?token={jwt_token}"
        return RedirectResponse(frontend_url)

    async def register_user_email_password(self, user_data: UserInDTO) -> UserOutDTO:
        existing_user = await self.repository.get_by_email(user_data.email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        if not user_data.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required",
            )

        user_data.password = get_password_hash(user_data.password)
        created_user = await self.repository.create(user_data)
        if created_user is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create user",
            )
        return create_jwt_user_token(created_user)

    async def authenticate_user_email(
        self, email: str, password: str
    ) -> Tuple[UserOutDTO, str]:
        user = await self.repository.get_by_email(email)

        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        return create_jwt_user_token(user)

    async def update_or_create_user_by_provider(
        self,
        user_info: Dict[str, Any],
        provider: str,
        response: dict,
        user_id: str | None = None,
        service_name: str | None = None,
    ) -> UserOutDTO:
        key_map = PROVIDER_KEY_MAP.get(provider)
        email, provider_user_id, access_token = await validate_user_info(
            user_info, provider, response
        )

        assert key_map is not None
        if key_map["given_name"] and key_map["family_name"]:
            first_name = user_info.get(key_map["given_name"])
            last_name = user_info.get(key_map["family_name"])
        else:
            name = user_info.get(key_map["given_name"] or "name", "")
            first_name, last_name = (name.split(" ", 1) + [""])[:2]

        if user_id:
            user = await self.repository.get(user_id)
        else:
            user = await self.repository.get_user_by_oauth_by_provider_user_id(
                provider, provider_user_id
            )

        oauth_data = UserOAuthDTO(
            provider=provider,
            provider_user_id=provider_user_id,
            access_token=access_token,
            refresh_token=response.get("refresh_token"),
            service_name=service_name or None,
        )

        if user is None:
            user_data = UserInDTO(
                email=email,
                password=None,
                recovery_code=None,
                profile=UserProfileDTO(
                    first_name=first_name,
                    last_name=last_name,
                    language="English",
                    theme="light",
                ),
                oauth=[oauth_data],
            )
            return await self.repository.create(user_data)
        else:
            if existing_oauth := next(
                (
                    o
                    for o in user.oauth
                    if o.provider == provider and o.service_name == service_name
                ),
                None,
            ):
                existing_oauth.access_token = oauth_data.access_token
                existing_oauth.refresh_token = oauth_data.refresh_token
                user.updated_at = datetime.now()
            else:
                user.oauth.append(oauth_data)

            return await self.repository.update(user_id=str(user.id), user=user)

    def authorize_additional_access(
        self, provider: str, service_name: str, current_user: UserOutDTO
    ):
        oauth2_scheme = oauth2_providers.get(provider)

        if not oauth2_scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Provider {self} not found",
            )

        redirect_uri = f"http://localhost:8080/api/v2/auth/authorize/callback/{provider}/{service_name}"

        uri = oauth2_scheme.create_authorization_url(
            redirect_uri,
            additional_scopes=SERVICE_SCOPES[service_name],
            state=current_user.id,
            access_type="offline",
        )
        print("uri: ", uri)

        return RedirectResponse(uri)

    async def authorize_additional_access_callback(
        self, provider: str, service_name: str, request: Request, code: str, state: str
    ):
        oauth2_scheme = oauth2_providers.get(provider)

        state = state.strip("',")

        if not oauth2_scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Provider {provider} not found",
            )

        redirect_uri = f"http://localhost:8080/api/v2/auth/authorize/callback/{provider}/{service_name}"

        response = await oauth2_scheme.fetch_token(redirect_uri, code, str(request.url))

        user_info = await oauth2_scheme.get_user_info(response.get("access_token"))

        user = await self.update_or_create_user_by_provider(
            user_info, provider, response, user_id=state, service_name=service_name
        )

        jwt_token = create_access_token(data={"sub": user.email})

        frontend_url = f"{WEB_CLIENT_URL}/home?token={jwt_token}"
        return RedirectResponse(frontend_url)

    async def forgot_password(self, email: str):
        user = await self.repository.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The user with this email does not exist in the system.",
            )
        code = create_code_password_recovery()
        await self.repository.update_user_recovery_code(str(user.id), code)
        send_mail_forgot_password(email, user.profile.first_name, code)
        return {"message": "Email send"}

    async def reset_password(self, email: str, code: str, new_password: str):
        user = await self.repository.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found",
            )
        if user.recovery_code != code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Code not valid",
            )
        await self.repository.update_user_password(str(user.id), new_password)
        return {"message": "Password updated"}
