from typing import Literal

from pydantic import Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class ActionInDTO(MongoModel):
    service_id: PyObjectId = Field(
        ...,
        title="Service ID",
        description="The ID of the service associated with the action.",
    )
    name: Literal[
        "SendNotification",  # ✅ PushNotification
        "AddToPlaylist",  # ✅ Spotify, Youtube
        "SendMessage",  # ✅ Discord, Whatsapp, Signal
        "UploadToDrive",  # ✅ Google Drive, One Drive, DropBox
    ] = Field(..., title="Action Name", description="The name of the action.")
    description: str = Field(
        ..., title="Description", description="A brief description of the action."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "service_id": 1,
                "name": "Send Email Action",
                "description": "Sends an email when triggered.",
            }
        }


class ActionOutDTO(MongoModel):
    id: PyObjectId
    service_id: PyObjectId
    name: str
    description: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "service_id": 1,
                "name": "Send Email Action",
                "description": "Sends an email when triggered.",
            }
        }
