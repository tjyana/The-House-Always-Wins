import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

# Define your persistent directory (must be the same as used during ingestion)
PERSISTENT_DIR = "./chroma_db"

def main():
    # Initialize the embeddings model
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    # Load the persistent vector store
    vectorstore = Chroma(persist_directory=PERSISTENT_DIR, embedding_function=embeddings)

    # Prompt the user for a query from the terminal
    query_text = input("Enter your query: ")

    # Perform a similarity search and retrieve the top 3 documents
    results = vectorstore.similarity_search(query_text, k=3)

    # Print the results
    print("\n--- Search Results ---")
    for result in results:
        print("Content:", result.page_content)
        print("Metadata:", result.metadata)
        print("----------------------\n")

if __name__ == "__main__":
    main()
