from models.user import User
from models.automation import ActionAnswer
from services.auth_service import decrypt_token
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client
from email.message import EmailMessage
import base64
from email.mime.text import MIMEText
import requests
import json

def get_user_id(access_token):
    url = "https://api.spotify.com/v1/me"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        return user_data["id"]
    else:
        print(f"Failed to get user data: {response.text}")
        return None
    

def create_playlist(user_id, playlist_name, access_token):
    playlist_id = get_existing_playlist_id(user_id, playlist_name, access_token)
    if not playlist_id:
        url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        data = {
            "name": playlist_name,
            "public": False
        }
        response = requests.post(url, headers=headers, data=json.dumps(data))

        if response.status_code == 201:
            playlist_id = response.json()["id"]
            print(f"Playlist '{playlist_name}' created with ID: {playlist_id}")
        else:
            print(f"Failed to create playlist: {response.text}")
    return playlist_id


def get_existing_playlist_id(user_id, playlist_name, access_token):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        playlists = response.json()["items"]
        for playlist in playlists:
            if playlist["name"] == playlist_name:
                return playlist["id"]
    return None

def add_songs_to_playlist(user: User, action_answer: ActionAnswer):
    objs = action_answer.objs
    spotify_access_token = user.token_manager.spotify_token
    token, refresh_token = decrypt_token(spotify_access_token)

    spotify_id = get_user_id(token)



