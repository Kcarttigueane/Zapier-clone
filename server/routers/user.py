from typing import List

from fastapi import APIRouter, Depends, status, HTTPException

from models.py_object_id import PyObjectId
from models.user import User, UserCreate
from services.auth_service import get_current_user, check_access_token, raise_unauthorized_exception
from services.user_service import UserService

users_router = APIRouter(prefix="/users", tags=["User"])

service = UserService()


@users_router.get(
    "/me",
    response_model=User,
    status_code=status.HTTP_200_OK,
    summary="Get the current user's details",
)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@users_router.post(
    "/",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
)
async def create_user(
    user: UserCreate,
    is_authorized: bool = Depends(check_access_token)
):
    if not is_authorized:
        raise_unauthorized_exception()
    return await service.create_user(user)


@users_router.get(
    "/",
    response_model=List[User],
    status_code=status.HTTP_200_OK,
    summary="List all users",
)
async def list_users(
    is_authorized: bool = Depends(check_access_token)
):
    if not is_authorized:
        raise_unauthorized_exception()
    return await service.get_users()


@users_router.get(
    "/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
    summary="Get a single user",
)
async def get_user(
    user_id: PyObjectId,
    is_authorized: bool = Depends(check_access_token)
):
    if not is_authorized:
        raise_unauthorized_exception()
    return await service.get_user(user_id)


@users_router.put(
    "/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
    summary="Update a user",
)
async def update_user(
    user_id: PyObjectId,
    user: UserCreate,
    is_authorized: bool = Depends(check_access_token)
):
    if not is_authorized:
        raise_unauthorized_exception()
    return await service.update_user(user_id, user)


@users_router.delete(
    "/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
    summary="Delete a user",
)
async def delete_user(
    user_id: PyObjectId,
    is_authorized: bool = Depends(check_access_token)
):
    if not is_authorized:
        raise_unauthorized_exception()
    return await service.delete_user(user_id)