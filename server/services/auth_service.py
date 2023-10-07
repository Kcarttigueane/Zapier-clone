import logging
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import BaseModel
from models.user import User, UserCreate

from config.constants import ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from repository.user_repository import UserRepository
from models.auth_token import AuthToken

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None

def decrypt_token(token_obj: AuthToken) -> AuthToken:
    payload = jwt.decode(token_obj.token, SECRET_KEY, algorithms=[ALGORITHM])
    token = payload.get("token")
    payload = jwt.decode(token_obj.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    refresh_token = payload.get("refresh_token")
    return token, refresh_token

def encrypt_token(data: dict):
    return jwt.encode(data.copy(), SECRET_KEY, algorithm=ALGORITHM)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def check_access_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(f"Check access token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.PyJWTError as e:
        raise credentials_exception from e
    user = await UserRepository().get_by_email(token_data.email)
    if user:
        return True
    return False


async def get_current_user(token: str = Depends(oauth2_scheme)):
    logging.info(token)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(f"Check access token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.PyJWTError as e:
        raise credentials_exception from e
    user = await UserRepository().get_by_email(token_data.email)
    if user is None:
        raise credentials_exception
    return user


def raise_unauthorized_exception(detail="Unauthorized"):
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
    )

def create_user_token(user: User):
    access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return access_token