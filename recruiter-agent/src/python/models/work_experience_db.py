import sqlite3
from contextlib import closing
from models.work_experience_model import WorkExperience

class WorkExperienceDB:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def add_work_experience(self, candidate_id: int, work_experience: WorkExperience) -> None:
        """
        Insert work experience records for a candidate into the database.
        """
        for entry in work_experience.entries:
            with closing(sqlite3.connect(self.db_path)) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    """
                    INSERT INTO WorkExperience (candidate_id, company, start_date, end_date, description)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (candidate_id, entry.company, entry.start_date, entry.end_date, entry.description)
                )
                conn.commit()
        print(f"Added {len(work_experience.entries)} records for candidate ID: {candidate_id}")
