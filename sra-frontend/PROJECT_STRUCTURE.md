# Project Structure - Detailed File Descriptions

## 📁 Complete Project Structure

```
Security-Risk-Assessment/
│
├── sra-frontend/                          # Frontend React Application
│   │
│   ├── public/                            # Static assets
│   │   └── vite.svg                       # Vite logo (static asset)
│   │
│   ├── src/                               # Source code directory
│   │   │
│   │   ├── api.js                         # API client - all backend communication
│   │   │                                  # Functions: login, register, fetchAssessments,
│   │   │                                  # submitScreening, createThread, getThreads, etc.
│   │   │
│   │   ├── App.jsx                        # Main app component - defines all routes
│   │   │                                  # Routes: /login, /signup, /, /launch, /assessments/:id/screening
│   │   │                                  # Wraps app in AuthProvider for global auth state
│   │   │
│   │   ├── App.css                        # Global application styles
│   │   ├── main.jsx                       # React entry point - renders App component
│   │   ├── index.css                      # Base CSS styles and resets
│   │   │
│   │   ├── assets/                        # Static assets
│   │   │   └── react.svg                  # React logo
│   │   │
│   │   ├── components/                    # Reusable React components
│   │   │   │
│   │   │   ├── ChatDrawer.jsx            # Side drawer for thread discussions
│   │   │   │                              # - Displays thread comments
│   │   │   │                              # - Allows adding new comments
│   │   │   │                              # - Shows thread status (open/resolved)
│   │   │   │                              # - "End Discussion" button for approvers
│   │   │   │
│   │   │   ├── ProtectedRoute.jsx        # Route guard component
│   │   │   │                              # - Checks if user is authenticated
│   │   │   │                              # - Redirects to /login if not authenticated
│   │   │   │                              # - Wraps protected routes
│   │   │   │
│   │   │   └── RaiseQuestionDialog.jsx   # Dialog for raising questions
│   │   │                                  # - Used by approvers to ask clarifications
│   │   │                                  # - Text input for question
│   │   │                                  # - Creates new thread on submit
│   │   │
│   │   ├── contexts/                      # React Context providers
│   │   │   │
│   │   │   └── AuthContext.jsx           # Authentication context
│   │   │                                  # - Provides: user, login, logout functions
│   │   │                                  # - Manages authentication state globally
│   │   │                                  # - Stores JWT token in sessionStorage
│   │   │
│   │   ├── pages/                        # Page components (routes)
│   │   │   │
│   │   │   ├── Login.jsx                 # Login page
│   │   │   │                              # - Email and password input
│   │   │   │                              # - Hashes password with SHA-256 before sending
│   │   │   │                              # - Redirects to dashboard on success
│   │   │   │
│   │   │   ├── SignUp.jsx                # Registration page
│   │   │   │                              # - Email, password, role selection
│   │   │   │                              # - Hashes password with SHA-256
│   │   │   │                              # - Redirects to login after registration
│   │   │   │
│   │   │   ├── Dashboard.jsx             # Main dashboard
│   │   │   │                              # - Lists all assessments
│   │   │   │                              # - Shows status chips (screening, awaiting_approval, etc.)
│   │   │   │                              # - "Start Screening" or "View Details" buttons
│   │   │   │                              # - Role-based filtering (owners see their own, approvers see all)
│   │   │   │
│   │   │   ├── LaunchAssessment.jsx      # Create new assessment page
│   │   │   │                              # - Title input
│   │   │   │                              # - Creates assessment and redirects to screening
│   │   │   │
│   │   │   ├── Screening.jsx             # Main screening questionnaire (LARGEST FILE)
│   │   │   │                              # - 30+ questions across 5 pages
│   │   │   │                              # - Conditional question logic
│   │   │   │                              # - Multiple question types: boolean, text, multiselect, select
│   │   │   │                              # - Pagination controls
│   │   │   │                              # - Answer submission and editing
│   │   │   │                              # - Thread viewing and response
│   │   │   │                              # - Auto-completion for "No PI data" scenario
│   │   │   │                              # - Visual indicators for clarifications (orange borders)
│   │   │   │
│   │   │   └── AssessmentEditor.jsx      # Assessment editing page
│   │   │                                  # - Edit assessment title
│   │   │                                  # - Delete assessment option
│   │   │
│   │   └── utils/                        # Utility functions
│   │       │
│   │       └── crypto.js                 # Password hashing utility
│   │                                      # - Uses Web Crypto API
│   │                                      # - SHA-256 hashing algorithm
│   │                                      # - Returns 64-character hex string
│   │
│   ├── package.json                      # Node.js project configuration
│   │                                     # - Dependencies: React, MUI, React Router
│   │                                     # - Scripts: dev, build, lint, preview
│   │
│   ├── package-lock.json                 # Locked dependency versions
│   ├── vite.config.js                    # Vite build tool configuration
│   ├── eslint.config.js                  # ESLint linting rules
│   ├── index.html                        # HTML entry point for React app
│   └── README.md                         # Frontend documentation
│
└── sra-portal/                            # Backend FastAPI Application
    │
    ├── app/                               # Application package
    │   │
    │   ├── __init__.py                    # Package initialization file
    │   │
    │   ├── main.py                        # FastAPI application entry point
    │   │                                  # - Creates FastAPI app instance
    │   │                                  # - Configures CORS middleware
    │   │                                  # - Defines auth routes (/auth/login, /auth/register, /auth/me)
    │   │                                  # - Registers assessment and thread routers
    │   │                                  # - Handles password verification (SHA-256 → bcrypt)
    │   │
    │   ├── models.py                      # SQLModel database models
    │   │                                  # - User: email, password_hash, role
    │   │                                  # - Assessment: title, status, owner_user_id, approver_user_id
    │   │                                  # - ScreeningAnswer: question_text, answer, notes, assessment_id
    │   │                                  # - QuestionThread: question_text, status, assessment_id
    │   │                                  # - ThreadComment: body, author_email, thread_id
    │   │
    │   ├── database.py                    # Database configuration
    │   │                                  # - SQLite database connection
    │   │                                  # - create_db_and_tables() function
    │   │                                  # - Session management
    │   │
    │   ├── auth.py                        # Authentication utilities
    │   │                                  # - create_token(): JWT token generation
    │   │                                  # - hash_password(): bcrypt hashing
    │   │                                  # - verify_password(): Password verification
    │   │                                  # - pwd_context: CryptContext with bcrypt
    │   │
    │   ├── deps.py                        # FastAPI dependencies
    │   │                                  # - get_session(): Database session provider
    │   │                                  # - get_current_user(): Extracts user from JWT token
    │   │                                  # - Used as Depends() in route handlers
    │   │
    │   └── routes/                        # API route handlers
    │       │
    │       ├── assessment.py              # Assessment management endpoints
    │       │                               # - POST /assessments/: Create assessment
    │       │                               # - GET /assessments/: List assessments (role-filtered)
    │       │                               # - GET /assessments/{id}: Get assessment details
    │       │                               # - POST /assessments/{id}/screening: Submit answers
    │       │                               # - GET /assessments/{id}/screening: Get answers
    │       │                               # - POST /assessments/{id}/status: Update status
    │       │                               # - DELETE /assessments/{id}: Delete assessment
    │       │                               # - Auto-completion logic for "No PI data"
    │       │
    │       └── threads.py                  # Thread and comment management
    │                                       # - POST /threads/: Create thread
    │                                       # - GET /threads/: Get threads for assessment
    │                                       # - POST /threads/{id}/comments: Add comment
    │                                       # - GET /threads/{id}/comments: Get comments
    │                                       # - POST /threads/{id}/end: End thread (approvers only)
    │
    ├── app.db                             # SQLite database file
    │                                     # - Created automatically on first run
    │                                     # - Contains all tables: users, assessments, screening_answers, etc.
    │
    └── run_server.py                      # Server startup script
                                          # - Runs uvicorn server
                                          # - Development mode with auto-reload
```

