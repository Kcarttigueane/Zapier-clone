import requests
from datetime import datetime
from config.constants import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
from models.auth_token import AuthToken, is_expired
from models.user import User
from source.helpers import decrypt_token
from repository.user_repository import UserRepository, encrypt_token
import base64


async def spotify_refresh_token(user: User, force: bool = False) -> User:
    user_repository = UserRepository()
    spotify_token = user.token_manager.spotify_token

    if not is_expired(spotify_token) and not force:
        return user

    _, refresh_token = decrypt_token(spotify_token)

    headers = {
        "Authorization": "Basic "
        + base64.b64encode(
            (SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).encode()
        ).decode()
    }

    data = {"grant_type": "refresh_token", "refresh_token": refresh_token}

    response = requests.post(
        "https://accounts.spotify.com/api/token", headers=headers, data=data
    )

    if response.status_code == 200:
        response = response.json()
        print(response)
        auth_token = AuthToken(
            token=response["access_token"],
            refresh_token=refresh_token,
            scopes=[response["scope"]],
            expires_in=response["expires_in"],
        )
        await user_repository.update_service_access_token(
            user.id, auth_token, "spotify_token"
        )
        user_dict = user.dict().copy()
        auth_token.token = encrypt_token({"token": auth_token.token})
        auth_token.refresh_token = encrypt_token(
            {"refresh_token": auth_token.refresh_token}
        )
        user_dict["token_manager"]["spotify_token"] = auth_token.dict()
        return User(**user_dict)

    else:
        print("Error refreshing token:", response.status_code)
        print(response.text)
        return user
