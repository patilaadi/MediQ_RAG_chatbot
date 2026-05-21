from langchain_pinecone import PineconeVectorStore
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from app.utils.prompt import system_prompt
from app.services.embedding_service import get_embeddings

from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()


def build_rag_chain(index_name):

    embeddings = get_embeddings()

    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings
    )

    retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

    chat_model = ChatOpenAI(
        model="meta-llama/llama-3-8b-instruct",
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
        default_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "medical-chatbot"
        }
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])

    qa_chain = create_stuff_documents_chain(chat_model, prompt)
    rag_chain = create_retrieval_chain(retriever, qa_chain)

    return rag_chain