import sqlite3
from contextlib import closing
from .Note import Note

class NoteDB:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def add_note(self, candidate_id: int, note: Note) -> tuple:
        """
        Insert a new note into the database.
        Returns a tuple of (candidate_id, next_action).
        """
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO Notes (candidate_id, note_text, next_action)
                VALUES (?, ?, ?)
                """,
                (candidate_id, note.notes, note.next_action)
            )
            conn.commit()
        return candidate_id, note.next_action
    
    def add_new_note_from_json(self, db_path, candidate_id, notes_json)->tuple:
        # {"notes": ["Michael is...], "next_action": "pitch_company"}
        notes = notes_json["notes"]
        next_action = notes_json["next_action"]

        with closing(sqlite3.connect(db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO Notes (candidate_id, note_text, next_action)
                VALUES (?, ?, ?)
            """, (candidate_id, notes, next_action))
            conn.commit()

        return (candidate_id, next_action)
