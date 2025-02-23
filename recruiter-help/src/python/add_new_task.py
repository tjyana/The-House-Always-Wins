
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import sqlite3
from contextlib import closing

def extract_task_from_call(transcript):
    load_dotenv()

    model = ChatOpenAI(model="gpt-4o")

    class TasksSQLEntry(BaseModel):
        task: int = Field(description="task that needs to be done. 1 = pitch a company, 2 = update cv, 3 = keep in touch")
        email_draft: str = Field(description="email draft that will be sent to the candidate")
        done: bool = Field(description="whether there is a task that needs to be done or not. 1 for true")


    class Tasks(BaseModel):
        entries: list[TasksSQLEntry] = Field(description="list of sql entries")

    sys_msg = """
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

    human_msg = """
    Here is the meeting transcript: {transcript}
    """

    work_exp_template = ChatPromptTemplate.from_messages(
        [
            ("system", sys_msg),
            ("human", human_msg),
        ]
    )

    chain = work_exp_template | model | JsonOutputParser(pydantic_object=Tasks)

    result = chain.invoke({"transcript": transcript})

    return result



def add_task_from_json(db_path, candidate_id, task_json):
    task = task_json["task"]
    email_draft = task_json["email_draft"]
    done = task_json["done"]

    with closing(sqlite3.connect(db_path)) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Tasks (candidate_id, task, email_draft, done)
            VALUES (?, ?, ?, ?)
        """, (candidate_id, task, email_draft, done))
        conn.commit()

    print(f"Added {len(task)} rercords for ID: {candidate_id}")

    return None

if __name__ == "__main__":
    DB_PATH = "empty_copy.db"
    with open("data/text_minutes/carlos_rivera_minutes.txt", "r") as file:
        transcript = file.read()
    task_json = extract_task_from_call(transcript=transcript)
    print(f"{task_json = }")
    candidate_id = 1
    add_task_from_json(db_path=DB_PATH, candidate_id=candidate_id, task_json=task_json)