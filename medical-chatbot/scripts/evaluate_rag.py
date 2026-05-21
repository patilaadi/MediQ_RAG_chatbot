from ragas import evaluate
from datasets import Dataset
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()

# Example test dataset (you can expand this)
data = {
    "question": [
        "What is diabetes?",
        "What are symptoms of fever?",
        "What is malaria?"
    ],
    "answer": [
        "Diabetes is a disease with high blood sugar.",
        "Fever symptoms include high temperature and chills.",
        "Malaria is caused by mosquito infection."
    ],
    "contexts": [
        ["Diabetes is a chronic condition affecting blood sugar levels."],
        ["Fever is characterized by elevated body temperature."],
        ["Malaria is caused by Plasmodium parasites transmitted by mosquitoes."]
    ],
    "ground_truth": [
        "Diabetes is a metabolic disease with high blood glucose.",
        "Fever includes high temperature, fatigue, and chills.",
        "Malaria is a mosquito-borne infectious disease."
    ]
}

dataset = Dataset.from_dict(data)

# LLM for evaluation
llm = ChatOpenAI(
        model="meta-llama/llama-3-8b-instruct",
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
        default_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "medical-chatbot"
        }
    )
result = evaluate(dataset, llm=llm)

scores_dict = {}
for item in result.scores:
    scores_dict.update(item)
    
for k in scores_dict:
    if scores_dict[k] != scores_dict[k]:  # NaN check
        scores_dict[k] = 0.0
print(scores_dict)  