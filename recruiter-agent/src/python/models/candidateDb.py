import sqlite3
from contextlib import closing
from .Candidate import Candidate

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
