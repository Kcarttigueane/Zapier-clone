from datetime import timedelta
import os

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from services.auth_service import get_current_user
from repository.automation_repository import AutomationRepository
from models.automation import Automation, AutomationCreate

automation_router = APIRouter(prefix="/automations", tags=["Automations"])

@automation_router.post(
    "/create",
    summary="Create new automation for user"
)
async def add_automation(automation: AutomationCreate, current_user = Depends(get_current_user)):
    automation_repository = AutomationRepository(current_user.id)
    await automation_repository.create(automation)


