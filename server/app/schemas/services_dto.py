from typing import Literal, Optional

from pydantic import Field, validator

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class ServiceInDTO(MongoModel):
    name: Literal[
        "google drive",
        "google calendar",
        "gmail",
        "discord",
        "spotify",
        "youtube",
        "twitter",
        "push notification",
        "whatsApp",
        "open meteo",
    ] = Field(..., title="Service Name", description="The name of the service.")
    description: Optional[str] = Field(
        None,
        title="Service Description",
        description="A brief description of the service.",
    )
    icon_svg_base64: Optional[str] = Field(
        None,
        title="Service Icon SVG",
        description="The icon or logo associated with the service in SVG format.",
    )

    class Config:
        @validator("icon_svg_base64", pre=True, always=True)
        def validate_base64(cls, value):
            if value is not None and value.strip() == "":
                raise ValueError("Base64 string cannot be empty")
            return value

        json_schema_extra = {
            "example": {
                "name": "Google Drive",
                "description": "A file storage and synchronization service.",
                "icon_svg_base64": "PHN2Zy...",
            }
        }


class ServiceOutDTO(ServiceInDTO):
    id: PyObjectId
