from datetime import datetime, timedelta
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

SECRET = "change-me"
ALGO = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_token(email: str, role:str, minutes: int = 60):
    payload = {"sub": email, "role": role, "exp": datetime.utcnow() + timedelta(minutes=minutes)}
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def verify_password(plain, hash_):
    return pwd_context.verify(plain, hash_)

def hash_password(password: str) -> str:
    # optional safety guard for bcrypt limit
    if len(password) > 72:
        raise ValueError("Password must be <= 72 characters")
    return pwd_context.hash(password)
