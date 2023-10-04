from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId


class AutomationCreate(BaseModel):
    action: Optional[str] = Field(None)
    reaction: Optional[str] = Field(None)
    last_polled: Optional[datetime] = Field(default_factory=datetime.now)
    last_obj_checked: Optional[datetime] = Field(None)


class Automation(DbModelMixin, AutomationCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")


from datetime import datetime

class Action:
    def __init__(self, last_polled: datetime, last_checked_object: datetime = None):
        self.last_polled = last_polled
        self.last_checked_object = last_checked_object


class ActionAnswer:
    def __init__(self, last_obj_checked: datetime = None, header: str = "", body: str = '', tail: str = "", passed: bool = True):
        self.last_obj_checked = last_obj_checked
        self.header = header
        self.body = body
        self.tail = tail
        self.passed = passed

    def __str__(self):
        return f"ActionAnswer(last_polled={self.last_polled}, last_obj_checked={self.last_obj_checked}, header='{self.header}', body='{self.body}', tail='{self.tail}')"
