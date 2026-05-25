from flask import Blueprint, request, jsonify
from database.schema import (
    admin_collection,
    users_collection
)
from app.utils.jwt_helper import generate_token


auth_bp = Blueprint("auth", __name__)




# ================= REGISTER =================
@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # CHECK USER EXISTS
    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        return jsonify({"success": False, "message": "User already exists"}), 409

    # CREATE USER
    result = users_collection.insert_one(
        {
            "name": name,
            "email": email,
            "password": password,
            "role": "user",
            "picture": "",
        }
    )

    return (
        jsonify(
            {
                "success": True,
                "message": "Registration successful",
                "userId": str(result.inserted_id),
            }
        ),
        201,
    )


# Google Login
@auth_bp.route("/google-login", methods=["POST"])
def google_login():

    data = request.json

    email = data.get("email")
    name = data.get("name")
    picture = data.get("picture")

    # ================= CHECK ADMIN =================
    admin = admin_collection.find_one({"email": email})

    # ================= ADMIN LOGIN =================
    if admin:

        token = generate_token(
            {"id": str(admin["_id"]), "email": admin["email"], "role": "admin"}
        )

        return (
            jsonify(
                {
                    "success": True,
                    "token": token,
                    "user": {
                        "id": str(admin["_id"]),
                        "name": admin.get("name"),
                        "email": admin.get("email"),
                        "picture": admin.get("picture"),
                        "role": "admin",
                    },
                }
            ),
            200,
        )

    # ================= NORMAL USER =================
    existing_user = users_collection.find_one({"email": email})

    if not existing_user:

        users_collection.insert_one(
            {"name": name, "email": email, "picture": picture, "role": "user"}
        )

        existing_user = users_collection.find_one({"email": email})

    token = generate_token(
        {
            "id": str(existing_user["_id"]),
            "email": existing_user["email"],
            "role": "user",
        }
    )

    return (
        jsonify(
            {
                "success": True,
                "token": token,
                "user": {
                    "id": str(existing_user["_id"]),
                    "name": existing_user.get("name"),
                    "email": existing_user.get("email"),
                    "picture": existing_user.get("picture"),
                    "role": "user",
                },
            }
        ),
        200,
    )


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





# ================= LOGIN =================
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    # ================= ADMIN LOGIN =================
    admin = admin_collection.find_one({"email": email, "password": password})

    if admin:

        token = generate_token(
            {"id": str(admin["_id"]), "email": admin["email"], "role": "admin"}
        )

        return (
            jsonify(
                {
                    "success": True,
                    "token": token,
                    "user": {
                        "id": str(admin["_id"]),
                        "name": admin["name"],
                        "email": admin["email"],
                        "picture": admin.get("picture"),
                        "role": "admin",
                    },
                }
            ),
            200,
        )

    # ================= USER LOGIN =================
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    # PASSWORD CHECK
    if user["password"] != password:
        return jsonify({"success": False, "message": "Invalid password"}), 401

    # JWT
    token = generate_token(
        {"id": str(user["_id"]), "email": user["email"], "role": user["role"]}
    )

    return (
        jsonify(
            {
                "success": True,
                "token": token,
                "user": {
                    "id": str(user["_id"]),
                    "name": user["name"],
                    "email": user["email"],
                    "picture": user.get("picture"),
                    "role": user["role"],
                },
            }
        ),
        200,
    )
