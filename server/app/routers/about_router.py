import json

from fastapi import APIRouter, HTTPException, Request, Response, status

from app.services.about_service import AboutService

about_router = APIRouter(tags=["About"])


@about_router.get("/about.json", description="Retrieve about.json")
async def get_about_json(response: Response, request: Request):
    about = AboutService()

    if request.client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        )

    ip = request.client.host
    about.create_json(ip)
    with open("about.json", "r") as outfile:
        return json.load(outfile)
