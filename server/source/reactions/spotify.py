from models.user import User
from models.automation import ActionAnswer
from services.auth_service import decrypt_token
from source.refresh_token import spotify_refresh_token
import requests
import json

import requests

from models.automation import ActionAnswer
from models.user import User
from services.auth_service import decrypt_token


def get_user_id(access_token):
    url = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {access_token}"}
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
            "Content-Type": "application/json",
        }
        data = {"name": playlist_name, "public": False}
        response = requests.post(url, headers=headers, data=json.dumps(data))

        if response.status_code == 201:
            playlist_id = response.json()["id"]
            print(f"Playlist '{playlist_name}' created with ID: {playlist_id}")
        else:
            print(f"Failed to create playlist: {response.text}")
    return playlist_id


def get_existing_playlist_id(user_id, playlist_name, access_token):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        playlists = response.json()["items"]
        for playlist in playlists:
            if playlist["name"] == playlist_name:
                return playlist["id"]
    return None


def get_track_uri(song_name, access_token):
    url = f"https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"q": song_name, "type": "track", "limit": 1}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        data = response.json()
        if data["tracks"]["items"]:
            return data["tracks"]["items"][0]["uri"]
    else:
        print(f"Failed to get track URI for '{song_name}': {response.text}")
    return None


async def add_songs_to_playlist(user: User, action_answer: ActionAnswer):
    objs = action_answer.objs
    user = await spotify_refresh_token(user)
    spotify_access_token = user.token_manager.spotify_token
    token, _ = decrypt_token(spotify_access_token)

    spotify_id = get_user_id(token)
    playlist_id = create_playlist(spotify_id, "Area", token)
    track_uris = []

    for song_name in objs:
        track_uri = get_track_uri(song_name, token)
        if track_uri:
            track_uris.append(track_uri)

    if track_uris != []:
        url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        data = {"uris": track_uris}
        response = requests.post(url, headers=headers, data=json.dumps(data))

        if response.status_code == 201:
            print("Tracks added to the playlist successfully.")
        else:
            print(f"Failed to add tracks to the playlist: {response.text}")
