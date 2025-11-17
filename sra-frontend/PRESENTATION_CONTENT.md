# Security Risk Assessment Portal - Presentation Content

## Division of Work (10 minutes total)

### Person 1: Introduction, Background, Motivation (3 minutes)
- Introduction (1 min)
- Background (1 min)
- Motivation (1 min)

### Person 2: Problem Statement, Method (4 minutes)
- Problem Statement/Formulation (1.5 min)
- Method - System Architecture & Features (2.5 min)

### Person 3: Experiments, Conclusions (3 minutes)
- Preliminary Experiments/Demo (2 min)
- Conclusions & Future Work (1 min)

---

## SLIDE 1: Title Slide
**Security Risk Assessment Portal**
A Privacy Impact Assessment (PIA) Management System

Team Members:
- [Name 1]
- [Name 2]
- [Name 3]

Date: [Date]

---

## SLIDE 2: Introduction (Person 1)
**What is a Security Risk Assessment Portal?**

- **Purpose**: Automated platform for managing Privacy Impact Assessments (PIA) and Data Protection Impact Assessments (DPIA)
- **Key Functionality**:
  - System Owners submit detailed assessments about data collection and processing
  - Approvers review submissions and request clarifications
  - Automated screening to determine assessment requirements
  - Comprehensive audit trail of all responses and decisions

**Why It Matters**:
- Ensures GDPR/DPIA compliance
- Streamlines the assessment workflow
- Maintains detailed records for regulatory purposes

---

## SLIDE 3: Background (Person 1)
**Current State & Regulatory Requirements**

**Regulatory Landscape**:
- GDPR (General Data Protection Regulation) requires DPIA for high-risk processing
- Organizations must assess privacy risks before processing personal data
- Need for systematic documentation and review processes

**Existing Challenges**:
- Manual assessment processes are time-consuming
- Lack of standardized questionnaires
- Difficult to track assessment status and history
- No centralized system for approvers to review multiple assessments

**Industry Need**:
- Similar to OneTrust, but tailored for organizational needs
- Customizable screening questions
- Role-based access control
- Real-time collaboration between owners and approvers

---

## SLIDE 4: Motivation (Person 1)
**Why Build This System?**

**Business Drivers**:
1. **Compliance**: Meet GDPR/DPIA regulatory requirements
2. **Efficiency**: Automate manual assessment workflows
3. **Transparency**: Maintain clear audit trails
4. **Collaboration**: Enable seamless communication between stakeholders
5. **Scalability**: Handle multiple assessments simultaneously

**Technical Motivation**:
- Modern web application using React and FastAPI
- Secure authentication and authorization
- Real-time chat for clarifications
- Responsive design for accessibility

**Impact**:
- Reduces assessment processing time
- Improves compliance tracking
- Enhances collaboration between teams

---

## SLIDE 5: Problem Statement (Person 2)
**Core Problems Addressed**

**Problem 1: Manual Assessment Process**
- Current process relies on email/paper-based submissions
- No standardized format for assessments
- Difficult to track status and history

**Problem 2: Lack of Collaboration**
- No direct communication channel between System Owners and Approvers
- Clarifications require multiple email exchanges
- No visibility into assessment progress

**Problem 3: Inefficient Screening**
- Manual determination of whether full assessment is needed
- No automated routing based on answers
- Risk of missing critical assessments

**Problem 4: Data Management**
- Responses scattered across different systems
- No centralized repository for historical assessments
- Difficult to generate compliance reports

---

## SLIDE 6: Problem Formulation (Person 2)
**System Requirements**

**Functional Requirements**:
1. **User Management**: Role-based access (System Owners, Approvers)
2. **Assessment Creation**: System Owners can create and submit assessments
3. **Screening Questionnaire**: 30+ questions covering data collection, processing, storage, and compliance
4. **Review Process**: Approvers can review, request clarifications, and approve/reject
5. **Chat System**: Real-time communication for clarifications
6. **Status Management**: Track assessment lifecycle (screening → in_dpia → awaiting_approval → completed)

**Non-Functional Requirements**:
- Security: Authentication, authorization, data encryption
- Usability: Intuitive UI, responsive design
- Performance: Fast response times, scalable architecture
- Reliability: Data persistence, error handling

---

## SLIDE 7: Method - System Architecture (Person 2)
**Technology Stack**

