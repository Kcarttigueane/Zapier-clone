import json

from fastapi import APIRouter, Response, Request

from app.repository.about_repository import AboutRepository

about_router = APIRouter(tags=["About"])


@about_router.get("/about.json", description="Retrieve about.json")
async def get_about_json(response: Response, resquest: Request):
    about = AboutRepository()
    ip = resquest.client.host
    about.create_json(ip)
    response.headers["Content-Type"] = "application/json"
    with open("app/about.json", "r") as outfile:
        data = json.load(outfile)
        return data
