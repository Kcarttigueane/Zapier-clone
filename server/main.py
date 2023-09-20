from fastapi import FastAPI
from config.database import close_mongo_connection, connect_to_mongo
from routers.auth import auth_router

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()



@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(auth_router, prefix="/api")