**Frontend**:
- React.js with Material-UI (MUI)
- React Router for navigation
- Context API for authentication
- Responsive design for all devices

**Backend**:
- FastAPI (Python) - RESTful API
- SQLModel for database ORM
- SQLite database (can scale to PostgreSQL)
- JWT authentication

**Key Features**:
- RESTful API architecture
- Role-based access control
- Real-time chat functionality
- Pagination for large questionnaires
- Conditional question logic

---

## SLIDE 8: Method - Core Features (Person 2)
**System Capabilities**

**1. Intelligent Screening**:
- First question determines if assessment is needed
- Auto-completion if no personal data collected
- Conditional question flow based on answers

**2. Comprehensive Questionnaire**:
- 30+ questions across 5 pages
- Multiple question types: Boolean, Text, Multiselect, Dropdown
- Covers: Data types, subjects, purposes, storage, transfers, security

**3. Collaboration Tools**:
- Thread-based chat system
- Multiple clarifications per question
- Edit and resubmit functionality
- Status tracking (Open/Resolved threads)

**4. Assessment Management**:
- Approvers can view all assessments
- Status updates (Completed, Red Flag)
- Complete audit trail
- Response history preservation

---

## SLIDE 9: Method - User Workflows (Person 2)
**System Workflows**

**System Owner Workflow**:
1. Create new assessment
2. Answer screening questions (paginated)
3. Submit assessment
4. Receive clarification requests
5. Edit responses and resubmit
6. View final status

**Approver Workflow**:
1. View all submitted assessments
2. Review responses
3. Raise clarification questions (multiple questions)
4. Review responses and chat history
5. Mark as Completed or Red Flag
6. End discussion threads

**Automated Features**:
- Auto-completion for "No PI data" scenarios
- Status transitions based on answers
- Conditional question display

---

## SLIDE 10: Preliminary Experiments - System Demo (Person 3)
**Key Functionalities Demonstrated**

**Demo Flow**:
1. **Login & Dashboard**: Role-based access, assessment listing
2. **Create Assessment**: System Owner creates new assessment
3. **Screening Process**: 
   - Answer first question (Yes/No)
   - If "No" → Auto-completed
   - If "Yes" → Continue with 30+ questions
4. **Review Process**: Approver views assessment
5. **Clarification**: Approver raises questions on multiple questions
6. **Response**: System Owner edits and responds
7. **Completion**: Approver marks as completed

**Technical Highlights**:
- Real-time updates
- Persistent data storage
- Multi-page questionnaire
- Thread-based communication

---

## SLIDE 11: Preliminary Experiments - Results (Person 3)
**System Performance & Usability**

**Performance Metrics**:
- Fast page load times (< 2 seconds)
- Smooth pagination between question pages
- Efficient API responses
- Real-time chat updates

**User Experience**:
- Intuitive navigation
- Clear visual indicators (orange borders for clarifications)
- Responsive design (works on mobile/tablet)
- Comprehensive error handling

**Data Management**:
- All responses stored and retrievable
- Complete audit trail
- Thread history preserved
- Status tracking accurate

**Challenges Addressed**:
- ✅ Automated screening
- ✅ Standardized questionnaire
- ✅ Centralized repository
- ✅ Real-time collaboration

---

## SLIDE 12: Conclusions (Person 3)
**Summary & Future Work**

**Achievements**:
- ✅ Fully functional SRA Portal
- ✅ Role-based access control
- ✅ Comprehensive screening questionnaire
- ✅ Real-time collaboration features
- ✅ Complete audit trail

**Key Contributions**:
- **Person 1**: Frontend UI/UX, Authentication, Dashboard
- **Person 2**: Backend API, Database Design, Question Logic
- **Person 3**: Chat System, Status Management, Testing

**Future Enhancements**:
1. **Advanced Analytics**: Dashboard with assessment statistics
2. **Export Functionality**: PDF/Excel reports
3. **Email Notifications**: Automated alerts for status changes
4. **Multi-tenant Support**: Organization-level isolation
5. **Integration**: Connect with other compliance tools
6. **AI Assistance**: Automated risk scoring

**Impact**:
- Streamlines compliance processes
- Improves collaboration efficiency
- Ensures regulatory compliance
- Scalable for organizational growth

---

## SLIDE 13: Thank You
**Questions?**

**Contact Information**:
- [Email addresses]
- [GitHub Repository]

**Demo Available**: [If applicable]

Thank you for your attention!

