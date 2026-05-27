from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
from app.api.auth_routes import auth_bp
from app.api.chat_routes import chat_bp
from app.api.admin_routes import admin_bp
from app.api.report_routes import report_bp
from api.routes import routes
import app.database.schema
import flask_mail
from app.extension import mail
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")

# INIT MAIL
mail.init_app(app)


CORS(app, supports_credentials=True)
app.register_blueprint(routes, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(chat_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(report_bp, url_prefix="/api")


@app.route("/")
def home():
    return render_template("chat.html")


@app.route("/uploads/<filename>")
def uploaded_file(filename):

    return send_from_directory("uploads", filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
