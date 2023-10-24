from typing import List, Literal

from pydantic import Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class TriggerInDTO(MongoModel):
    service_id: PyObjectId = Field(
        ...,
        title="Service ID",
        description="The ID of the service associated with the trigger.",
    )
    name: Literal[
        "NewFile",
        "LikeSong",
        "NewEvent",
        "BirthdayEvent",
        "NewAttachment",
    ] = Field(..., title="Trigger Name", description="The name of the trigger.")
    description: str = Field(
        ..., title="Description", description="A brief description of the trigger."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "service_id": 1,
                "name": "New File Trigger",
                "description": "Triggers when a new file is uploaded.",
            }
        }


class TriggerOutDTO(TriggerInDTO):
    """
    Schema for reading trigger information.
    """

    id: PyObjectId


class TriggerAnswer:
    def __init__(
        self,
        objs: List | None = None,
        header: str | None = None,
        body: str | None = None,
    ):
        if objs is None:
            objs = []
        self.objs = objs
