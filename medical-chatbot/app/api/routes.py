import jwt
from flask import Blueprint, request, jsonify
from app.database.schema import users_collection as users     
from bson import ObjectId
from dotenv import load_dotenv
import os


# Blueprint
routes = Blueprint(
    "routes",
    __name__
)


load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
# =========================
# UPDATE PROFILE API
# =========================
@routes.route(
    "/users/profile",
    methods=["PUT"]
)

def update_profile():

    try:

        # Get Token
        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:

            return jsonify({
                "success": False,
                "message": "Token Missing"
            }), 401

        token = auth_header.split(" ")[1]

        # Decode JWT
        decoded = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )
        print(decoded)
        
        user_id = decoded["id"]

        # Get Form Data
        data = request.json

        name = data.get("name")
        email = data.get("email")
        picture = data.get("picture")

        # Update MongoDB
        users.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "name": name,
                    "email": email,
                    "picture": picture,
                }
            }
        )

        # Get Updated User
        updated_user = users.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        # Convert ObjectId to String
        updated_user["_id"] = str(
            updated_user["_id"]
        )

        return jsonify({
            "success": True,
            "message":
                "Profile Updated",
            "user": updated_user,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500