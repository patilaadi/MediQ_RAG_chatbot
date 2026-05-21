from flask import Blueprint, request, jsonify
from database.schema import (
    admin_collection,
    users_collection
)
from app.utils.jwt_helper import generate_token


auth_bp = Blueprint("auth", __name__)

# Google Login
@auth_bp.route("/google-login", methods=["POST"])
def google_login():

    data = request.json

    email = data.get("email")
    name = data.get("name")
    picture = data.get("picture")

    admin = admin_collection.find_one({
        "email": email
    })

    role = "user"

    if admin:
        role = "admin"

    existing_user = users_collection.find_one({
        "email": email
    })

    if not existing_user:

        users_collection.insert_one({
            "name": name,
            "email": email,
            "picture": picture,
            "role": role
        })


    # ✅ CREATE JWT USING HELPER
    token = generate_token({
        "id": str(existing_user["_id"]),   # 🔥 REQUIRED
        "email": existing_user["email"],
        "role": existing_user["role"]
    })

    print(f"Generated JWT: {token}")


    return jsonify({
    "success": True,
    "token": token,
    "role": role,
    "user": {
        "id": str(existing_user["_id"]),
        "name": name,
        "email": email,
        "picture": picture
    }
    }), 200


# Get Current User
@auth_bp.route("/user/<email>", methods=["GET"])
def get_user(email):

    user = users_collection.find_one({
        "email": email
    })

    if not user:

        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    return jsonify({
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "picture": user.get("picture"),
            "role": user.get("role")
        }
    }), 200