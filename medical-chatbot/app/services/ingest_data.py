from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

from app.utils.helper import (
    load_pdf_file,
    filter_to_minimal_docs,
    text_split,
    download_hugging_face_embeddings
)

import os
from dotenv import load_dotenv

load_dotenv()


def ingest_documents():

    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

    pc = Pinecone(api_key=PINECONE_API_KEY)

    index_name = "medical-chatbot"

    # Create index if not exists
    if not pc.has_index(index_name):

        pc.create_index(
            name=index_name,
            dimension=384,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            ),
        )

    # Load PDFs
    documents = load_pdf_file("data/raw/")

    # Filter metadata
    documents = filter_to_minimal_docs(documents)

    # Split chunks
    chunks = text_split(documents)

    print("Documents loaded:", len(documents))
    print("Chunks:", len(chunks))

    # Embeddings
    embeddings = download_hugging_face_embeddings()

    # Store in Pinecone
    PineconeVectorStore.from_documents(
        documents=chunks,
        index_name=index_name,
        embedding=embeddings
    )

    print("✅ Data successfully stored in Pinecone")

    return {
        "documents": len(documents),
        "chunks": len(chunks),
        "status": "success"
    }