from flask import Blueprint, request, jsonify
from app.database.schema import (
    chat_messages,
    chat_threads,
    documents_collection,
    prompt_collection,
    analytics_collection,
    users_collection
)
from app.services.ingest_data import ingest_documents

from datetime import datetime
from werkzeug.utils import secure_filename
from bson import ObjectId

import os
import uuid


def convert_mongo_value(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: convert_mongo_value(v) for k, v in value.items()}
    if isinstance(value, list):
        return [convert_mongo_value(v) for v in value]
    return value


def convert_mongo_doc(doc):
    return convert_mongo_value(doc)

# Blueprint
admin_bp = Blueprint("admin", __name__)

# Create upload folder
os.makedirs("data/raw", exist_ok=True)


@admin_bp.route("/dashboard")
def dashboard():

    total_chats = chat_threads.count_documents({})
    total_docs = documents_collection.count_documents({})
    total_users = users_collection.count_documents({})
    analytics = analytics_collection.find_one({}, {"_id": 0}) or {}

    return jsonify({
        "total_users": total_users,
        "total_chats": total_chats,
        "total_documents": total_docs,
        "faithfulness": analytics.get("faithfulnessScore", 0.95),
        "context_recall": analytics.get("recallScore", 0.94),
        "average_response_time": analytics.get("averageResponseTime", 0)
    })


@admin_bp.route("/chats")
def chats():

    raw_chats = list(
        chat_messages.find({}, {"_id": 0})
        .sort("createdAt", -1)
        .limit(100)
    )

    chats = [convert_mongo_doc(chat) for chat in raw_chats]

    for chat in chats:
        if "createdAt" in chat and "timestamp" not in chat:
            chat["timestamp"] = chat["createdAt"]

    return jsonify({
        "chats": chats
    })


@admin_bp.route("/analytics")
def analytics():

    daily_chats = list(chat_threads.aggregate([
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$createdAt"
                    }
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]))

    top_topics = list(chat_threads.aggregate([
        {
            "$group": {
                "_id": "$title",
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]))

    analytics = analytics_collection.find_one({}, {"_id": 0}) or {}

    return jsonify({
        "daily_chats": [
            {"date": item["_id"], "count": item["count"]}
            for item in daily_chats
        ],
        "top_topics": [
            {"topic": item["_id"], "count": item["count"]}
            for item in top_topics
        ],
        "avg_response_time": analytics.get("averageResponseTime", 0),
        "faithfulness": analytics.get("faithfulnessScore", 0.95),
        "context_recall": analytics.get("recallScore", 0.94)
    })


@admin_bp.route("/upload-pdf", methods=["POST"])
def upload_pdf():

    # Check file exists
    if "file" not in request.files:
        return {
            "error": "No file uploaded"
        }, 400

    file = request.files["file"]

    # Check filename
    if file.filename == "":
        return {
            "error": "Empty filename"
        }, 400

    # Allow only PDF
    if not file.filename.endswith(".pdf"):
        return {
            "error": "Only PDF files allowed"
        }, 400

    # Secure filename
    filename = secure_filename(file.filename)

    # Unique filename
    unique_filename = f"{uuid.uuid4()}_{filename}"

    # Save path
    save_path = f"data/raw/{unique_filename}"

    # Save file
    file.save(save_path)

    # Store document info
    documents_collection.insert_one({
        "file_name": unique_filename,
        "original_name": filename,
        "uploaded_at": datetime.now(),
        "chunks": 0
    })

    return {
        "message": "PDF Uploaded Successfully",
        "file_name": unique_filename
    }


@admin_bp.route("/delete-pdf/<filename>", methods=["DELETE"])
def delete_pdf(filename):

    path = f"data/raw/{filename}"

    # Delete physical file
    if os.path.exists(path):
        os.remove(path)

    # Delete database entry
    documents_collection.delete_one({
        "file_name": filename
    })

    return {
        "message": "PDF Deleted"
    }


@admin_bp.route("/reindex", methods=["POST"])
def reindex():

    result = ingest_documents()

    return {
        "success": True,
        "message": "Re-index completed",
        "data": result
    }, 200


@admin_bp.route("/settings", methods=["GET", "POST"])
def settings():

    # GET settings
    if request.method == "GET":

        data = prompt_collection.find_one(
            {},
            {"_id": 0}
        )

        return data or {}

    # POST settings
    data = request.json

    prompt_collection.update_one(
        {},
        {
            "$set": data
        },
        upsert=True
    )

    return {
        "message": "Settings Updated"
    }