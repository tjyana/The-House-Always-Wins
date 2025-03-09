import os
import morph
import sqlite3
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from contextlib import closing
from src.python.utils.Note import NoteDB, NoteExtractor
from src.python.utils.Experience import WorkExperienceDB, WorkExperienceExtractor
from src.python.utils.Candidate import CandidateDB, CandidateExtractor
from src.python.utils.Task import TaskDb, TaskExtractor
import pandas as pd
from morph import MorphGlobalContext

@morph.func(name='tasks_data')
def tasks_data(context:MorphGlobalContext):
    DB_PATH = "./db/candidate.db"
    task_db = TaskDb(db_path=DB_PATH)
    tasks_list = task_db.get_tasks()
    task_counts = task_db.get_status_count()
    print(tasks_list)
    return {"value": tasks_list, "counts":task_counts}
 

@morph.func
def transcript(context:MorphGlobalContext):
    DB_PATH = "./db/candidate.db"
    note_extractor = NoteExtractor()
    json_output = note_extractor.extract_note(context.vars['transcript'])
    candidate_id = "4"
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
    candidate_id = candidate_db.add_candidate(candidate_info)
    print(f"{next_action = }")
    task_db = TaskDb(db_path=DB_PATH)
    task_extraxtor = TaskExtractor()
    task_info = task_extraxtor.extract(transcript=context.vars['transcript'])
    print(f"{task_info = }")
    task_db.add_task(candidate_id=candidate_id, task=task_info)
    return {'variable':context.vars['transcript']}