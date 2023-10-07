from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models.db_model_mixin import DbModelMixin
from models.py_object_id import PyObjectId


class AutomationCreate(BaseModel):
    action: Optional[str] = Field(None)
    reaction: Optional[str] = Field(None)
    last_polled: Optional[datetime] = Field(default_factory=datetime.utcnow)
    last_obj_checked: Optional[datetime] = Field(None)
    first_poll = Optional[bool] = Field(True)
    stored_objs: Optional[List[str]] = Field(default_factory=list)


class Automation(DbModelMixin, AutomationCreate):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")


from datetime import datetime

class Action:
    def __init__(self, last_polled: datetime, first_poll: bool = True, last_obj_checked: datetime = None, stored_objs = []):
        self.last_polled = last_polled
        self.last_obj_checked = last_obj_checked
        self.first_poll = first_poll
        self.stored_objs = stored_objs


class ActionAnswer:
    def __init__(self, last_obj_checked: datetime = None, stored_objs = [], objs = [], header: str = "", body: str = '', tail: str = "", passed: bool = True, action_func: str = "", reaction_func: str = ""):
        self.last_obj_checked = last_obj_checked
        self.header = header
        self.body = body
        self.tail = tail
        self.passed = passed
        self.action_func = action_func
        self.reaction_func = reaction_func
        self.stored_objs = stored_objs
        self.objs = objs

    def __str__(self):
        return f"ActionAnswer(last_polled={self.last_polled}, last_obj_checked={self.last_obj_checked}, header='{self.header}', body='{self.body}', tail='{self.tail}')"
