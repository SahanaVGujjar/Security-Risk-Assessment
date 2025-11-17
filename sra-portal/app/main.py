# app/main.py
from sqlmodel import select
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from app.auth import create_token, hash_password, verify_password
from app.models import User
from app.deps import get_current_user, get_session
from .routes.assessment import router as assessment_router  # if main.py is inside app/
from pydantic import BaseModel
from app.routes.threads import router as threads_router
app = FastAPI(title="Risk Assessments")


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
# CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include routers AFTER app is created
app.include_router(assessment_router)
app.include_router(threads_router)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends(), session=Depends(get_session)):
    try:
        # Frontend sends SHA-256 hashed password, we need to verify it against stored bcrypt hash
        result = session.exec(select(User).where(User.email == form.username))
        user = result.first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # The password from frontend is already SHA-256 hashed
        # Stored hash is: bcrypt(SHA-256(plain_password))
        # So we verify the received SHA-256 hash against the stored bcrypt hash
        password_hash_from_frontend = form.password  # This is SHA-256 hash (64 hex chars)
        stored_hash = user.getPasswordHash()
        
        # verify_password from passlib will:
        # 1. Extract salt from stored_hash (bcrypt hash)
        # 2. Hash password_hash_from_frontend with that salt
        # 3. Compare result with stored_hash
        # This works because bcrypt stores the salt in the hash itself
        if not verify_password(password_hash_from_frontend, stored_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {"access_token": create_token(user.email, user.role), "token_type": "bearer", "role": user.role}
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during login")

@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "role": current_user.role}

@app.post("/auth/register")
def register(req: RegisterRequest, session=Depends(get_session)):
    if req.role not in ("owner", "approver"):
        raise HTTPException(status_code=400, detail="Invalid role")
    # Frontend sends SHA-256 hashed password (64 hex chars)
    # SHA-256 produces 64 hex characters, but allow some flexibility for edge cases
    if len(req.password) < 60 or len(req.password) > 70:
        raise HTTPException(status_code=400, detail=f"Invalid password format. Expected SHA-256 hash (64 chars), got {len(req.password)}")
    existing = session.exec(select(User).where(User.email == req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email taken")
    # Hash the SHA-256 hash with bcrypt before storing
    # This way: stored = bcrypt(SHA-256(plain_password))
    u = User(email=req.email, password_hash=hash_password(req.password), role=req.role)
    session.add(u); session.commit(); session.refresh(u)
    return {"id": u.id, "email": u.email, "role": u.role}

