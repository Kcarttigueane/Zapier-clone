from pydantic import Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class ServiceCompatibilityInDTO(MongoModel):
    service_id_1: PyObjectId | None = Field(
        ..., title="Service ID 1", description="The ID of the first service."
    )
    service_id_2: PyObjectId | None = Field(
        ..., title="Service ID 2", description="The ID of the second service."
    )

    class config:
        json_schema_extra = {
            "example": {
                "service_id_1": "507f1f77bcf86cd799439011",
                "service_id_2": "507f1f77bcf86cd799439031",
            }
        }


class ServiceCompatibilityOutDTO(ServiceCompatibilityInDTO):
    id: PyObjectId


class TriggerActionCompatibilityInDTO(MongoModel):
    trigger_id: PyObjectId = Field(
        ..., title="Trigger ID", description="The ID of the trigger."
    )
    action_id: PyObjectId = Field(
        ..., title="Action ID", description="The ID of the action."
    )

    class config:
        json_schema_extra = {
            "example": {
                "trigger_id": "507f1f77bcf86cd799439011",
                "action_id": "507f1f77bcf86cd799439031",
            }
        }


class TriggerActionCompatibilityOutDTO(TriggerActionCompatibilityInDTO):
    id: PyObjectId
