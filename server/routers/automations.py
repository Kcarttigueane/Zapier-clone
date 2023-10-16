from fastapi import APIRouter, Depends

from models.automation import AutomationCreate
from models.py_object_id import PyObjectId
from repository.automation_repository import AutomationRepository
from services.auth_service import get_current_user

automation_router = APIRouter(prefix="/automations", tags=["Automations"])


@automation_router.post("/create", summary="Create new automation for user")
async def add_automation(
    automation: AutomationCreate, current_user=Depends(get_current_user)
):
    automation_repository = AutomationRepository(current_user.id)
    await automation_repository.create(automation)


@automation_router.get("/", summary="List all automations")
async def list_automations(current_user=Depends(get_current_user)):
    automation_repository = AutomationRepository(current_user.id)
    return await automation_repository.list_automations()


@automation_router.get("/{automation_id}", summary="Get a single automation")
async def get_automation(
    automation_id: PyObjectId, current_user=Depends(get_current_user)
):
    automation_repository = AutomationRepository(current_user.id)
    return await automation_repository.get(automation_id)


@automation_router.put("/{automation_id}", summary="Update an automation")
async def update_automation(
    automation_id: PyObjectId,
    automation: AutomationCreate,
    current_user=Depends(get_current_user),
):
    automation_repository = AutomationRepository(current_user.id)
    return await automation_repository.update(automation_id, automation)


@automation_router.delete("/{automation_id}", summary="Delete a automation")
async def delete_automation(
    automation_id: PyObjectId, current_user=Depends(get_current_user)
):
    automation_repository = AutomationRepository(current_user.id)
    return await automation_repository.delete(automation_id)
