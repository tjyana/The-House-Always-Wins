from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from ..models.Candidate import Candidate

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
