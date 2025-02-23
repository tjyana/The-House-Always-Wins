from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import sqlite3
from contextlib import closing

def extract_notes_from_call(transcript):
    load_dotenv()

    model = ChatOpenAI(model="gpt-4o")

    class Note(BaseModel):
        notes: str = Field(description="meeting minutes text")
        next_action: str = Field(description="required next action chosen from list")

    sys_msg = """
    You are an assistant who outputs JSON data for the user in the specified schema.
    You will be given a piece of text from the user which indicates a transcript of a call
    between a recruiter and a potential candidate.

    You are to create meeting minutes such that enough information can be gathered
    from your output to create a candidate CV, or track any relevant information
    about the candidate in the applicant tracking system. These minutes should be
    returned in the "notes" field of a json object. dont worry about the text getting too long,
    make sure it contains enough relevant info that you can pick up from the call.

    You should also output one of three next actions, depending on the contents of the call.
    The three options are:
    1. keep_in_touch, which is used when it is deemed that the candidate is no good
    match for current positions that the recruiter is offering.
    2. pitch_company, which is used when a specific company is spoken about during the
    meeting and the candidate is happy to either know more or apply.
    3. update_cv, which is used when updating cv is disscusssed in the call.

    Make sure your output is in JSON format with keys "notes" and "next_action"

    Also the entries into notes should be written not as structured data but more like
    meeting minutes bullet point notes, preserving info as much as possible. However, your
    output should not be a python list, but just a long string. You do not need to
    include personal info such as email address etc as that info is already extracted
    from another method.
    """

    human_msg = """
    Here is the transcript: {transcript}
    """

    notes_template = ChatPromptTemplate.from_messages(
        [
            ("system", sys_msg),
            ("human", human_msg)
        ]
    )

    chain = notes_template | model | JsonOutputParser(pydantic_object=Note)

    result = chain.invoke({"transcript": transcript})

    return result

def add_new_note_from_json(db_path, candidate_id, notes_json):
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

if __name__ == "__main__":
    DB_PATH = "candidate.db"
    with open("michael_scott.txt", "r") as file:
        transcript = file.read()
    json_output = extract_notes_from_call(transcript=transcript)
    print(f"{json_output = }")
    candidate_id = "1"
    candidate_id, next_action = add_new_note_from_json(
        db_path=DB_PATH,
        candidate_id=candidate_id,
        notes_json=json_output,
    )
    print(f"{next_action = }")
