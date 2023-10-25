import random

from mailjet_rest import Client
from passlib.context import CryptContext

from app.core.config import MAILJET_API_KEY, MAILJET_SECRET_KEY

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_code_password_recovery():
    return "".join([str(random.randint(0, 9)) for _ in range(6)])


def send_mail_forgot_password(email, username, code):
    mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_SECRET_KEY), version="v3.1")
    data = {
        "Messages": [
            {
                "From": {"Email": "no.area.reply@gmail.com", "Name": "Area-noreply"},
                "To": [{"Email": email, "Name": username}],
                "Subject": "Area - Forgot password",
                "TextPart": "Dear, user use this code to create a new password :"
                + code,
            }
        ]
    }
    mailjet.send.create(data=data)
