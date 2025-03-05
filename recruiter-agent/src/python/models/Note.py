from pydantic import BaseModel, Field

class Note(BaseModel):
    notes: str = Field(..., description="Meeting minutes text")
    next_action: str = Field(..., description="Required next action chosen from list")
