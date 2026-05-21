import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Environment Variables
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# Mongo Connection
client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

print("MongoDB Connected Successfully")