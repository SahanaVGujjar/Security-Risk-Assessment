from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.models import QuestionThread, ThreadComment, User
from app.deps import get_current_user, get_session
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/threads", tags=["Threads"])

# Start a new question thread
class ThreadCreate(BaseModel):
    assessment_id: int
    question_text: str
    opened_by: int  # Approver user id

@router.post("/", response_model=QuestionThread)
def create_thread(
    body: ThreadCreate, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != "approver":
        raise HTTPException(status_code=403, detail="Only approvers can create threads")
    thread = QuestionThread(**body.dict())
    session.add(thread)
    session.commit()
    session.refresh(thread)
    return thread

# List threads for an assessment (even if assessment is deleted, threads persist)
@router.get("/")
def list_threads(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    threads = session.exec(select(QuestionThread).where(QuestionThread.assessment_id == assessment_id)).all()
    # Enrich with opener info
    result = []
    for thread in threads:
        opener = session.get(User, thread.opened_by)
        thread_dict = thread.dict()
        thread_dict["opener_email"] = opener.email if opener else "Unknown"
        result.append(thread_dict)
    return result

# Add a comment to a thread
class CommentCreate(BaseModel):
    thread_id: int
    author_id: int
    body: str

@router.post("/comment", response_model=ThreadComment)
def add_comment(
    body: CommentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    comment = ThreadComment(**body.dict())
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

# Get all comments for a thread with author info
@router.get("/{thread_id}/comments")
def get_comments(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    comments = session.exec(select(ThreadComment).where(ThreadComment.thread_id == thread_id)).all()
    # Enrich with author email for display
    result = []
    for comment in comments:
        author = session.get(User, comment.author_id)
        comment_dict = comment.dict()
        comment_dict["author_email"] = author.email if author else "Unknown"
        result.append(comment_dict)
    return result

# Update thread status (end/resolve thread)
@router.post("/{thread_id}/end", status_code=status.HTTP_200_OK)
def end_thread(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """End/close a thread - only approvers can do this"""
    if current_user.role != "approver":
        raise HTTPException(status_code=403, detail="Only approvers can end threads")
    
    thread = session.get(QuestionThread, thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    thread.status = "resolved"
    session.add(thread)
    session.commit()
    session.refresh(thread)
    
    # Enrich with opener info
    opener = session.get(User, thread.opened_by)
    thread_dict = thread.dict()
    thread_dict["opener_email"] = opener.email if opener else "Unknown"
    return thread_dict
