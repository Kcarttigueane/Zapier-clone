import logging

import motor
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import MONGODB_URL, TESTING

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataBase:
    client: AsyncIOMotorClient = None  # type: ignore


db = DataBase()


async def connect_to_mongo():
    logger.info("Connecting to database...")
    db.client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)


async def close_mongo_connection():
    logger.info("Closing connection to database...")
    db.client.close()  # type: ignore


def get_database():
    if db.client is None:
        raise Exception("Database client not initialized")
    if TESTING is True:
        return db.client.AREA_TESING
    else:
        return db.client.AREA
