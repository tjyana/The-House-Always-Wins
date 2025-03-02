from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import sqlite3
from contextlib import closing

def extract_candidate_info(transcript):
    load_dotenv()

    model = ChatOpenAI(model="gpt-4o", temperature=0)

    class Candidate(BaseModel):
        first_name: str = Field(description="candidate first name")
        last_name: str = Field(description="candidate last name")
        email: str = Field(description="candidate email address")

    sys_msg = """
    You are an assistant who outputs JSON data for the user in the specified schema.
    You will be given a piece of text from the user which indicates a transcript of a call
    between a recruiter and a potential candidate.
    You are to pull the following data out of the call. The json variable names are in parentheses:
    - Canddiate first name (first_name)
    - Candidate last name (last_name)
    - candidate email address (email)
    """

    human_msg = """
    Here is the transcript: {transcript}
    """

    extract_template = ChatPromptTemplate.from_messages(
        [
            ("system", sys_msg),
            ("human", human_msg)
        ]
    )

    chain = extract_template | model | JsonOutputParser(pydantic_object=Candidate)
    result = chain.invoke({"transcript": transcript})

    return result

def add_new_cand_from_json(db_path, candidate_json):
    # {'first_name': 'Michael', 'last_name': 'Scott', 'email': 'michael.scott@dundermifflin.com'}
    first_name = candidate_json['first_name']
    last_name = candidate_json['last_name']
    email = candidate_json['email']

    with closing(sqlite3.connect(db_path)) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Candidates (first_name, last_name, email)
            VALUES (?, ?, ?)
        """, (first_name, last_name, email))
        candidate_id = cursor.lastrowid
        conn.commit()

    return candidate_id

if __name__ == "__main__":
    DB_PATH = "candidate.db"
    with open("michael_scott.txt", "r") as file:
        transcript = file.read()
    json_output = extract_candidate_info(transcript=transcript)
    print(f"{json_output = }")
    new_id = add_new_cand_from_json(db_path=DB_PATH, candidate_json=json_output)
    print(f"{new_id = }")
