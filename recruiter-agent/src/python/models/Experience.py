from pydantic import BaseModel, Field
from typing import List

class WorkExperienceSQLEntry(BaseModel):
    company: str = Field(..., description="The company that the candidate worked at during this time")
    start_date: str = Field(..., description="Start date working at the company, in ISO8601 format")
    end_date: str = Field(..., description="End date working at the company, in ISO8601 format")
    description: str = Field(..., description="Detailed tenure experience description.")

class WorkExperience(BaseModel):
    entries: List[WorkExperienceSQLEntry] = Field(..., description="List of work experience SQL entries")
