from pydantic import BaseModel, Field
import sqlite3
from contextlib import closing
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
class Candidate(BaseModel):
    first_name: str = Field(..., description="Candidate first name")
    last_name: str = Field(..., description="Candidate last name")
    email: str = Field(..., description="Candidate email address")


class CandidateDB:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def add_candidate(self, candidate: Candidate) -> int:
        """
        Insert a candidate into the database and return the new candidate ID.
        """
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT OR REPLACE INTO Candidates (first_name, last_name, email)
                VALUES (?, ?, ?)
                """,
                (candidate['first_name'], candidate['last_name'], candidate['email'])
            )
            candidate_id = cursor.lastrowid
            conn.commit()
        return candidate_id
    def get_candidate(self, candidate_id: int) -> Candidate:
        """
        Retrieve a candidate from the database by candidate ID.
        """
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT first_name, last_name, email
                FROM Candidates
                WHERE candidate_id = ?
                """,
                (candidate_id,)
            )
            candidate = cursor.fetchone()
        return Candidate(**candidate)
    
    def get_candidates(self) -> list[Candidate]:
        """
        Retrieve all candidates from the database.        
        """
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT first_name, last_name, email
                FROM Candidates
                """
            )
            candidates = cursor.fetchall()
        return [Candidate(**candidate) for candidate in candidates]

    def update_candidate(self, candidate_id: int, candidate: Candidate):
        """
        Update a candidate in the database.
        """
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                UPDATE Candidates
                SET first_name = ?, last_name = ?, email = ?
                WHERE candidate_id = ?
                """,
                (candidate['first_name'], candidate['last_name'], candidate['email'], candidate_id)
            )
            conn.commit()


class CandidateExtractor:
    def __init__(self, model_name="gpt-4o", temperature=0):
        load_dotenv()
        self.model = ChatOpenAI(model=model_name, temperature=temperature)
        self.sys_msg = """
        You are an assistant who outputs JSON data for the user in the specified schema.
        You will be given a piece of text from the user which indicates a transcript of a call
        between a recruiter and a potential candidate.
        You are to pull the following data out of the call. The JSON variable names are in parentheses:
        - Candidate first name (first_name)
        - Candidate last name (last_name)
        - Candidate email address (email)
        """
        self.human_msg = "Here is the transcript: {transcript}"
        self.prompt_template = ChatPromptTemplate.from_messages(
            [
                ("system", self.sys_msg),
                ("human", self.human_msg)
            ]
        )
        self.chain = self.prompt_template | self.model | JsonOutputParser(pydantic_object=Candidate)

    def extract_candidate_info(self, transcript: str) -> Candidate:
        """
        Extract candidate information from the transcript.
        """
        return self.chain.invoke({"transcript": transcript})
