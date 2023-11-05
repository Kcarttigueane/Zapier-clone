from fastapi import APIRouter, Request

from app.services.about_service import AboutService

about_router = APIRouter(tags=["About"])


@about_router.get("/about.json", description="Retrieve about.json")
async def get_about_json(
    request: Request,
):
    return await AboutService().generate_about_json(request)
