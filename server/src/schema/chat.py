from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
import uuid


class Message(BaseModel):
    id = uuid.uuid4()
    msg: str
    timestamp = str(datetime.now())


class Chat(BaseModel):
    token: str
    messages: List[Message]
    name: str
    session_start = str(datetime.now())
