from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import sqlite3
from contextlib import closing
import pandas as pd

class Task(BaseModel):
    task: int = Field(
        description="Task that needs to be done: 1 = pitch a company, 2 = update CV, 3 = keep in touch"
    )
    email_draft: str = Field(
        description="Email draft that will be sent to the candidate"
    )
    done: bool = Field(
        description="Indicates whether there is a task to be done (True for yes)"
    )

class Tasks(BaseModel):
    entries: list[Task] = Field(
        description="List of task entries extracted from the transcript"
    )

class TaskExtractor:
    def __init__(self):
        load_dotenv()
        self.model = ChatOpenAI(model="gpt-4o")
        self.sys_msg = """
        You are an assistant who outputs JSON data for the user in the specified schema.
        You will be given a piece of text from the user which indicates a transcript of a call
        between a recruiter and a potential candidate.

        You are to determine what the next action required is by the recruiter.
        Please discern this from the chat transcript.
        Please choose the correct action from the following list:
        1. pitch a company position to the candidate (will need to be done in a follow up meeting)
        2. get the candidate to update their cv so they can potentially apply to positions (will need to be done over email or in a follow up meeting)
        3. keep in touch with a recruiter when an applicable position comes up

        The output should have the following fields:
        task: 1, 2, or 3 depending on the action required
        email_draft: the email draft that will be sent to the candidate
        done: 1 if there is a task that needs to be done, 0 if there is no task that needs to be done
        """
        self.human_msg = "Here is the meeting transcript: {transcript}"
        self.prompt = ChatPromptTemplate.from_messages(
            [("system", self.sys_msg), ("human", self.human_msg)]
        )

    def extract(self, transcript: str) -> Tasks:
        chain = self.prompt | self.model | JsonOutputParser(pydantic_object=Tasks)
        result = chain.invoke({"transcript": transcript})
        return result

class TaskDb:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def add_task(self, candidate_id: int, task: Task):
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute("""
        CREATE TABLE IF NOT EXISTS Tasks (
            task_id INTEGER PRIMARY KEY,
            task TEXT NOT NULL,
            candidate_id INTEGER NOT NULL,
            done BOOLEAN NOT NULL,
            email_draft TEXT,
            created_at TEXT DEFAULT (DATETIME('now')),
            FOREIGN KEY (candidate_id) REFERENCES Candidates(candidate_id)
        );
        """)
            cursor.execute("""
                INSERT INTO Tasks (candidate_id, task, email_draft, done)
                VALUES (?, ?, ?, ?)
            """, (candidate_id, task['task'], task['email_draft'], task['done']))
            conn.commit()
            print(f"Added task for candidate ID: {candidate_id}")

    def add_tasks(self, candidate_id: int, tasks: Tasks):
        for task in tasks['entries']:
            self.add_task(candidate_id, task)
    def get_tasks(self):
        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT t.task_id, t.candidate_id, c.first_name, c.last_name, t.task, t.email_draft, t.done
                FROM Tasks AS t inner join Candidates as c
                           on t.candidate_id=c.candidate_id       
            """)
            tasks = cursor.fetchall()
            data = pd.DataFrame(tasks, columns=['task_id', 'candidate_id', 'first_name','last_name', 'task', 'email_draft', 'done'])
            print(data.to_json(orient='records'))
            # Convert DataFrame to JSON with each row as a separate record
            return data.to_json(orient='records')

    def get_status_count(self):

        with closing(sqlite3.connect(self.db_path)) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT  done as status, count(done) as count
                           from Tasks 
                           GROUP BY done         
            """)
            tasks = cursor.fetchall()
            data = pd.DataFrame(tasks, columns=['status', 'count'])
            print(data.to_json(orient='records'))
            # Convert DataFrame to JSON with each row as a separate record
            return data.to_json(orient='records')