# Security Risk Assessment Portal

A comprehensive web-based platform for managing GDPR-compliant Data Protection Impact Assessments (DPIA) with automated screening questionnaires and real-time collaboration between System Owners and Approvers.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Contributing](#contributing)

## 🎯 Overview

The Security Risk Assessment Portal is a full-stack application designed to streamline Privacy Impact Assessments (PIA) and Data Protection Impact Assessments (DPIA) in compliance with GDPR regulations. The system enables:

- **System Owners** to create and submit detailed assessments
- **Approvers** to review submissions and request clarifications
- **Automated screening** to determine if a full assessment is required
- **Real-time collaboration** through threaded discussions
- **Complete audit trail** of all responses and decisions

## ✨ Features

- ✅ **Role-Based Access Control**: Separate interfaces for System Owners and Approvers
- ✅ **Comprehensive Questionnaire**: 30+ questions across 5 pages covering all GDPR requirements
- ✅ **Intelligent Screening**: Auto-completion if no personal data is collected
- ✅ **Conditional Question Flow**: Questions appear based on previous answers
- ✅ **Real-Time Chat**: Thread-based communication for clarifications
- ✅ **Multi-Question Clarifications**: Approvers can raise questions on multiple questions simultaneously
- ✅ **Edit & Resubmit**: System Owners can edit responses and resubmit assessments
- ✅ **Status Management**: Track assessment lifecycle (screening → in_dpia → awaiting_approval → completed)
- ✅ **Secure Authentication**: SHA-256 frontend hashing + bcrypt backend hashing
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠 Technology Stack

### Frontend
- **React.js 19.2.0**: UI framework
- **Material-UI (MUI) 7.3.5**: Component library
- **React Router DOM 7.9.6**: Navigation
- **Vite 7.2.2**: Build tool and dev server

### Backend
- **FastAPI**: Python web framework
- **SQLModel**: ORM for database operations
- **SQLite**: Database (can be upgraded to PostgreSQL)
- **JWT**: Authentication tokens
- **Passlib (bcrypt)**: Password hashing

## 📁 Project Structure

```
Security-Risk-Assessment/
│
├── sra-frontend/                    # Frontend React Application
│   ├── public/
│   │   └── vite.svg                 # Vite logo
│   │
│   ├── src/
│   │   ├── api.js                   # API client functions for backend communication
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── App.css                  # Global app styles
│   │   ├── main.jsx                 # React entry point
│   │   ├── index.css                # Global CSS styles
│   │   │
│   │   ├── assets/
│   │   │   └── react.svg            # React logo
│   │   │
│   │   ├── components/              # Reusable React components
│   │   │   ├── ChatDrawer.jsx       # Side drawer for viewing/responding to threads
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authentication
│   │   │   └── RaiseQuestionDialog.jsx # Dialog for approvers to raise questions
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Authentication context provider
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx            # User login page
│   │   │   ├── SignUp.jsx            # User registration page
│   │   │   ├── Dashboard.jsx         # Main dashboard showing all assessments
│   │   │   ├── LaunchAssessment.jsx  # Page to create new assessments
│   │   │   ├── Screening.jsx         # Main screening questionnaire page (30+ questions)
│   │   │   └── AssessmentEditor.jsx  # Assessment editing page
│   │   │
│   │   └── utils/
│   │       └── crypto.js             # Password hashing utility (SHA-256)
│   │
│   ├── package.json                 # Node.js dependencies and scripts
│   ├── package-lock.json            # Locked dependency versions
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # HTML entry point
│   └── README.md                    # Frontend documentation
│
└── sra-portal/                      # Backend FastAPI Application
    ├── app/
    │   ├── __init__.py              # Package initialization
    │   ├── main.py                  # FastAPI app initialization and auth routes
    │   ├── models.py                # SQLModel database models (User, Assessment, etc.)
    │   ├── database.py              # Database connection and table creation
    │   ├── auth.py                  # Authentication utilities (JWT, bcrypt)
    │   ├── deps.py                  # FastAPI dependencies (get_current_user, get_session)
    │   │
    │   └── routes/                  # API route handlers
    │       ├── assessment.py        # Assessment CRUD and screening endpoints
    │       └── threads.py           # Thread and comment management endpoints
    │
    ├── app.db                       # SQLite database file
    ├── run_server.py                # Server startup script
    └── requirements.txt             # Python dependencies (if exists)
```

## 📝 File Descriptions

### Frontend Files

#### Core Application Files
- **`src/main.jsx`**: React application entry point, renders the App component
- **`src/App.jsx`**: Main application component defining all routes and navigation
- **`src/App.css`**: Global application styles
- **`src/index.css`**: Base CSS styles and resets
- **`index.html`**: HTML template for the React application

#### API & Utilities
- **`src/api.js`**: Centralized API client with functions for:
  - Authentication (login, register, getCurrentUser)
  - Assessment management (create, list, delete, update status)
  - Screening answers (submit, get)
  - Thread management (create, get, add comments, end threads)
- **`src/utils/crypto.js`**: Password hashing utility using Web Crypto API (SHA-256)

#### Authentication
- **`src/contexts/AuthContext.jsx`**: React context providing authentication state and methods (login, logout, user info) to all components

#### Components
- **`src/components/ProtectedRoute.jsx`**: Route guard that redirects unauthenticated users to login
- **`src/components/ChatDrawer.jsx`**: Side drawer component for viewing and responding to question threads
- **`src/components/RaiseQuestionDialog.jsx`**: Dialog component for approvers to raise clarification questions

#### Pages
- **`src/pages/Login.jsx`**: User login page with email/password authentication
- **`src/pages/SignUp.jsx`**: User registration page (System Owner or Approver)
- **`src/pages/Dashboard.jsx`**: Main dashboard displaying all assessments with status chips and action buttons
- **`src/pages/LaunchAssessment.jsx`**: Page for creating new assessments
- **`src/pages/Screening.jsx`**: Main screening questionnaire page with:
  - 30+ questions across 5 pages
  - Conditional question logic
  - Pagination
  - Answer submission and editing
  - Thread viewing and response
- **`src/pages/AssessmentEditor.jsx`**: Page for editing assessment details

#### Configuration
- **`package.json`**: Node.js project configuration, dependencies, and scripts
- **`vite.config.js`**: Vite build tool configuration
- **`eslint.config.js`**: ESLint linting rules

### Backend Files

#### Core Application Files
- **`app/main.py`**: FastAPI application entry point with:
  - CORS middleware configuration
  - Authentication routes (/auth/login, /auth/register, /auth/me)
  - Router registration for assessments and threads
- **`app/database.py`**: Database connection setup and table creation using SQLModel
- **`app/deps.py`**: FastAPI dependency injection functions:
  - `get_session`: Database session provider
  - `get_current_user`: Current authenticated user extractor

#### Models & Authentication
- **`app/models.py`**: SQLModel database models:
  - `User`: User accounts with roles (owner/approver)
  - `Assessment`: Assessment records with status tracking
  - `ScreeningAnswer`: Stored answers to screening questions
  - `QuestionThread`: Threads for clarification questions
  - `ThreadComment`: Comments within threads
- **`app/auth.py`**: Authentication utilities:
  - `create_token`: JWT token generation
  - `hash_password`: bcrypt password hashing
  - `verify_password`: Password verification

#### API Routes
- **`app/routes/assessment.py`**: Assessment management endpoints:
  - `POST /assessments/`: Create new assessment
  - `GET /assessments/`: List assessments (filtered by role)
  - `GET /assessments/{id}`: Get assessment details
  - `POST /assessments/{id}/screening`: Submit screening answers
  - `GET /assessments/{id}/screening`: Get screening answers
  - `POST /assessments/{id}/status`: Update assessment status (approvers only)
  - `DELETE /assessments/{id}`: Delete assessment
- **`app/routes/threads.py`**: Thread and comment management:
  - `POST /threads/`: Create new question thread
  - `GET /threads/`: Get all threads for an assessment
  - `POST /threads/{thread_id}/comments`: Add comment to thread
  - `GET /threads/{thread_id}/comments`: Get comments for a thread
  - `POST /threads/{thread_id}/end`: End/resolve a thread (approvers only)

#### Database & Configuration
- **`app.db`**: SQLite database file (created automatically)
- **`run_server.py`**: Server startup script for running the FastAPI application

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **npm** or **yarn**

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd sra-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd sra-portal
```

2. Create a virtual environment (recommended):
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn sqlmodel passlib[bcrypt] python-jose[cryptography] python-multipart
```

4. Run the server:
```bash
python run_server.py
# Or: uvicorn app.main:app --reload
```

The backend API will be available at `http://127.0.0.1:8000`

5. Access API documentation:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## 📖 Usage

### For System Owners

1. **Sign Up**: Create an account with role "System Owner"
2. **Login**: Access the dashboard
3. **Create Assessment**: Click "Launch New Assessment" and provide a title
4. **Complete Screening**: Answer the questionnaire (30+ questions across 5 pages)
5. **Submit**: Submit the assessment for review
6. **Respond to Clarifications**: Edit answers or reply in chat when approvers request clarifications
7. **Resubmit**: After making changes, resubmit the assessment

### For Approvers

1. **Sign Up**: Create an account with role "Approver"
2. **Login**: Access the dashboard (shows all assessments)
3. **Review Assessments**: Click "View Details" on any assessment
4. **Raise Questions**: Use the question icon to request clarifications on specific questions
5. **Review Responses**: View system owner responses and chat history
6. **End Discussions**: Close threads when clarifications are resolved
7. **Update Status**: Mark assessments as "Completed" or "Red Flag"

## 🔐 Security Features

### Password Security
- **Frontend**: Passwords are hashed using SHA-256 before transmission
- **Backend**: SHA-256 hashes are further hashed with bcrypt before storage
- **Result**: Double-layer security (SHA-256 → bcrypt)

### Authentication
- JWT tokens for session management
- Token stored in sessionStorage (frontend)
- Protected routes require valid authentication

### Authorization
- Role-based access control (System Owner vs Approver)
- System Owners can only view/edit their own assessments
- Approvers can view all assessments

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user info

### Assessments
- `POST /assessments/` - Create assessment
- `GET /assessments/` - List assessments
- `GET /assessments/{id}` - Get assessment details
- `POST /assessments/{id}/screening` - Submit screening answers
- `GET /assessments/{id}/screening` - Get screening answers
- `POST /assessments/{id}/status` - Update status (approvers only)
- `DELETE /assessments/{id}` - Delete assessment

### Threads & Comments
- `POST /threads/` - Create question thread
- `GET /threads/` - Get threads for assessment
- `POST /threads/{thread_id}/comments` - Add comment
- `GET /threads/{thread_id}/comments` - Get comments
- `POST /threads/{thread_id}/end` - End thread (approvers only)

## 🎨 Key Features Explained

### Intelligent Screening
- First question determines if assessment is needed
- If "No PI data collected" → Auto-completed
- If "Yes" → Continue with full questionnaire

### Conditional Question Flow
- Questions appear based on previous answers
- Example: GDPR question only appears if "Europe" is selected in continents question
- Sensitive data categories only appear if sensitive data collection is confirmed

### Multi-Question Clarifications
- Approvers can raise questions on multiple questions simultaneously
- Each question can have its own independent thread
- System Owners see all clarifications with visual indicators (orange borders)

### Status Lifecycle
- `screening`: Initial state, awaiting submission
- `in_dpia`: Full assessment required
- `awaiting_approval`: Submitted, awaiting approver review
- `changes_requested`: Clarifications needed
- `completed`: Assessment approved
- `red_flag`: Critical issues identified

## 🧪 Testing

### Frontend
```bash
cd sra-frontend
npm run lint  # Run ESLint
```

### Backend
```bash
cd sra-portal
# Run FastAPI with auto-reload for testing
uvicorn app.main:app --reload
```

## 📦 Dependencies

### Frontend
- React 19.2.0
- Material-UI 7.3.5
- React Router DOM 7.9.6
- Vite 7.2.2

### Backend
- FastAPI
- SQLModel
- Passlib (bcrypt)
- Python-JOSE (JWT)
- Uvicorn

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment. All rights reserved.

## 👥 Authors

- [Add Team Member Names Here]

## 🙏 Acknowledgments

- Material-UI for the component library
- FastAPI for the excellent Python web framework
- React team for the amazing frontend framework

---

**Note**: This is a GDPR-compliant DPIA management system designed for educational and organizational use. Ensure proper security measures are in place before deploying to production.
