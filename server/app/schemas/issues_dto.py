from typing import Literal

from pydantic import Field

from app.schemas.mongoModel import MongoModel
from app.schemas.py_object_id import PyObjectId


class IssueInDTO(MongoModel):
    user_id: PyObjectId = Field(
        ..., title="User ID", description="The ID of the user reporting the issue."
    )
    category: Literal["bug", "feature", "question", "other"] = Field(
        ..., title="Category", description="The category of the issue."
    )
    description: str = Field(
        ..., title="Description", description="Detailed description of the issue."
    )

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "category": "bug",
                "description": "The submit button is not working.",
            }
        }


class IssueOutDTO(IssueInDTO):
    id: PyObjectId
