import sqlite3
import os
from dotenv import load_dotenv

from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma


def create_new_vector_embedding(candidate_id):

    load_dotenv()

    DB_PATH = "./candidate.db"
    PERSISTENT_DIR = "./chroma_db"

    os.makedirs(PERSISTENT_DIR, exist_ok=True)
    print(f"Persistent directory: {PERSISTENT_DIR}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Query each work experience row
    cursor.execute("""
        SELECT experience_id, candidate_id, company, start_date, end_date, description
        FROM WorkExperience
        WHERE candidate_id = ?
    """, (candidate_id,))
    rows = cursor.fetchall()

    # Process each work experience row
    documents = []
    for row in rows:
        experience_id, candidate_id, company, start_date, end_date, description = row

        doc_text = (
            f"Company: {company}. "
            f"Duration: {start_date} to {end_date}. "
            f"Description: {description}."
        )

        doc = Document(
            page_content=doc_text,
            metadata={
                "candidate_id": candidate_id,
                "experience_id": experience_id,
                "company": company,
            }
        )
        documents.append(doc)

    print(f"Created {len(documents)} documents for candidate {candidate_id}.")

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    vectorstore = Chroma(persist_directory=PERSISTENT_DIR, embedding_function=embeddings)
    vectorstore.add_documents(documents)
    print("New documents added to the persistent vector store.")

    conn.close()

if __name__ == "__main__":
    for n in range(1,6):
        create_new_vector_embedding(candidate_id=n)
