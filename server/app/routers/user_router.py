from typing import Annotated, List

from fastapi import APIRouter, Depends, Response, status

from app.schemas.users_dto import UserInDTO, UserOutDTO, UserOutDTOWithoutOAuth
from app.services.users_services import UserService
from app.utils.auth_utils import get_current_user

user_router: APIRouter = APIRouter(prefix="/users", tags=["User"])

UserServices = UserService()


@user_router.post(
    "/",
    response_model=UserOutDTO,
    status_code=status.HTTP_201_CREATED,
    description="Create a user",
)
async def create_user(user_data: UserInDTO):
    """Create a new user."""
    return await UserServices.create_user(user_data)


@user_router.get(
    "/",
    response_model=List[UserOutDTO],
    description="Retrieve all users",
)
async def get_users():
    """Retrieve all existing users."""
    return await UserServices.get_all_users()


@user_router.get(
    "/me",
    response_model=UserOutDTOWithoutOAuth,
    description="Retrieve current user",
    status_code=status.HTTP_200_OK,
)
async def read_users_me(current_user: Annotated[UserOutDTO, Depends(get_current_user)]):
    """Retrieve the current user."""
    current_user.oauth = []
    return current_user


@user_router.get(
    "/{user_id}",
    response_model=UserOutDTO,
    status_code=status.HTTP_200_OK,
    description="Retrieve a user by ID",
)
async def get_user(user_id: str):
    """Retrieve an existing user by its ID."""
    return await UserServices.get_user(user_id)


@user_router.patch(
    "/{user_id}",
    response_model=UserOutDTO,
    status_code=status.HTTP_200_OK,
    description="Update a user by ID",
)
async def update_user(user_id: str, user: UserInDTO):
    """Update an existing user by its ID."""
    return await UserServices.update_user(user_id, user)


@user_router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    description="Delete a user by ID",
)
async def delete_user(user_id: str):
    """Delete an existing user by its ID."""
    return await UserServices.delete_user(user_id)
