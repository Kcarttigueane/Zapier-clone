from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import WEB_CLIENT_URL
from app.core.database import close_mongo_connection, connect_to_mongo
from app.routers.actions_router import actions_router
from app.routers.auth_router import auth_router
from app.routers.automations_router import automations_router
from app.routers.compatibility_router import compatibility_router
from app.routers.services_router import services_router
from app.routers.triggers_router import triggers_router
from app.routers.user_router import user_router
<<<<<<< HEAD
from app.source.automation import run_automations
import asyncio
=======
from app.routers.about_router import about_router
>>>>>>> feat/server/implement-api-v2

app = FastAPI(
    title="AREA - API - V2",
    description="API for AREA",
    version="2.0.0",
    docs="/swagger",
    debug=True,
)


origins = WEB_CLIENT_URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    asyncio.create_task(run_automations())


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


app.include_router(auth_router, prefix="/api/v2")
app.include_router(automations_router, prefix="/api/v2")
app.include_router(services_router, prefix="/api/v2")
app.include_router(actions_router, prefix="/api/v2")
app.include_router(triggers_router, prefix="/api/v2")
app.include_router(user_router, prefix="/api/v2")
app.include_router(about_router, prefix="/api/v2")
app.include_router(compatibility_router, prefix="/api/v2")


@app.get("/")
def read_root():
    return {"message": f"Welcome to AREA API {app.version}"}
