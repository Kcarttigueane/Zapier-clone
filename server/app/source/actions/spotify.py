import json
import logging

import requests
from fastapi import status

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO
from app.source.helpers import get_service_auth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_user_id(access_token):
    url = "https://api.spotify.com/v1/me"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)

    if response.status_code == status.HTTP_200_OK:
        user_data = response.json()
        return user_data["id"]
    else:
        logger.info(f"Failed to get user data: {response.text}")
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

        if response.status_code == status.HTTP_201_CREATED:
            playlist_id = response.json()["id"]
            logger.info(f"Playlist '{playlist_name}' created with ID: {playlist_id}")
        else:
            logger.info(f"Failed to create playlist: {response.text}")
    return playlist_id


def get_existing_playlist_id(user_id, playlist_name, access_token):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)

    if response.status_code == status.HTTP_200_OK:
        playlists = response.json()["items"]
        for playlist in playlists:
            if playlist["name"] == playlist_name:
                return playlist["id"]
    return None


def get_tracks_playlist(playlist_id, access_token):
    playlist_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    response = requests.get(playlist_url, headers=headers)
    if response.status_code == status.HTTP_200_OK:
        playlist_data = response.json()
        return [track["track"]["uri"] for track in playlist_data["items"]]
    else:
        logger.info("Failed to retrieve the playlist's tracks.")


def get_track_uri(song_name, access_token):
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"q": song_name, "type": "track", "limit": 1}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        if data["tracks"]["items"]:
            return data["tracks"]["items"][0]["uri"]
    else:
        logger.info(f"Failed to get track URI for '{song_name}': {response.text}")
    return None


def get_spotify_auth_token(user: UserOutDTO) -> str | None:
    """Retrieve the Spotify authentication token for a user."""
    service_auth = get_service_auth(user, "spotify")
    return service_auth.access_token if service_auth else None


def add_tracks_to_playlist(playlist_id: str, track_uris: list[str], token: str) -> None:
    """Add tracks to a Spotify playlist."""
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    data = {"uris": track_uris}
    requests.post(url, headers=headers, data=json.dumps(data))


def handle_add_songs_to_playlist(token, objs):
    spotify_id = get_user_id(token)
    playlist_id = create_playlist(spotify_id, "Area", token)
    playlist_track_uris = get_tracks_playlist(playlist_id, token)
    track_uris = []

    for song_name in objs:
        track_uri = get_track_uri(song_name, token)
        if track_uri and track_uri not in playlist_track_uris:
            track_uris.append(track_uri)

    if track_uris != []:
        add_tracks_to_playlist(playlist_id, track_uris, token)


def add_songs_to_playlist(user: UserOutDTO, trigger_answer: TriggerAnswer):
    token = get_spotify_auth_token(user)
    if not token:
        return None

    objs = trigger_answer.objs

    try:
        handle_add_songs_to_playlist(token, objs)
    except Exception as e:
        logger.info(f"An error occurred: {e}")
