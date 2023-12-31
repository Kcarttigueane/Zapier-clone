from typing import Dict, Optional

import httpx
from authlib.integrations.httpx_client import AsyncOAuth2Client  # type: ignore
from fastapi.security import OAuth2AuthorizationCodeBearer

from app.core.config import (
    AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET,
    AZURE_TENANT_ID,
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_ID_MOBILE,
    GITHUB_CLIENT_SECRET,
    GITHUB_CLIENT_SECRET_MOBILE,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
)


class OAuth2Provider(OAuth2AuthorizationCodeBearer):
    def __init__(
        self,
        client_id,
        client_secret,
        authorization_url,
        token_url,
        user_info_url,
        scope,
    ):
        self.authorization_url = authorization_url
        self.token_url = token_url
        self.user_info_url = user_info_url
        self.scope = scope
        super().__init__(tokenUrl=token_url, authorizationUrl=authorization_url)
        self.client = AsyncOAuth2Client(
            client_id=client_id, client_secret=client_secret
        )

    async def fetch_token(self, redirect_uri, code, authorization_response):
        return await self.client.fetch_token(
            url=self.token_url,
            authorization_response=authorization_response,
            redirect_uri=redirect_uri,
            code=code,
            grant_type="authorization_code",
        )

    async def get_user_info(self, access_token):
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                self.user_info_url, headers={"Authorization": f"Bearer {access_token}"}
            )
            return resp.json()

    def create_authorization_url(
        self, redirect_uri, state=None, additional_scopes=None, access_type=None
    ):
        scopes = self.scope
        if additional_scopes:
            scopes = f"{scopes} {' '.join(additional_scopes)}"
        return self.client.create_authorization_url(
            self.authorization_url,
            access_type=access_type,
            redirect_uri=redirect_uri,
            scope=scopes,
            state=str(state),
        )


OAUTH2_PROVIDERS = {
    "google": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "authorization_url": "https://accounts.google.com/o/oauth2/auth",
        "token_url": "https://oauth2.googleapis.com/token",
        "user_info_url": "https://www.googleapis.com/oauth2/v3/userinfo",
        "scope": "openid email profile",
    },
    "spotify": {
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
        "authorization_url": "https://accounts.spotify.com/authorize",
        "token_url": "https://accounts.spotify.com/api/token",
        "user_info_url": "https://api.spotify.com/v1/me",
        "scope": "user-read-email playlist-modify-public playlist-modify-private",
    },
    "github": {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "authorization_url": "https://github.com/login/oauth/authorize",
        "token_url": "https://github.com/login/oauth/access_token",
        "user_info_url": "https://api.github.com/user",
        "scope": "user:email",
    },
    "google_mobile": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "authorization_url": "https://accounts.google.com/o/oauth2/auth",
        "token_url": "https://oauth2.googleapis.com/token",
        "user_info_url": "https://www.googleapis.com/oauth2/v3/userinfo",
        "scope": "openid email profile",
    },
    "spotify_mobile": {
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
        "authorization_url": "https://accounts.spotify.com/authorize",
        "token_url": "https://accounts.spotify.com/api/token",
        "user_info_url": "https://api.spotify.com/v1/me",
        "scope": "user-read-email playlist-modify-public playlist-modify-private",
    },
    "github_mobile": {
        "client_id": GITHUB_CLIENT_ID_MOBILE,
        "client_secret": GITHUB_CLIENT_SECRET_MOBILE,
        "authorization_url": "https://github.com/login/oauth/authorize",
        "token_url": "https://github.com/login/oauth/access_token",
        "user_info_url": "https://api.github.com/user",
        "scope": "user:email",
    },
    "discord": {
        "client_id": DISCORD_CLIENT_ID,
        "client_secret": DISCORD_CLIENT_SECRET,
        "authorization_url": "https://discord.com/api/oauth2/authorize",
        "token_url": "https://discord.com/api/oauth2/token",
        "user_info_url": "https://discord.com/api/users/@me",
        "scope": "identify email",
    },
    "microsoft": {
        "client_id": AZURE_CLIENT_ID,
        "client_secret": AZURE_CLIENT_SECRET,
        "authorization_url": f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize",
        "token_url": f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token",
        "user_info_url": "https://graph.microsoft.com/v1.0/me",
        "scope": "offline_access User.Read Mail.Read Chat.ReadWrite Chat.Read Chat.ReadBasic Calendars.Read Calendars.ReadWrite",
    },
    "microsoft_mobile": {
        "client_id": AZURE_CLIENT_ID,
        "client_secret": AZURE_CLIENT_SECRET,
        "authorization_url": f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/authorize",
        "token_url": f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/oauth2/v2.0/token",
        "user_info_url": "https://graph.microsoft.com/v1.0/me",
        "scope": "offline_access User.Read Mail.Read Chat.ReadWrite Chat.Read Chat.ReadBasic Calendars.Read Calendars.ReadWrite",
    },
}

oauth2_providers = {
    key: OAuth2Provider(**value) for key, value in OAUTH2_PROVIDERS.items()
}


SERVICE_SCOPES = {
    "calendar": [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar.events.readonly",
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.settings.readonly",
        "https://www.googleapis.com/auth/calendar.addons.execute",
    ],
    "drive": [
        "https://www.googleapis.com/auth/drive",
    ],
    "gmail": [
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.send",
    ],
    "youtube": [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
    "spotify": [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "user-library-read",
    ],
    "discord": [
        "identify",
    ],
    "teams": None,
}

ProviderKeyMapType = Dict[str, Dict[str, Optional[str]]]

PROVIDER_KEY_MAP: ProviderKeyMapType = {
    "google": {
        "email": "email",
        "given_name": "given_name",
        "family_name": "family_name",
        "id": "sub",
    },
    "github": {"email": "email", "given_name": "name", "family_name": None, "id": "id"},
    "spotify": {
        "email": "email",
        "given_name": "display_name",
        "family_name": None,
        "id": "id",
    },
    "discord": {
        "email": "email",
        "given_name": "username",
        "family_name": None,
        "id": "id",
    },
    "microsoft": {
        "email": "mail",
        "given_name": "display_name",
        "family_name": "surname",
        "id": "id",
    },
}
