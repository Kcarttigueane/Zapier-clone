import httpx


def inspect_token(access_token):
    response = httpx.get(
        f"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={access_token}"
    )
    return response.json()


token_info = inspect_token("your_access_token")
print(token_info)
