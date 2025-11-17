from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

class Role(str, Enum):
    owner = "owner"
    approver = "approver"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    role: Role = Field(default=Role.owner)

    def getPasswordHash(self):
        return self.password_hash

class AssessmentStatus(str, Enum):
    screening = "screening"
    in_dpia = "in_dpia"
    awaiting_approval = "awaiting_approval"
    approved = "approved"
    changes_requested = "changes_requested"
    completed = "completed"
    red_flag = "red_flag"  # Taken over by internal team

class Assessment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    owner_user_id: int = Field(foreign_key="user.id")
    approver_user_id: Optional[int] = Field(default=None, foreign_key="user.id")  # Assigned approver
    status: AssessmentStatus = Field(default=AssessmentStatus.screening, index=True)
    is_new: bool = Field(default=True)  # New assessment or existing
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuestionThread(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assessment_id: int = Field(index=True)
    question_text: str
    opened_by: int  # Approver user id
    status: str = Field(default="open", index=True)  # open/resolved
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ThreadComment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    thread_id: int = Field(index=True)
    author_id: int
    body: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ScreeningAnswer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assessment_id: int = Field(index=True)
    question_text: str
    answer: bool
    notes: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None