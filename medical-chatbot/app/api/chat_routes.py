from flask import Blueprint, jsonify, request
from datetime import datetime, timezone
from bson import ObjectId
from app.database.schema import chat_threads
from app.database.schema import chat_messages

from app.services.rag_pipeline import build_rag_chain
from app.core.constants import INDEX_NAME

from app.utils.helper import get_user_from_token

chat_bp = Blueprint("chat", __name__)

rag_chain = build_rag_chain(INDEX_NAME)


# =========================
# CHAT API
# =========================

@chat_bp.route("/threads/create", methods=["POST"])
def create_thread():
    data = request.json

    thread = {
        "userId": ObjectId(data["userId"]),
        "title": "New Chat",
        "pinned": False,
        "isDeleted": False,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
        "lastMessageAt": datetime.now(timezone.utc)
    }

    result = chat_threads.insert_one(thread)

    return {
        "threadId": str(result.inserted_id),
        "message": "Thread created"
    }


# =========================
# MESSAGE API
# =========================

@chat_bp.route("/message", methods=["POST"])
def send_message():

    try:

        data = request.json
        print(data)

        thread_id = ObjectId(data["threadId"])
        print("Thread ID:", thread_id)
        user_id = ObjectId(data["userId"])
        user_msg = data["msg"]

        # 1. Save user message
        chat_messages.insert_one({
            "threadId": thread_id,
            "userId": user_id,
            "role": "user",
            "content": user_msg,
            "createdAt": datetime.now(timezone.utc)
        })

        # Auto generate title from first message
        thread = chat_threads.find_one({
            "_id": thread_id
        })
        print("Thread Found:", thread)

        if thread and thread["title"] == "New Chat":

            title = user_msg[:30]
            print("Generated Title:", title)

            chat_threads.update_one(
                {"_id": thread_id},
                {
                    "$set": {
                        "title": title
                    }
                }
            )
            print("Thread updated with new title:", title)

            # 🔥 RE-FETCH UPDATED THREAD
            updated_thread = chat_threads.find_one({"_id": thread_id})

        # 2. Get AI response
        start = datetime.now(timezone.utc)

        ai_response = rag_chain.invoke({
            "input": user_msg
        })

        end = datetime.now(timezone.utc)

        response_time = (
            end - start
        ).total_seconds()

        # FIX FOR RESPONSE FORMAT
        if isinstance(ai_response, dict):

            answer = ai_response.get(
                "answer",
                str(ai_response)
            )

        else:

            answer = str(ai_response)

        # 3. Save assistant message
        chat_messages.insert_one({
            "threadId": thread_id,
            "userId": user_id,
            "role": "assistant",
            "content": answer,
            "responseTime": response_time,
            "createdAt": datetime.now(timezone.utc)
        })

        # 4. Update thread last activity
        chat_threads.update_one(
            {"_id": thread_id},
            {
                "$set": {
                    "lastMessageAt":
                        datetime.now(
                            timezone.utc
                        )
                }
            }
        )

        return jsonify(
            {
                "success": True,
                "answer": answer,
                "title": updated_thread["title"],  # ✅ FIXED
                "threadId": str(thread_id),
                "responseTime": response_time,
            }
        )

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =========================
# GET THREADS & MESSAGES
# =========================
@chat_bp.route("/threads/<thread_id>", methods=["GET"])
def get_messages(thread_id):

    messages = chat_messages.find(
        {"threadId": ObjectId(thread_id)}
    ).sort("createdAt", 1)

    return {
        "messages": [
            {
                "role": m["role"],
                "content": m["content"],
                "createdAt": m["createdAt"]
            } for m in messages
        ]
    }


# =========================
# GET THREAD
# =========================
@chat_bp.route("/threads/<user_id>", methods=["GET"])
def get_threads(user_id):

    threads = chat_threads.find({
        "userId": ObjectId(user_id),
        "isDeleted": False
    }).sort("lastMessageAt", -1)

    all_threads = []

    for thread in threads:

        all_threads.append({
            "id": str(thread["_id"]),
            "title": thread.get("title", "New Chat")
        })

    return {
        "threads": all_threads
    }

# =========================
# DELETE THREAD API
# =========================
@chat_bp.route("/threads/delete/<thread_id>", methods=["DELETE"])
def delete_thread(thread_id):

    chat_threads.update_one(
        {"_id": ObjectId(thread_id)},
        {"$set": {"isDeleted": True}}
    )

    return {"message": "Deleted"}
