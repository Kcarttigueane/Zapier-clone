import logging
from datetime import datetime

import requests
from fastapi import status

from app.schemas.triggers_dto import TriggerAnswer
from app.schemas.users_dto import UserOutDTO

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def extract_todays_weather(user: UserOutDTO, data):
    temperatures = data["temperature_2m"]
    min_temp = min(temperatures)
    max_temp = max(temperatures)
    avg_temp = sum(temperatures) / len(temperatures)
    content = f"""
        Hi {user.profile.first_name} {user.profile.last_name},

        Today's Weather:
        - Min Temp: {min_temp}°C
        - Max Temp: {max_temp}°C
        - Avg Temp: {avg_temp}°C

        Plan your day accordingly. Enjoy!

        Best,
        [Your App Name]
    """
    return TriggerAnswer(header="[AREA] Today's Weather Update", body=content)


def check_todays_weather(
    user: UserOutDTO, last_polled: datetime
) -> TriggerAnswer | None:
    if last_polled.day == datetime.utcnow().day:
        return None

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": 45.764,
        "longitude": 4.8357,
        "hourly": "temperature_2m",
        "timezone": "Europe/London",
        "forecast_days": 1,
    }

    response = requests.get(url, params=params)  # type: ignore

    if response.status_code != status.HTTP_200_OK:
        return None

    data = response.json()
    return extract_todays_weather(user, data)
