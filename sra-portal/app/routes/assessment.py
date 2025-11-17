# app/routes/assessment.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.models import Assessment, AssessmentStatus, User, ScreeningAnswer, QuestionThread, ThreadComment  # Import your SQLModel models
from app.deps import get_current_user, get_session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


router = APIRouter(prefix="/assessments", tags=["Assessments"])


# 1. Create Assessment
class CreateAssessmentRequest(BaseModel):
    title: str
    is_new: bool = True
    approver_user_id: Optional[int] = None
    existing_assessment_id: Optional[int] = None  # If using existing assessment

@router.post("/", response_model=Assessment, status_code=status.HTTP_201_CREATED)
def create_assessment(
    req: CreateAssessmentRequest, 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Create assessment with owner_user_id from current user
    assessment = Assessment(
        title=req.title,
        owner_user_id=current_user.id,
        approver_user_id=req.approver_user_id,
        is_new=req.is_new,
        status=AssessmentStatus.screening
    )
    session.add(assessment)
    session.commit()
    session.refresh(assessment)
    return assessment

# 2. List Assessments with user details
@router.get("/")
def list_assessments(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get assessments with user details
    if current_user.role == "approver":
        assessments = session.exec(select(Assessment)).all()
    else:
        assessments = session.exec(select(Assessment).where(Assessment.owner_user_id == current_user.id)).all()
    
    # Enrich with user details
    result = []
    for assessment in assessments:
        owner = session.get(User, assessment.owner_user_id)
        approver = session.get(User, assessment.approver_user_id) if assessment.approver_user_id else None
        result.append({
            **assessment.dict(),
            "owner_name": owner.email if owner else "Unknown",
            "approver_name": approver.email if approver else None
        })
    return result

# 3. Get Assessment by ID
@router.get("/{id}", response_model=Assessment)
def get_assessment(id: int, session: Session = Depends(get_session)):
    assessment = session.get(Assessment, id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

# 4. Submit PIA Screening Answers
class ScreeningAnswerRequest(BaseModel):
    question: str
    answer: bool
    notes: str = ""

class ScreeningResponse(BaseModel):
    answers: List[ScreeningAnswerRequest]

@router.post("/{id}/screening", status_code=status.HTTP_200_OK)
def submit_screening(
    id: int,
    body: ScreeningResponse,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Accepts a list of answers (yes/no) for PIA screening. If any 'Yes', proceed assessment to 'in_dpia'.
    Stores answers in the database for later access by both System Owners (to view/edit) and Approvers (to review).
    """
    assessment = session.get(Assessment, id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Only system owners can submit screening
    if current_user.role != "owner" or assessment.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assessment owner can submit screening")
    
    # Delete existing answers for this assessment (to allow resubmission)
    existing_answers = session.exec(select(ScreeningAnswer).where(ScreeningAnswer.assessment_id == id)).all()
    for answer in existing_answers:
        session.delete(answer)
    
    # Store new answers
    for item in body.answers:
        answer = ScreeningAnswer(
            assessment_id=id,
            question_text=item.question,
            answer=item.answer,
            notes=item.notes,
            created_at=datetime.utcnow()
        )
        session.add(answer)
    
    # Simple screening gate logic: 
    # - If first question (PI collection) is answered "No", auto-complete (no PI data = no assessment needed)
    # - If any answer is True (yes), start DPIA
    # - Otherwise, await approval
    first_question_text = "Does the system collect any Personal information from individuals?"
    first_answer = next((item for item in body.answers if item.question == first_question_text), None)
    
    if first_answer and not first_answer.answer:
        # First question answered "No" - no PI data, auto-complete
        assessment.status = AssessmentStatus.completed
    elif any(item.answer for item in body.answers):
        assessment.status = AssessmentStatus.in_dpia
    else:
        assessment.status = AssessmentStatus.awaiting_approval
    
    session.commit()
    return {"message": "Screening submitted successfully", "next_status": assessment.status}

# Get screening answers for an assessment
@router.get("/{id}/screening")
def get_screening_answers(
    id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get stored screening answers for an assessment.
    System owners can view their own answers, and approvers can view answers for any assessment."""
    assessment = session.get(Assessment, id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Only system owners can view their own answers, or approvers can view any
    if current_user.role == "owner" and assessment.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only view your own assessment answers")
    
    answers = session.exec(select(ScreeningAnswer).where(ScreeningAnswer.assessment_id == id)).all()
    # Return empty list if no answers exist (not an error)
    if not answers:
        return []
    return [{"question": a.question_text, "answer": a.answer, "notes": a.notes} for a in answers]

# 5. Update assessment status (for approvers)
class UpdateStatusRequest(BaseModel):
    status: str  # "completed" or "red_flag"

@router.post("/{id}/status", status_code=status.HTTP_200_OK)
def update_assessment_status(
    id: int,
    req: UpdateStatusRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.role != "approver":
        raise HTTPException(status_code=403, detail="Only approvers can update assessment status")
    
    assessment = session.get(Assessment, id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if req.status == "completed":
        assessment.status = AssessmentStatus.completed
    elif req.status == "red_flag":
        assessment.status = AssessmentStatus.red_flag
    else:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'completed' or 'red_flag'")
    
    session.commit()
    session.refresh(assessment)
    return assessment

# 6. Get all approvers
@router.get("/approvers/list")
def get_approvers(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    approvers = session.exec(select(User).where(User.role == "approver")).all()
    if not approvers:
        return []  # Return empty list if no approvers found
    # Return as name-email pairs for dropdown
    # Map email to display name (Harry, Jas, Alice) if email matches pattern
    result = []
    for a in approvers:
        email_lower = a.email.lower()
        # Try to extract name from email or use email as name
        display_name = a.email
        if 'harry' in email_lower:
            display_name = "Harry"
        elif 'jas' in email_lower:
            display_name = "Jas"
        elif 'alice' in email_lower:
            display_name = "Alice"
        result.append({"id": a.id, "name": display_name, "email": a.email})
    return result

# 7. Delete Assessment
@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_assessment(
    id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    assessment = session.get(Assessment, id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Only approvers or the owner can delete
    if current_user.role != "approver" and assessment.owner_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You don't have permission to delete this assessment")
    
    # Delete all related data for this assessment:
    # 1. Delete all thread comments (chat history) for threads related to this assessment
    threads = session.exec(select(QuestionThread).where(QuestionThread.assessment_id == id)).all()
    for thread in threads:
        # Delete all comments for this thread
        comments = session.exec(select(ThreadComment).where(ThreadComment.thread_id == thread.id)).all()
        for comment in comments:
            session.delete(comment)
        # Delete the thread itself
        session.delete(thread)
    
    # 2. Delete all screening answers for this assessment
    answers = session.exec(select(ScreeningAnswer).where(ScreeningAnswer.assessment_id == id)).all()
    for answer in answers:
        session.delete(answer)
    
    # 3. Finally, delete the assessment itself
    session.delete(assessment)
    session.commit()
    return {"message": "Assessment and all related data deleted successfully", "id": id}
