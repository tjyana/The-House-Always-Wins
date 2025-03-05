from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from ..models.Experience import WorkExperience

class WorkExperienceExtractor:
    def __init__(self, model_name="gpt-4o"):
        load_dotenv()
        self.model = ChatOpenAI(model=model_name)
        self.sys_msg = """
        You are an assistant who outputs JSON data for the user in the specified schema.
    You will be given a piece of text from the user which indicates a transcript of a call
    between a recruiter and a potential candidate.

    You are to create work experience sql entries, where each entry covers a tenure at one company.
    Internal moves still stay within the same sql entry into the database. The output should
    have the following fields:
    company: the company name
    start_date: ISO8601 standard tenure start date
    end_date: ISO8601 standard tenure end date
    description: detailed tenure experience description.

    In the description field, you should structure your string as if it were written on a resume.
    An example is shoown below:
    Junior Software Engineer (2005–2007)
        Built internal tools using Python and Flask to streamline team workflows.
        Designed relational database schemas with PostgreSQL for data tracking.
        Reduced manual reporting time by 20% through automation scripts.
    Software Engineer (2007–2009)
        Developed a customer-facing portal using AngularJS, improving client satisfaction.
        Integrated analytics tracking with Google Analytics, providing actionable insights.
        Trained three new hires on version control and deployment processes.

    Given the meeting transcript given by the user, create a list of work experience sql entries
    following the instructions above. Your completed reply should be a json object with
    a single key "entries" and a value which is a list of the json schema for work experience entries.

    Do not forget that each sql entry should cover the candidate's whole tenure at one company,
    so if they get a promotion halfway between, that should be noted in the description as well.
    Do not create separate sql entries for the same position when there is an internal change
    in their role.

    Do not add dates to ISO8601 format dates, if not specified. If the month is only specified,
    list the date in YYYY-MM format only, no dates. If there is no end date given, make sure you
    write NULL in all caps so the sql db recognizes that it should be Null. But you must
    always have a start date.
        """
        self.human_msg = "Here is the meeting transcript: {transcript}"
        self.prompt_template = ChatPromptTemplate.from_messages(
            [
                ("system", self.sys_msg),
                ("human", self.human_msg)
            ]
        )
        self.chain = self.prompt_template | self.model | JsonOutputParser(pydantic_object=WorkExperience)

    def extract_work_experience(self, transcript: str) -> WorkExperience:
        return self.chain.invoke({"transcript": transcript})
