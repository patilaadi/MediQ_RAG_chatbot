from flask import Flask, render_template
from flask_cors import CORS
from app.api.auth_routes import auth_bp
from app.api.chat_routes import chat_bp
from app.api.admin_routes import admin_bp
from api.routes import routes
import app.database.schema

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.register_blueprint(routes, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(chat_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/admin")


@app.route("/")
def home():
    return render_template("chat.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)