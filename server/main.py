from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import close_mongo_connection, connect_to_mongo
from routers.auth import auth_router
from routers.user import users_router
from routers.services_spotify import services_router_spotify
from routers.services_google import services_router_google
from config.constants import CLIENT_URL
from routers.services_discord import services_router_discord
from routers.automations import automation_router
from source.automation import get_automations
import threading
import asyncio

app = FastAPI()

origins = [
    CLIENT_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def start_continuous_async_task():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(get_automations())

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    task_thread = threading.Thread(target=start_continuous_async_task)
    task_thread.daemon = True
    task_thread.start()




@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


@app.get("/")
async def root():
    return {"message": "Hello World!"}


app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(services_router_spotify, prefix="/api")
app.include_router(services_router_google, prefix="/api")
app.include_router(services_router_discord, prefix="/api")
app.include_router(automation_router, prefix="/api")
