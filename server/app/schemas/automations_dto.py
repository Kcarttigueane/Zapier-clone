from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class AutomationLogInDTO(BaseModel):
    triggered_at: datetime
    details: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "triggered_at": "2023-01-01T00:00:00",
                "details": "Triggered automation with ID 1",
            }
        }


class AutomationLogOutDTO(AutomationLogInDTO):
    id: PyObjectId


class AutomationInDTO(MongoModel):
    user_id: PyObjectId = Field(
        ..., title="User ID", description="The ID of the user creating the automation."
    )
    name: str = Field(
        ..., title="Name", description="The name of the automation to be created."
    )
    trigger_id: PyObjectId = Field(
        ...,
        title="Trigger ID",
        description="The ID of the trigger associated with the automation.",
    )
    action_id: PyObjectId = Field(
        ...,
        title="Action ID",
        description="The ID of the action associated with the automation.",
    )
    status: Literal["enabled", "disabled"] = Field(
        ..., title="Status", description="The status of the automation."
    )
    first_poll: bool = Field(
        True, title="First Poll", description="Checks if it's the automations first poll."
    )
    last_polled: datetime = Field(
        datetime.utcnow(), title="Last Polled", description="The last time automation has been polled"
    )
    logs: List[AutomationLogInDTO] = Field(
        [], title="Logs", description="Automation logs"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "name": "Automation 1",
                "trigger_id": 2,
                "action_id": 3,
                "status": "enabled",
                "first_poll": False,
                "last_polled": "2023-09-25T18:44:52Z",
                "logs": []
            }
        }


class AutomationOutDTO(AutomationInDTO):
    id: PyObjectId
