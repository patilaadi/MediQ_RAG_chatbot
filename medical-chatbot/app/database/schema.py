from datetime import datetime, timezone
from bson import ObjectId
from database.db import db

# =========================
# Admins Collection
# =========================

admin_collection = db["admins"]

admin_schema = {
    "name": str,
    "email": str,
    "password": str,
    "picture": str,
    "role": "admin",
    "isActive": True,
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
}

admin_collection.create_index("email", unique=True)

# =========================
# Users Collection
# =========================

users_collection = db["users"]

user_schema = {
    "name": str,
    "email": str,
    "password": str,
    "picture": str,
    "role": "user",
    "isActive": True,
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
}

users_collection.create_index("email", unique=True)


# =========================
# Chat Threads Collection
# =========================

chat_threads = db["chat_threads"]

chat_thread_schema = {
    "userId": ObjectId,
    "title": "New Chat",  # AI-generated title
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
    "lastMessageAt": datetime.now(timezone.utc),
    "isDeleted": False,
}


# =========================
# Chat Messages Collection
# =========================

chat_messages = db["chat_messages"]

chat_message_schema = {
    "threadId": ObjectId,  # chat session link
    "userId": ObjectId,
    "role": "user/assistant",
    "content": str,
    "responseTime": float,
    "sourceDocuments": [],
    "feedback": "good/bad/none",
    "createdAt": datetime.now(timezone.utc),
}

# =========================
# Documents Collection
# =========================

documents_collection = db["documents"]

document_schema = {
    "fileName": str,
    "filePath": str,
    "uploadedBy": ObjectId,
    "totalChunks": 0,
    "embeddingModel": "text-embedding-3-small",
    "status": "processing/completed/failed",
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
}

# =========================
# Analytics Collection
# =========================

analytics_collection = db["analytics"]

analytics_schema = {
    "totalChats": 0,
    "successfulResponses": 0,
    "failedResponses": 0,
    "averageResponseTime": 0,
    "accuracyScore": 0,
    "recallScore": 0,
    "faithfulnessScore": 0,
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
}

# =========================
# Contact Requests Collection
# =========================

contact_requests = db["contact_requests"]

contact_request_schema = {
    "firstName": str,
    "lastName": str,
    "email": str,
    "message": str,
    "status": "new",
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
}

contact_requests.create_index("email")

# =========================
# OTP Collection
# =========================

otp_collection = db["otps"]

otp_schema = {
    "email": str,
    "code": str,
    "purpose": str,
    "verified": False,
    "expiresAt": datetime.now(timezone.utc),
    "createdAt": datetime.now(timezone.utc),
}

otp_collection.create_index("email")

# =========================
# Prompt Settings Collection
# =========================

prompt_collection = db["prompt_settings"]

prompt_schema = {
    "systemPrompt": str,
    "temperature": 0.7,
    "maxTokens": 1000,
    "modelName": "gpt-4o-mini",
    "isActive": True,
    "createdAt": datetime.now(timezone.utc),
    "updatedAt": datetime.now(timezone.utc),
}

print("All Collections Initialized Successfully")