## 📝 Detailed File Descriptions

### Frontend Files

#### Core Application
| File | Purpose | Key Functions/Features |
|------|---------|------------------------|
| `src/main.jsx` | React entry point | Renders App component to DOM |
| `src/App.jsx` | Main app component | Defines all routes, wraps in AuthProvider |
| `src/App.css` | Global styles | Application-wide CSS |
| `src/index.css` | Base styles | CSS resets and base styles |
| `index.html` | HTML template | Root HTML file for React app |

#### API & Utilities
| File | Purpose | Key Functions |
|------|---------|---------------|
| `src/api.js` | API client | All backend API calls (login, register, assessments, threads) |
| `src/utils/crypto.js` | Password hashing | `hashPassword()` - SHA-256 hashing using Web Crypto API |

#### Authentication
| File | Purpose | Key Features |
|------|---------|--------------|
| `src/contexts/AuthContext.jsx` | Auth context provider | Provides `user`, `login()`, `logout()` globally via React Context |

#### Components
| File | Purpose | Key Features |
|------|---------|--------------|
| `src/components/ProtectedRoute.jsx` | Route guard | Redirects unauthenticated users to login |
| `src/components/ChatDrawer.jsx` | Thread viewer | Side drawer for viewing/responding to question threads |
| `src/components/RaiseQuestionDialog.jsx` | Question dialog | Dialog for approvers to raise clarification questions |

