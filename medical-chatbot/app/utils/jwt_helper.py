import jwt
import os
from datetime import datetime, timedelta, timezone

SECRET = os.getenv("JWT_SECRET")


def generate_token(data):

    payload = {
        **data,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }

    return jwt.encode(
        payload,
        SECRET,
        algorithm="HS256"
    )