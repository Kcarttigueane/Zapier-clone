import time
from typing import List

from pydantic import BaseModel, Field


class Action(BaseModel):
    name: str
    description: str


class Reaction(BaseModel):
    name: str
    description: str


class Service(BaseModel):
    name: str
    icon_svg_base64: str
    actions: List[Action]
    reactions: List[Reaction]


class Server(BaseModel):
    current_time: int = Field(..., example=int(time.time()))
    services: List[Service] = Field(..., example=[])


class Client(BaseModel):
    host: str = Field(..., example="")
    services: int = Field(..., example=0)
    triggers: int = Field(..., example=0)
    actions: int = Field(..., example=0)


class About(BaseModel):
    client: Client
    server: Server
