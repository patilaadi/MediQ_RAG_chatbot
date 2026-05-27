from flask_mail import Message
from app.extension import mail
import os
from dotenv import load_dotenv

load_dotenv()
MAIL_USERNAME = os.getenv("MAIL_USERNAME")



def send_otp_email(receiver_email, otp):

    msg = Message(
        subject="Your OTP Verification Code",
        sender=MAIL_USERNAME,
        recipients=[receiver_email],
    )

    msg.body = f"""
This is MediQ, your AI medical assistant.
Your OTP is: {otp}

This OTP will expire in 15 minutes.
"""

    mail.send(msg)
