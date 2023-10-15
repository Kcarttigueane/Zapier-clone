from models.user import User
from models.automation import ActionAnswer
from services.auth_service import decrypt_token
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from oauth2client import GOOGLE_REVOKE_URI, GOOGLE_TOKEN_URI, client
from email.message import EmailMessage
import base64
from email.mime.text import MIMEText
import json
import requests
import discord
from discord.ext import commands
from config.constants import DISCORD_BOT_TOKEN
import asyncio


def get_user_id(access_token):
    url = "https://discord.com/api/v10/users/@me"

    headers = {"Authorization": f"Bearer {access_token}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        user_id = user_data["id"]
        return user_id
    else:
        print(
            f"Failed to retrieve user information. Status code: {response.status_code}"
        )
        return None


async def send_message_to_user(user: User, action_answer: ActionAnswer):
    body = action_answer.body
    discord_access_token = user.token_manager.discord_token
    token, _ = decrypt_token(discord_access_token)

    discord_id = get_user_id(token)

    if discord_id:
        intents = discord.Intents.default()
        intents.typing = False
        intents.presences = False

        bot = commands.Bot(command_prefix="!", intents=intents)

        async def my_task():
            user = await bot.fetch_user(discord_id)

            if user:
                user_guilds = user.mutual_guilds
                for guild in user_guilds:
                    member = guild.get_member(user.id)
                    if member:
                        for channel in guild.text_channels:
                            if channel.permissions_for(member).read_messages:
                                await channel.send(body)
            else:
                print("Discord User not found.")

        @bot.event
        async def on_ready():
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, my_task)
            bot.close()

        bot.run(token=DISCORD_BOT_TOKEN)
