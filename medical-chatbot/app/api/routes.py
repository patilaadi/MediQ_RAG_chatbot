import jwt
from flask import Blueprint, request, jsonify
from app.database.schema import users_collection as users, contact_requests
from bson import ObjectId
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import uuid
from app.database.schema import documents_collection
from app.services.llm_service import analyze_medical_report

# Blueprint
routes = Blueprint("routes", __name__)


load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")


# =========================
# UPDATE PROFILE API
# =========================
@routes.route("/users/profile", methods=["PUT"])
def update_profile():

    try:

        # ================= TOKEN =================
        auth_header = request.headers.get("Authorization")

        if not auth_header:

            return jsonify({"success": False, "message": "Token Missing"}), 401

        token = auth_header.split(" ")[1]

        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

        user_id = decoded["id"]

        # ================= FORM DATA =================
        name = request.form.get("name")
        email = request.form.get("email")

        # ================= FILE =================
        picture = request.files.get("profile")

        print(request.files)

        # ================= EXISTING USER =================
        existing_user = users.find_one({"_id": ObjectId(user_id)})

        picture_url = existing_user.get("picture", "")

        # ================= SAVE IMAGE =================
        if picture:

            os.makedirs("uploads", exist_ok=True)

            filename = f"{uuid.uuid4()}_{secure_filename(picture.filename)}"

            save_path = os.path.join("uploads", filename)

            picture.save(save_path)

            picture_url = f"uploads/{filename}"

        # ================= UPDATE DB =================
        users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "name": name,
                    "email": email,
                    "picture": picture_url,
                }
            },
        )

        # ================= UPDATED USER =================
        updated_user = users.find_one({"_id": ObjectId(user_id)})

        updated_user["_id"] = str(updated_user["_id"])

        return jsonify(
            {
                "success": True,
                "message": "Profile Updated",
                "user": updated_user,
            }
        )

    except Exception as e:

        print(e)

        return (
            jsonify(
                {
                    "success": False,
                    "message": str(e),
                }
            ),
            500,
        )


@routes.route("/upload-report", methods=["POST"])
def upload_report():
    """Patient-facing PDF upload endpoint.

    Accepts multipart/form-data with `file`. Requires Authorization header (Bearer JWT).
    Optional form field `analyze` (true/false) to run immediate analysis and return results.
    """
    try:
        # Auth
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"success": False, "message": "Token Missing"}), 401

        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = decoded["id"]

        if "file" not in request.files:
            return jsonify({"success": False, "message": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"success": False, "message": "Empty filename"}), 400

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"success": False, "message": "Only PDF files allowed"}), 400

        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        save_path = f"data/raw/{unique_filename}"
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        file.save(save_path)

        doc_record = {
            "file_name": unique_filename,
            "original_name": filename,
            "uploaded_at": datetime.utcnow(),
            "user_id": ObjectId(user_id),
            "chunks": 0,
        }
        documents_collection.insert_one(doc_record)

        # Optionally extract text and analyze
        analyze = request.form.get("analyze", "false").lower() == "true"
        analysis_result = None
        if analyze:
            # Try to extract text using PyPDF2 if available
            try:
                import importlib

                pdf_mod = importlib.import_module("PyPDF2")
                PdfReader = getattr(pdf_mod, "PdfReader", None)
                if PdfReader:
                    reader = PdfReader(save_path)
                    text_pages = []
                    for page in reader.pages:
                        try:
                            text_pages.append(page.extract_text() or "")
                        except Exception:
                            text_pages.append("")
                    full_text = "\n".join(text_pages)
                else:
                    full_text = ""
            except Exception:
                full_text = ""

            if full_text:
                analysis_result = analyze_medical_report(full_text)

        response = {"success": True, "file_name": unique_filename}
        if analysis_result is not None:
            response["analysis"] = analysis_result

        return jsonify(response)

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@routes.route("/users/change-password", methods=["POST"])
def change_password():
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"success": False, "message": "Token Missing"}), 401

        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = decoded["id"]

        data = request.json or {}
        current = data.get("current_password")
        new = data.get("new_password")

        if not current or not new:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "current_password and new_password required",
                    }
                ),
                400,
            )

        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Plaintext password check (current project stores plaintext)
        if user.get("password") != current:
            return (
                jsonify({"success": False, "message": "Invalid current password"}),
                401,
            )

        users.update_one({"_id": ObjectId(user_id)}, {"$set": {"password": new}})

        return jsonify({"success": True, "message": "Password changed"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@routes.route("/contact", methods=["POST"])
def submit_contact():
    try:
        data = request.json or {}
        first_name = (data.get("firstName") or "").strip()
        last_name = (data.get("lastName") or "").strip()
        email = (data.get("email") or "").strip()
        message = (data.get("message") or "").strip()

        if not first_name or not last_name or not email or not message:
            return (
                jsonify({"success": False, "message": "All fields are required."}),
                400,
            )

        if "@" not in email or "." not in email:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Please provide a valid email address.",
                    }
                ),
                400,
            )

        contact_requests.insert_one(
            {
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
                "message": message,
                "status": "new",
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow(),
            }
        )

        return jsonify({"success": True, "message": "Contact request saved."}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
