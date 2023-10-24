from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jwt import PyJWTError
from pydantic import BaseModel

from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from app.repository.users_repository import UserRepository
from app.schemas.users_dto import UserInDTO, UserOutDTO, UserRole
from app.services.auth_service import PROVIDER_KEY_MAP

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v2/auth/token")


class Token(BaseModel):
    accessToken: str
    tokenType: str


class TokenData(BaseModel):
    email: str | None = None


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode["exp"] = expire
    if SECRET_KEY and ALGORITHM:
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        assert SECRET_KEY is not None and ALGORITHM is not None
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        ) from e
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


async def get_user_from_token(token: str) -> UserOutDTO:
    payload = decode_token(token)
    email: Optional[str] = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = await UserRepository().get_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserOutDTO:
    return await get_user_from_token(token)


async def get_current_admin(user: UserOutDTO = Depends(get_current_user)) -> UserOutDTO:
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    return user


def create_jwt_user_token(user: UserInDTO):
    if ACCESS_TOKEN_EXPIRE_MINUTES:
        access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))

    return create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )


async def check_access_token(token: str = Depends(oauth2_scheme)) -> bool:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except PyJWTError as e:
        raise credentials_exception from e

    user = await UserRepository().get_by_email(email)
    return bool(user)


async def check_admin_access_token(token: str = Depends(oauth2_scheme)) -> bool:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise credentials_exception
    except PyJWTError as e:
        raise credentials_exception from e

    user = await UserRepository().get_by_email(email)
    if user is None or user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    return True


async def validate_user_info(user_info, provider, response):
    key_map = PROVIDER_KEY_MAP.get(provider)
    if not key_map:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown provider: {provider}",
        )

    email = user_info.get(key_map.get("email"))
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by provider",
        )

    provider_user_id = user_info.get(key_map.get("id"))
    if provider_user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provider user ID not provided by provider",
        )

    access_token = response.get("access_token")
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Access token not provided by provider",
        )

    return email, provider_user_id, access_token
