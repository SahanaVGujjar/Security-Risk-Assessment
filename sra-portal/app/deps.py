# app/deps.py
from contextlib import contextmanager
from typing import Generator
from sqlmodel import Session, select
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.database import get_session as get_db_session
from app.models import User
from app.auth import SECRET, ALGO

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_session() -> Generator[Session, None, None]:
    # Use the session generator from database.py
    for session in get_db_session():
        yield session

def get_current_user(token: str = Depends(oauth2_scheme), session=Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGO])
        email = payload.get("sub")
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid")
