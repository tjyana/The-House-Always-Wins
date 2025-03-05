from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from ..models.Note import Note

class NoteExtractor:
    def __init__(self, model_name="gpt-4o"):
        load_dotenv()
        self.model = ChatOpenAI(model=model_name)
        self.sys_msg = """
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
        self.human_msg = "Here is the transcript: {transcript}"
        self.prompt_template = ChatPromptTemplate.from_messages(
            [
                ("system", self.sys_msg),
                ("human", self.human_msg)
            ]
        )
        self.chain = self.prompt_template | self.model | JsonOutputParser(pydantic_object=Note)

    def extract_note(self, transcript: str) -> Note:
        """
        Extracts meeting notes and the required next action from the transcript.
        """
        return self.chain.invoke({"transcript": transcript})
