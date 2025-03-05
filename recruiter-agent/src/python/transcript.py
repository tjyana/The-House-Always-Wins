import os
import morph
from morph import MorphGlobalContext

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import sqlite3
print('current path:',os.getcwd())
from contextlib import closing
from src.python.models.NoteDb import NoteDB
from src.python.extractors.NoteExtractor import NoteExtractor
from src.python.models.ExperienceDb import WorkExperienceDB
from src.python.extractors.ExperienceExtractor import WorkExperienceExtractor
from src.python.models.candidateDb import CandidateDB
from src.python.extractors.CandidateExtractor import CandidateExtractor
from src.python.models.Task import TaskDb, TaskExtractor

@morph.func
def transcript(context):
    DB_PATH = "./db/candidate.db"
    note_extractor = NoteExtractor()
    json_output = note_extractor.extract_note(context.vars['transcript'])
    print(f"{json_output = }")
    candidate_id = "1"
    note_db = NoteDB(db_path=DB_PATH)
    candidate_id, next_action = note_db.add_new_note_from_json(
        db_path=DB_PATH,
        candidate_id=candidate_id,
        notes_json=json_output,
    )
    work_db = WorkExperienceDB(db_path=DB_PATH)
    work_extractor = WorkExperienceExtractor()
    
    work_experience = work_extractor.extract_work_experience(transcript=context.vars['transcript'])
    print(f"{work_experience = }")
    work_db.add_work_experience(candidate_id=candidate_id, work_experience=work_experience)
    
    candidate_db = CandidateDB(db_path=DB_PATH)
    candidate_extractor = CandidateExtractor()
    candidate_info = candidate_extractor.extract_candidate_info(transcript=context.vars['transcript'])
    print(f"{candidate_info = }")
    candidate_db.add_candidate(candidate_info)
    print(f"{next_action = }")
    task_db = TaskDb(db_path=DB_PATH)
    task_extraxtor = TaskExtractor()
    task_info = task_extraxtor.extract(transcript=context.vars['transcript'])
    print(f"{task_info = }")
    task_db.add_task(candidate_id=candidate_id, task=task_info)
    return {'variable':context.vars['transcript']}



