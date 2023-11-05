from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field

from app.schemas.py_object_id import PyObjectId


class DbModelMixin(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
