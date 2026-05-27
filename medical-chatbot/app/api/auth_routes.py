import random
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from database.schema import admin_collection, users_collection, otp_collection
from app.utils.jwt_helper import generate_token
from app.utils.send_mail import send_otp_email
import os


auth_bp = Blueprint("auth", __name__)


def generate_otp():
    return f"{random.randint(100000, 999999)}"


def find_valid_otp(email, code, purpose):
    now = datetime.now(timezone.utc)
    return otp_collection.find_one(
        {
            "email": email,
            "code": code,
            "purpose": purpose,
            "expiresAt": {"$gt": now},
        }
    )


# ================= SEND OTP =================
@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():

    data = request.get_json(silent=True)

    email = data.get("email")
    purpose = data.get("purpose")

    if not email or purpose not in {"register", "forgot-password"}:
        return jsonify({"success": False, "message": "email and purpose required"}), 400

    code = generate_otp()

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    otp_collection.insert_one(
        {
            "email": email,
            "code": code,
            "purpose": purpose,
            "verified": False,
            "expiresAt": expires_at,
            "createdAt": datetime.now(timezone.utc),
        }
    )

    # SEND OTP EMAIL
    send_otp_email(email, code)

    return jsonify({"success": True, "message": "OTP sent successfully"}), 200


@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():

    print(request.content_type)

    data = request.get_json(force=True)

    print(data)

    email = data.get("email")
    code = data.get("code")
    purpose = data.get("purpose")

    if not email or not code or purpose not in {"register", "forgot-password"}:

        return (
            jsonify({"success": False, "message": "email, code and purpose required"}),
            400,
        )

    otp_record = find_valid_otp(email, code, purpose)

    if not otp_record:

        return jsonify({"success": False, "message": "Invalid or expired OTP"}), 400

    otp_collection.update_one({"_id": otp_record["_id"]}, {"$set": {"verified": True}})
    otp_collection.delete_many(
        {"email": email, "purpose": purpose, "expiresAt": {"$gt": datetime.now(timezone.utc)}}
    )

    return jsonify({"success": True, "message": "OTP verified"}), 200


# ================= REGISTER =================
@auth_bp.route("/register", methods=["POST"])
def register():

    # FORM DATA
    data = request.form

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # FILE
    picture = request.files.get("profile")

    if not name or not email or not password:

        return (
            jsonify({"success": False, "message": "name, email and password required"}),
            400,
        )

    existing_user = users_collection.find_one({"email": email})

    if existing_user:

        return jsonify({"success": False, "message": "User already exists"}), 409

    picture_url = ""

    # SAVE IMAGE
    if picture:

        filename = picture.filename

        upload_path = os.path.join("uploads", filename)

        picture.save(upload_path)

        picture_url = upload_path

    result = users_collection.insert_one(
        {
            "name": name,
            "email": email,
            "password": password,
            "picture": picture_url,
            "role": "user",
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
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



@auth_bp.route("/forgot-password/reset", methods=["POST"])
def forgot_password_reset():
    data = request.get_json(silent=True)
    email = data.get("email")
    otp_code = data.get("otp")
    new_password = data.get("new_password")

    if not email or not otp_code or not new_password:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "email, otp and new_password are required",
                }
            ),
            400,
        )

    otp_record = find_valid_otp(email, otp_code, "forgot-password")
    if not otp_record:
        return jsonify({"success": False, "message": "Invalid or expired OTP"}), 400

    otp_collection.update_one({"_id": otp_record["_id"]}, {"$set": {"verified": True}})

    update_result = users_collection.update_one(
        {"email": email}, {"$set": {"password": new_password}}
    )
    if update_result.matched_count == 0:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({"success": True, "message": "Password updated"}), 200


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

    user = users_collection.find_one({"email": email})

    if not user:

        return jsonify({"success": False, "message": "User not found"}), 404

    return (
        jsonify(
            {
                "success": True,
                "user": {
                    "id": str(user["_id"]),
                    "name": user.get("name"),
                    "email": user.get("email"),
                    "picture": user.get("picture"),
                    "role": user.get("role"),
                },
            }
        ),
        200,
    )


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
