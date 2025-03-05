from pydantic import BaseModel, Field

class Candidate(BaseModel):
    first_name: str = Field(..., description="Candidate first name")
    last_name: str = Field(..., description="Candidate last name")
    email: str = Field(..., description="Candidate email address")
