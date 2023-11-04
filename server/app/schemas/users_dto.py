from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserProfileDTO(BaseModel):
    first_name: Optional[str] = Field(
        None, title="First Name", description="The first name of the user."
    )
    last_name: Optional[str] = Field(
        None, title="Last Name", description="The last name of the user."
    )
    profile_picture: Optional[str] = Field(
        None,
        title="Profile Picture",
        description="The profile picture encoded in base64",
    )
    language: str = Field(
        "English", title="Language", description="The preferred language of the user."
    )
    theme: str = Field(
        "light", title="Theme", description="The UI theme preference of the user."
    )

    class Config:
        schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "language": "English",
                "theme": "light",
            }
        }


class UserOAuthDTO(BaseModel):
    provider: str = Field(
        ...,
        title="Provider",
        description="The OAuth provider (e.g., Google, Facebook).",
    )
    provider_user_id: str = Field(
        ...,
        title="Provider User ID",
        description="The user ID according to the OAuth provider.",
    )
    service_name: str | None = Field(
        None,
        title="Service Name",
        description="The name of the service this OAuth data is associated \
        with (e.g., youtube, calendar).",
    )
    access_token: str = Field(
        ...,
        title="Access Token",
        description="The access token obtained from the OAuth provider.",
    )
    refresh_token: Optional[str] = Field(
        None,
        title="Refresh Token",
        description="The refresh token obtained from the OAuth provider (if provided).",
    )
    created_at: datetime = Field(
        default=datetime.now(),
        title="Creation Date",
        description="The date and time when the OAuth data was created.",
    )
    updated_at: datetime = Field(
        default=datetime.now(),
        title="Update Date",
        description="The date and time when the OAuth data was last updated.",
    )

    class Config:
        model_json_schema = {
            "example": {
                "provider": "Google",
                "provider_user_id": "provideruserid",
                "created_at": "2023-09-25T18:44:52Z",
                "updated_at": "2023-09-25T18:44:52Z",
            }
        }


class UserInDTO(MongoModel):
    email: EmailStr = Field(
        ..., title="Email", description="The email address of the user."
    )
    password: str | None = Field(
        None,
        title="Password",
        description="The password of the user. This field is write-only.",
    )
    recovery_code: str | None = Field(
        None,
        title="Recovery Code",
        description="The recovery code of the user. For reset password",
    )
    status: str = Field(
        default="active",
        title="Status",
        description="Account status of the user(e.g., active, inactive, suspended).",
    )
    role: UserRole = Field(
        default=UserRole.USER,
        title="Role",
        description="The role of the user (e.g., user, admin).",
    )
    email_verified: bool = Field(
        default=False,
        title="Email Verified",
        description="Indicator if the user's email is verified.",
    )
    profile: UserProfileDTO = Field(
        ...,
        title="Profile",
        description="The user's profile containing personal information.",
    )
    oauth: List[UserOAuthDTO] = Field(
        default=[],
        title="OAuth Data",
        description="A list of OAuth data associated with the user.",
    )
    created_at: datetime = Field(
        default=datetime.now(),
        title="Creation Date",
        description="The date and time when the user account was created.",
    )
    updated_at: datetime = Field(
        default=datetime.now(),
        title="Update Date",
        description="The date and time when the user account was last updated.",
    )

    class Config:
        model_json_schema = {
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "email": "john.doe@example.com",
                "password": "password",
                "recovery_code": "code",
                "status": "active",
                "email_verified": True,
                "profile": {
                    "first_name": "John",
                    "last_name": "Doe",
                    "language": "English",
                    "theme": "dark",
                },
                "oauth": [
                    {
                        "provider": "Google",
                        "provider_user_id": "provideruserid",
                        "created_at": "2023-09-25T18:44:52Z",
                        "updated_at": "2023-09-25T18:44:52Z",
                    }
                ],
                "created_at": "2023-09-25T18:44:52Z",
                "updated_at": "2023-09-25T18:44:52Z",
            }
        }


class UserOutDTO(UserInDTO):
    id: PyObjectId = Field(
        ..., title="User ID", description="The unique identifier of the user."
    )


class UserOutDTOWithoutOAuth(UserOutDTO):
    oauth: List[UserOAuthDTO] = []
