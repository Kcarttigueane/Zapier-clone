import typing

from bson import ObjectId
from pydantic import BaseModel

from app.utils.model_utils import replace_id_key

_MotorDocument = typing.Mapping[str, typing.Any]


class MongoModel(BaseModel):
    def __init__(self, **pydict) -> None:
        super().__init__(**pydict)
        if pydict.get("_id"):
            self.id = pydict.pop("_id")

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

    @classmethod
    def __from_mongo_to_document(cls, data: _MotorDocument):
        """
        Convert document to a model for MongoDB request which returns list of documents
        """
        data_dict = dict(data)

        # Replace `_id` key with `id` key for nested documents
        replaced = replace_id_key(data_dict)
        return cls(**replaced)

    @classmethod
    def from_mongo(cls, data: _MotorDocument | None):
        """
        Convert document to a model for MongoDB request which returns only one document
        """
        return cls.__from_mongo_to_document(data) if data else None

    @classmethod
    def from_mongo_list(cls, documents: list[_MotorDocument]):
        """Convert a list of documents into a list of Model"""
        return [cls.__from_mongo_to_document(doc) for doc in documents]

    def mongo(self, **kwargs) -> _MotorDocument:
        exclude_unset = kwargs.pop("exclude_unset", True)
        by_alias = kwargs.pop("by_alias", True)

        parsed = self.dict(
            exclude_unset=exclude_unset,
            by_alias=by_alias,
            **kwargs,
        )

        # Mongo uses `_id` as default key. We should stick to that as well.
        if "_id" not in parsed and "id" in parsed and parsed["id"] is not None:
            parsed["_id"] = parsed.pop("id")
        elif "id" in parsed and parsed["id"] is None:
            parsed.pop("id")

        return parsed