#### Pages
| File | Purpose | Key Features |
|------|---------|--------------|
| `src/pages/Login.jsx` | Login page | Email/password login, password hashing, redirect to dashboard |
| `src/pages/SignUp.jsx` | Registration page | User registration with role selection (owner/approver) |
| `src/pages/Dashboard.jsx` | Main dashboard | Lists assessments, status chips, action buttons, role-based filtering |
| `src/pages/LaunchAssessment.jsx` | Create assessment | Form to create new assessment with title |
| `src/pages/Screening.jsx` | Screening questionnaire | 30+ questions, pagination, conditional logic, submission, editing, threads |
| `src/pages/AssessmentEditor.jsx` | Edit assessment | Edit title, delete assessment |

#### Configuration
| File | Purpose | Contents |
|------|---------|----------|
| `package.json` | Project config | Dependencies, scripts (dev, build, lint) |
| `vite.config.js` | Vite config | Build tool configuration |
| `eslint.config.js` | Linting rules | ESLint configuration |

### Backend Files

#### Core Application
| File | Purpose | Key Features |
|------|---------|--------------|
| `app/main.py` | FastAPI app | App initialization, CORS, auth routes, router registration |
| `app/database.py` | Database setup | SQLite connection, table creation |
| `app/deps.py` | Dependencies | `get_session()`, `get_current_user()` for dependency injection |

#### Models & Auth
| File | Purpose | Key Models/Functions |
|------|---------|---------------------|
| `app/models.py` | Database models | User, Assessment, ScreeningAnswer, QuestionThread, ThreadComment |
| `app/auth.py` | Auth utilities | `create_token()`, `hash_password()`, `verify_password()` |

#### API Routes
| File | Purpose | Endpoints |
|------|---------|-----------|
| `app/routes/assessment.py` | Assessment API | CRUD operations, screening submission, status updates |
| `app/routes/threads.py` | Thread API | Thread creation, comments, thread resolution |

#### Database & Config
| File | Purpose | Contents |
|------|---------|----------|
| `app.db` | SQLite database | All application data (users, assessments, answers, threads) |
| `run_server.py` | Server script | Uvicorn server startup |

## 🔄 Data Flow

### Authentication Flow
1. User enters password in `Login.jsx` or `SignUp.jsx`
2. `crypto.js` hashes password with SHA-256
3. Hashed password sent to backend via `api.js`
4. Backend (`main.py`) receives SHA-256 hash
5. Backend hashes again with bcrypt (`auth.py`)
6. Stored in database (`app.db`)
7. JWT token returned to frontend
8. Token stored in sessionStorage via `AuthContext.jsx`

### Assessment Submission Flow
1. System Owner answers questions in `Screening.jsx`
2. Answers stored in component state
3. On submit, payload created with all answers
4. `api.js` sends POST request to `/assessments/{id}/screening`
5. Backend (`assessment.py`) stores answers in database
6. Status updated based on answers (completed/in_dpia/awaiting_approval)
7. Frontend reloads to show updated status

### Clarification Flow
1. Approver clicks question icon in `Screening.jsx`
2. `RaiseQuestionDialog.jsx` opens
3. Approver types question and submits
4. `api.js` creates thread via POST `/threads/`
5. Backend (`threads.py`) stores thread in database
6. System Owner sees orange border on question card
7. System Owner can edit answer or reply in `ChatDrawer.jsx`
8. Comments stored via POST `/threads/{id}/comments`
9. Approver can end thread via POST `/threads/{id}/end`

## 🗂️ Database Schema

### Tables
- **users**: id, email, password_hash, role
- **assessments**: id, title, status, owner_user_id, approver_user_id, created_at
- **screening_answers**: id, assessment_id, question_text, answer, notes, created_at
- **question_threads**: id, assessment_id, question_text, status, created_at
- **thread_comments**: id, thread_id, body, author_email, created_at

## 📊 Key Statistics

- **Total Frontend Files**: ~15 source files
- **Total Backend Files**: ~8 source files
- **Lines of Code**: ~2000+ (frontend), ~500+ (backend)
- **Questions**: 30+ screening questions
- **Pages**: 5 paginated question pages
- **Question Types**: Boolean, Text, Multiselect, Select

