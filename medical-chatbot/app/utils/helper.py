from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv
import os
from flask import request
import jwt

load_dotenv()
SECRET = os.getenv("SECRET")

def load_pdf_file(data):
    loader = DirectoryLoader(data, glob="*.pdf", loader_cls=PyPDFLoader)
    return loader.load()


def filter_to_minimal_docs(docs):
    return [
        Document(page_content=d.page_content,
                 metadata={"source": d.metadata.get("source")})
        for d in docs
    ]


def text_split(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=20
    )
    return splitter.split_documents(docs)


def download_hugging_face_embeddings():
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    return HuggingFaceEmbeddings(model_name=model_name)


def get_user_from_token():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, SECRET, algorithms=["HS256"])
        return decoded.get("user_id")  # 👈 IMPORTANT
    except:
        return None