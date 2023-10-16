from models.auth_token import AuthToken
from services.auth_service import decrypt_token
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client
from config.constants import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET


def get_google_credentials(auth_token: AuthToken):
    token, refresh_token = decrypt_token(auth_token)

    credentials = client.OAuth2Credentials(
        access_token=token,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        refresh_token=refresh_token,
        token_expiry=None,
        token_uri=GOOGLE_TOKEN_URI,
        user_agent=None,
        revoke_uri=GOOGLE_REVOKE_URI,
    )

    return credentials
