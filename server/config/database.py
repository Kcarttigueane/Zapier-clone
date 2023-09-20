import motor
from motor.motor_asyncio import AsyncIOMotorClient

from config.constants import MONGODB_URL


class DataBase:
    client: AsyncIOMotorClient = None


db = DataBase()


async def connect_to_mongo():
    print("Connecting to database...")
    db.client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)


async def close_mongo_connection():
    print("Closing connection to database...")
    db.client.close()


def get_database():
    if db.client is None:
        raise Exception("Database client not initialized")
    return db.client.area
