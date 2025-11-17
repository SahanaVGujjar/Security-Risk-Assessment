// src/pages/Screening.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitScreening, createThread, getThreads, getThreadComments, addComment, fetchAssessments, updateAssessmentStatus, deleteAssessment, getScreeningAnswers, endThread } from "../api";
import { useAuth } from "../contexts/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Container, Typography, IconButton, Box, Paper, Chip, Divider, Alert, Card, CardContent, AppBar, Toolbar, Pagination, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { 
  HelpOutline as HelpOutlineIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

const sensitiveDataTypes = [
  "Health Information",
  "Biometric Data (Fingerprints, Face Recognition, DNA)",
  "Religious or Philosophical Beliefs",
  "Political Opinions",
  "Sexual Orientation",
  "Racial or Ethnic Origin",
  "Genetic Data",
  "SSN",
  "Trade Union Membership",
  "National ID/Passport Number",
  "Financial Information (Bank account / Credit card)"
];

const nonSensitiveDataTypes = [
  "Name",
  "Address",
  "Phone Number",
  "Email Address",
  "IP Address",
  "Date of Birth",
  "Location Data (GPS, Geolocation)",
  "Employment Information",
  "Education Records",
  "Online Identifiers (Cookies, Device IDs)",
  "Username/User ID",
  "Photographs (non-biometric)",
  "Vehicle Registration Number",
  "Postal Code",
  "Age",
  "Gender (non-sensitive)",
  "Marital Status"
];

const dataSubjectGroups = [
  "Customers",
  "Employees",
  "Children (under 18 years)",
  "Suppliers",
  "Contractors",
  "Website Users",
  "Prospects/Leads",
  "Partners",
  "Vendors",
  "Students",
  "Patients",
  "Visitors",
  "Applicants (Job/Program)",
  "Shareholders",
  "Members (Organization/Club)",
  "Volunteers",
  "Former Employees",
  "Third-party Representatives",
  "Public (General Public)",
  "Other Data Subjects"
];

const dataCollectionPurposes = [
  "Marketing and Advertising",
  "Customer Service and Support",
  "Legal Obligations and Compliance",
  "Contract Performance",
  "Human Resources Management",
  "Product Development and Improvement",
  "Fraud Prevention and Security",
  "Financial Transactions and Billing",
  "Research and Analytics",
  "Communication and Notifications",
  "Identity Verification",
  "Website Functionality and Personalization",
  "Quality Assurance and Testing",
  "Business Operations and Administration",
  "Data Processing on Behalf of Third Parties",
  "Public Health and Safety",
  "Legal Claims and Disputes",
  "Regulatory Reporting",
  "Training and Development",
  "Other Purposes"
];

const continents = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America"
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Ireland",
  "Portugal",
  "Austria",
  "Greece",
  "Japan",
  "China",
  "India",
  "South Korea",
  "Singapore",
  "Hong Kong",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "South Africa",
  "United Arab Emirates",
  "Saudi Arabia",
  "Israel",
  "New Zealand",
  "Other"
];

const securityMeasures = [
  "Password Protection",
  "Encryption at Rest",
  "Encryption in Transit",
  "Access Controls",
  "Multi-factor Authentication",
  "Data Masking",
  "Audit Logging",
  "Physical Security",
  "Network Security",
  "Intrusion Detection Systems",
  "Firewall Protection",
  "Data Loss Prevention (DLP)",
  "Security Information and Event Management (SIEM)",
  "Regular Security Assessments",
  "Vulnerability Scanning",
  "Penetration Testing",
  "Identity and Access Management (IAM)",
  "Single Sign-On (SSO)",
  "Token-based Authentication",
  "Other"
];

const accessReviewFrequencies = [
  "Monthly",
  "Quarterly",
  "Annually",
  "No review process"
];

const dataRetentionDurations = [
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-7 years",
  "7-10 years",
  "More than 10 years",
  "Indefinite",
  "Other (specify)"
];

const dataProcessingScale = [
  "Less than 1,000",
  "1,000–50,000",
  "50,000–1 million",
  "More than 1 million"
];

const upstreamSystems = [
  "Customer Relationship Management (CRM) System",
  "Enterprise Resource Planning (ERP) System",
  "Human Resources Information System (HRIS)",
  "Enterprise Content Management (ECM) System",
  "Business Intelligence (BI) Platform",
  "Marketing Automation Platform",
  "E-commerce Platform",
  "Customer Support Ticketing System",
  "Financial Management System",
  "Identity and Access Management (IAM) System",
  "Learning Management System (LMS)",
  "Project Management Tool",
  "Document Management System",
  "Email Marketing Platform",
  "Analytics and Reporting System",
  "Supply Chain Management System",
  "Vendor Management System",
  "Compliance Management System",
  "Data Warehouse",
  "Third-party API Integration"
];

const downstreamSystems = [
  "Customer Relationship Management (CRM) System",
  "Enterprise Resource Planning (ERP) System",
  "Human Resources Information System (HRIS)",
  "Enterprise Content Management (ECM) System",
  "Business Intelligence (BI) Platform",
  "Marketing Automation Platform",
  "E-commerce Platform",
  "Customer Support Ticketing System",
  "Financial Management System",
  "Identity and Access Management (IAM) System",
  "Learning Management System (LMS)",
  "Project Management Tool",
  "Document Management System",
  "Email Marketing Platform",
  "Analytics and Reporting System",
  "Supply Chain Management System",
  "Vendor Management System",
  "Compliance Management System",
  "Data Warehouse",
  "Third-party API Integration"
];

const dataStorageLocations = [
  "On-premise",
  "Public Cloud",
  "Private Cloud",
  "Hybrid",
  "Other"
];

const screeningQuestions = [
  { id: 1, text: "Does the system collect any Personal information from individuals?", type: "boolean", page: 1 },
  { id: 2, text: "Provide a detailed description of the system, including its purpose, functionality, and how it processes personal data.", type: "text", page: 1 },
  { id: 3, text: "Will you collect or process any sensitive or special categories of personal data?", type: "boolean", page: 1 },
  { id: 4, text: "If yes, which sensitive data categories apply? Please select all applicable categories.", type: "multiselect", options: sensitiveDataTypes, page: 1 },
  { id: 5, text: "What categories of non-sensitive personal data will be collected and/or processed by the system? Please select all applicable categories.", type: "multiselect", options: nonSensitiveDataTypes, page: 1 },
  { id: 6, text: "From which groups of data subjects will personal data be collected and/or processed? Please select all applicable groups.", type: "multiselect", options: dataSubjectGroups, page: 1 },
  { id: 7, text: "For what purposes will personal data be collected and/or processed by the system?", type: "multiselect", options: dataCollectionPurposes, page: 1 },
  { id: 8, text: "From which continents are you collecting personal data?", type: "multiselect", options: continents, page: 2 },
  { id: 9, text: "Will the system comply with the General Data Protection Regulation (GDPR) requirements for processing personal data from European data subjects?", type: "boolean", page: 2 },
  { id: 10, text: "What is the estimated volume or scale of personal data that will be collected and/or processed by the system?", type: "select", options: dataProcessingScale, page: 2 },
  { id: 11, text: "Please list the upstream systems or sources providing personal data.", type: "select", options: upstreamSystems, page: 3 },
  { id: 12, text: "Where will the data be stored?", type: "select", options: dataStorageLocations, page: 3 },
  { id: 13, text: "Please list the downstream systems or recipients of data.", type: "select", options: downstreamSystems, page: 3 },
  { id: 14, text: "Will personal data be transferred outside the country of collection?", type: "boolean", page: 3 },
  { id: 15, text: "If yes, to which countries will personal data be transferred?", type: "multiselect", options: countries, page: 3 },
  { id: 16, text: "Are group companies, affiliates, or external partners involved in the data transfer?", type: "boolean", page: 3 },
  { id: 17, text: "Which authentication or security measures will you implement to protect personal data?", type: "multiselect", options: securityMeasures, page: 4 },
  { id: 18, text: "How often are user access rights reviewed?", type: "select", options: accessReviewFrequencies, page: 4 },
  { id: 20, text: "Will you send personal data to any third-party vendors or processors?", type: "boolean", page: 4 },
  { id: 21, text: "For what purposes will you share data with vendors or third parties?", type: "text", page: 4 },
  { id: 22, text: "Is there monitoring or CCTV involved in the project?", type: "boolean", page: 5 },
  { id: 23, text: "Are you ensuring that no data subject rights are being violated?", type: "boolean", page: 5 },
  { id: 24, text: "Is large-scale processing of personal data involved?", type: "boolean", page: 5 },
  { id: 25, text: "Is any data on criminal convictions or offenses being collected?", type: "boolean", page: 5 },
  { id: 26, text: "Are you combining datasets from multiple sources?", type: "boolean", page: 5 },
  { id: 27, text: "Are innovative technologies (e.g., AI, IoT) used in the project?", type: "boolean", page: 5 },
  { id: 28, text: "Is personal data regularly shared with government or law enforcement bodies?", type: "boolean", page: 5 },
  { id: 29, text: "Will there be profiling, automated decision-making, or analytics performed on the data?", type: "boolean", page: 5 },
  { id: 30, text: "How long do you intend to retain the personal data?", type: "select", options: dataRetentionDurations, page: 5 },
  { id: 31, text: "Is there a process for reviewing and deleting outdated personal data?", type: "boolean", page: 5 },
  // Additional questions will be added here when first question is answered "yes"
];

export default function Screening() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [popupIdx, setPopupIdx] = useState(null);
  const [popupText, setPopupText] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threads, setThreads] = useState([]);
  const [comments, setComments] = useState({});
  const [assessment, setAssessment] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previousAnswers, setPreviousAnswers] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);
  // State for "Other" text fields in multiselect questions
  const [otherAnswers, setOtherAnswers] = useState({});
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const isApprover = user?.role === 'approver';
  
  // Determine if we should show additional questions based on first question answer
  const firstQuestionAnswer = answers[1] !== undefined ? answers[1] : (previousAnswers[1] !== undefined ? previousAnswers[1] : null);
  const shouldShowAdditionalQuestions = firstQuestionAnswer === true;
  
  // Reset to page 1 if first question is "no"
  useEffect(() => {
    if (!shouldShowAdditionalQuestions && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [shouldShowAdditionalQuestions, currentPage]);
  const isOwner = user?.role === 'owner';
  const isAwaitingApproval = assessment?.status === 'awaiting_approval';
  const canDelete = (isApprover) || (isOwner && assessment?.owner_user_id === user?.id);
  // System owners can resubmit if:
  // 1. Assessment is awaiting approval or changes requested (after approver review), OR
  // 2. There are open threads (clarification needed - allows multiple rounds of clarification)
  const hasOpenThreads = threads.some(t => t.status === 'open');
  const canResubmit = isOwner && (
    assessment?.status === 'awaiting_approval' || 
    assessment?.status === 'changes_requested' ||
    hasOpenThreads  // Can resubmit if any thread is still open
  );
  // System owners can edit if assessment is awaiting approval, changes requested, or if there are open threads (clarification needed)
  const canEdit = isOwner && (
    assessment?.status === 'awaiting_approval' || 
    assessment?.status === 'changes_requested' ||
    hasOpenThreads  // Can edit if there are any open clarification threads
  );

  useEffect(() => {
    // Load assessment, threads, and previous answers
    const loadData = async () => {
      try {
        setLoading(true);
        const assessments = await fetchAssessments();
        const found = assessments.find(a => a.id === parseInt(id));
        setAssessment(found);
        
        if (found) {
          // Load all threads for this assessment
          const threadsData = await getThreads(parseInt(id));
          setThreads(threadsData);
          
          // Load comments for each thread
          const commentsData = {};
          for (const thread of threadsData) {
            try {
              const threadComments = await getThreadComments(thread.id);
              commentsData[thread.id] = threadComments;
            } catch (e) {
              console.error(`Failed to load comments for thread ${thread.id}:`, e);
              commentsData[thread.id] = [];
            }
          }
          setComments(commentsData);
          
          // Load previous answers for both system owners and approvers (approvers need to see responses for review)
          try {
            const savedAnswers = await getScreeningAnswers(parseInt(id));
            if (savedAnswers && savedAnswers.length > 0) {
              const answersMap = {};
              const textAnswersMap = {}; // Store text answers separately
              savedAnswers.forEach((ans) => {
                const question = screeningQuestions.find(q => q.text === ans.question);
                if (question) {
                  if (question.type === "text") {
                    // For text questions, store the text from notes field
                    answersMap[question.id] = ans.notes || "";
                    textAnswersMap[question.id] = ans.notes || "";
                  } else if (question.type === "multiselect") {
                    // For multiselect questions, parse JSON array from notes field
                    // Extract "Other" items and populate otherAnswers state
                    try {
                      const allItems = ans.notes ? JSON.parse(ans.notes) : [];
                      // Separate "Other: " items from regular items
                      const otherItems = allItems.filter(item => typeof item === 'string' && item.startsWith('Other: '));
                      const regularItems = allItems.filter(item => !(typeof item === 'string' && item.startsWith('Other: ')));
                      
                      // Store all items in answersMap (including "Other" items for display)
                      answersMap[question.id] = allItems;
                      
                      // Extract and store "Other" text in otherAnswers state
                      if (otherItems.length > 0) {
                        const otherText = otherItems[0].replace('Other: ', '');
                        setOtherAnswers(prev => ({ ...prev, [question.id]: otherText }));
                      }
                    } catch (e) {
                      answersMap[question.id] = [];
                    }
                  } else if (question.type === "select") {
                    // For select/dropdown questions, store the selected value from notes field
                    // For Q12 (data storage), extract the storage location and provider details
                    if (question.id === 12 && ans.notes && ans.notes.includes(" - Provider: ")) {
                      const [storageLocation, providerDetails] = ans.notes.split(" - Provider: ");
                      answersMap[question.id] = storageLocation;
                      if (providerDetails) {
                        setOtherAnswers(prev => ({ ...prev, [question.id]: providerDetails }));
                      }
                    } else {
                      answersMap[question.id] = ans.notes || "";
                    }
                  } else {
                    // For boolean questions, store the boolean value
                    answersMap[question.id] = ans.answer;
                  }
                }
              });
              setPreviousAnswers(answersMap);
              // Only set answers for system owners (approvers just view)
              if (isOwner) {
                setAnswers(answersMap);
              }
            }
          } catch (e) {
            // Not an error if no answers exist yet (404 or empty response is expected for new assessments)
            if (e.message && !e.message.includes("404") && !e.message.includes("not found")) {
              console.error("Failed to load previous answers:", e);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load data:", e);
        setError("Failed to load assessment data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isOwner]);

  const handleAnswer = (qid, val) => {
    // Only update the answer state - don't auto-submit
    setAnswers(a => ({ ...a, [qid]: val }));
  };
  
  // Separate function to handle submission when "No" is clicked for first question
  const handleFirstQuestionNo = async () => {
    // Only auto-complete if question 1 is answered "no" by system owner in screening status
    if (!isApprover && assessment?.status === 'screening' && answers[1] === false) {
      try {
        setLoading(true);
        setError("");
        
        // Submit the "no" answer
        const payload = [{
          question: screeningQuestions[0].text,
          answer: false,
          notes: ""
        }];
        
        await submitScreening(id, payload);
        // Backend automatically sets status to 'completed' when first question is answered "No"
        
        // Reload assessment to get updated status
        const assessments = await fetchAssessments();
        const found = assessments.find(a => a.id === parseInt(id));
        if (found) {
          setAssessment(found);
        }
        
        // Reload previous answers to show the submitted state
        try {
          const savedAnswers = await getScreeningAnswers(parseInt(id));
          if (savedAnswers && savedAnswers.length > 0) {
            const answersMap = {};
            savedAnswers.forEach((ans) => {
              const question = screeningQuestions.find(q => q.text === ans.question);
              if (question) {
                if (question.type === "text") {
                  // For text questions, store the text from notes field
                  answersMap[question.id] = ans.notes || "";
                } else if (question.type === "multiselect") {
                  // For multiselect questions, parse JSON array from notes field
                  try {
                    answersMap[question.id] = ans.notes ? JSON.parse(ans.notes) : [];
                  } catch (e) {
                    answersMap[question.id] = [];
                  }
                } else {
                  // For boolean questions, store the boolean value
                  answersMap[question.id] = ans.answer;
                }
              }
            });
            setPreviousAnswers(answersMap);
            setAnswers(answersMap);
          }
        } catch (e) {
          console.error("Failed to reload answers:", e);
        }
        
        setSubmitMsg("Risk Assessment is not required since no PI data is collected. Assessment has been auto-completed.");
      } catch (e) {
        console.error("Failed to auto-complete assessment:", e);
        setError("Failed to auto-complete assessment. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendQuestion = async (qText, msg) => {
    try {
      const thread = await createThread(parseInt(id), `${qText}: ${msg}`);
      setThreads([...threads, thread]);
      setSelectedThread(thread.id);
      setChatOpen(true);
      setPopupIdx(null);
      setPopupText("");
      // Reload comments for the new thread
      const threadComments = await getThreadComments(thread.id);
      setComments({ ...comments, [thread.id]: threadComments });
    } catch (e) {
      console.error("Failed to create thread:", e);
      setError("Failed to create question thread");
    }
  };

  const handleSendComment = async (threadId, body) => {
    try {
      await addComment(threadId, body);
      // Reload comments
      const threadComments = await getThreadComments(threadId);
      setComments({ ...comments, [threadId]: threadComments });
    } catch (e) {
      console.error("Failed to add comment:", e);
      setError("Failed to send response");
    }
  };

  const handleDeleteAssessment = async () => {
    try {
      setLoading(true);
      await deleteAssessment(parseInt(id));
      navigate("/");
    } catch (e) {
      console.error("Failed to delete assessment:", e);
      setError("Failed to delete assessment");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      setLoading(true);
      await updateAssessmentStatus(parseInt(id), status);
      // Reload assessment to get updated status
      const assessments = await fetchAssessments();
      const found = assessments.find(a => a.id === parseInt(id));
      setAssessment(found);
      setError("");
    } catch (e) {
      console.error("Failed to update status:", e);
      setError("Failed to update assessment status");
    } finally {
      setLoading(false);
    }
  };

  const handleEndThread = async (threadId) => {
    try {
      setLoading(true);
      await endThread(threadId);
      // Reload threads to get updated status
      const threadsData = await getThreads(parseInt(id));
      setThreads(threadsData);
      setError("");
      // If current thread was ended, close the chat
      if (selectedThread === threadId) {
        setChatOpen(false);
        setSelectedThread(null);
      }
    } catch (e) {
      console.error("Failed to end thread:", e);
      setError("Failed to end thread");
    } finally {
      setLoading(false);
    }
  };

  const getThreadForQuestion = (questionText) => {
    return threads.find(t => t.question_text.includes(questionText));
  };

  const getCommentsForThread = (threadId) => {
    return comments[threadId] || [];
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1e3a8a', borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <AssessmentIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Security Risk Assessment Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<PersonIcon />}
              label={user?.role === 'owner' ? 'System Owner' : 'Approver'}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
            Privacy Impact Assessment (PIA) Screening
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {assessment?.title || 'Assessment Screening'}
          </Typography>
        </Box>
        
        <Box sx={{ pr: chatOpen ? '400px' : 0, transition: 'padding-right 0.3s' }}>
          {isOwner && Object.keys(previousAnswers).length > 0 && (
            <Alert severity={assessment?.status === 'completed' ? "success" : "info"} sx={{ mb: 3 }}>
              <Typography variant="body2">
                {assessment?.status === 'completed' ? (
                  <>
                    <strong>Assessment Completed.</strong> All your submitted responses are shown below. This assessment has been completed as no Personal Information is collected.
                  </>
                ) : (
                  <>
                    <strong>Viewing submitted responses.</strong> All your previous responses are shown below.
                    {threads.length > 0 && (
                      <>
                        {' '}
                        {(() => {
                          const openThreads = threads.filter(t => t.status === 'open');
                          const resolvedThreads = threads.filter(t => t.status === 'resolved');
                          if (openThreads.length > 0) {
                            return `Clarification${openThreads.length > 1 ? 's' : ''} needed for ${openThreads.length} question${openThreads.length > 1 ? 's' : ''} (marked with orange border and edit icon). You can edit those questions or reply in chat.`;
                          } else if (resolvedThreads.length > 0) {
                            return `All clarifications have been resolved.`;
                          }
                          return '';
                        })()}
                      </>
                    )}
                    {canResubmit ? ' You can resubmit after making changes.' : ' Waiting for approver review before you can resubmit.'}
                  </>
                )}
              </Typography>
            </Alert>
          )}
          {isApprover && Object.keys(previousAnswers).length > 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Reviewing assessment responses.</strong> All system owner responses are shown below. You can raise questions for clarification on any question using the question icon. Multiple clarifications can be raised simultaneously.
                {threads.length > 0 && (
                  <>
                    {' '}
                    {(() => {
                      const openThreads = threads.filter(t => t.status === 'open');
                      const resolvedThreads = threads.filter(t => t.status === 'resolved');
                      if (openThreads.length > 0) {
                        return `Currently ${openThreads.length} open clarification${openThreads.length > 1 ? 's' : ''} and ${resolvedThreads.length} resolved.`;
                      } else if (resolvedThreads.length > 0) {
                        return `${resolvedThreads.length} clarification${resolvedThreads.length > 1 ? 's have' : ' has'} been resolved.`;
                      }
                      return '';
                    })()}
                  </>
                )}
              </Typography>
            </Alert>
          )}
        {(() => {
          // If first question is "yes", show questions 2, 3, and 5 (always)
          // Question 4 (sensitive data categories) only shows if question 3 is answered "yes"
          // If first question is "no", only show question 1
          let questionsToShow;
          
          if (!shouldShowAdditionalQuestions) {
            // Show only first question if answer is "no" or not answered yet
            questionsToShow = [screeningQuestions[0]];
          } else {
            // First question is "yes" - show Q1, Q2, Q3, Q5, and conditionally Q4
            const thirdQuestionAnswer = answers[3] !== undefined ? answers[3] : (previousAnswers[3] !== undefined ? previousAnswers[3] : null);
            const shouldShowSensitiveDataQuestion = thirdQuestionAnswer === true;
            
            // Build questions to show: Q1, Q2, Q3, Q4 (conditional), Q5, Q6, Q7, Q8, Q9 (conditional), Q10
            // Check if Europe is selected in Q8 (continents)
            const continentsAnswer = answers[8] !== undefined ? answers[8] : (previousAnswers[8] !== undefined ? previousAnswers[8] : []);
            const hasEuropeSelected = Array.isArray(continentsAnswer) && continentsAnswer.includes("Europe");
            
            // Check if Q14 (data transfer outside country) is answered "Yes"
            const dataTransferAnswer = answers[14] !== undefined ? answers[14] : (previousAnswers[14] !== undefined ? previousAnswers[14] : null);
            const shouldShowCountriesQuestion = dataTransferAnswer === true;
            
            questionsToShow = [
              screeningQuestions[0], // Q1: Does system collect PI?
              screeningQuestions[1], // Q2: System description
              screeningQuestions[2], // Q3: Sensitive data yes/no
              ...(shouldShowSensitiveDataQuestion ? [screeningQuestions[3]] : []), // Q4: Sensitive data categories (only if Q3 is yes)
              screeningQuestions[4],  // Q5: Non-sensitive data categories
              screeningQuestions[5],  // Q6: Data subject groups
              screeningQuestions[6],  // Q7: Data collection purposes
              screeningQuestions[7],  // Q8: Continents
              ...(hasEuropeSelected ? [screeningQuestions[8]] : []), // Q9: GDPR compliance (only if Europe is selected, right after Q8)
              screeningQuestions[9],   // Q10: Data processing scale (after Q9)
              screeningQuestions[10],  // Q11: Upstream systems (page 3)
              screeningQuestions[11],  // Q12: Data storage location (page 3)
              screeningQuestions[12],  // Q13: Downstream systems (page 3)
              screeningQuestions[13],  // Q14: Data transfer outside country (page 3)
              ...(shouldShowCountriesQuestion ? [screeningQuestions[14]] : []), // Q15: Countries (only if Q14 is Yes)
              screeningQuestions[15],  // Q16: Group companies/affiliates/partners (page 3)
              screeningQuestions[16],  // Q17: Security measures (page 4)
              screeningQuestions[17],  // Q18: Access rights review frequency (page 4)
              screeningQuestions[18],  // Q20: Third-party vendors/processors (page 4)
              ...(answers[20] === true || previousAnswers[20] === true ? [screeningQuestions[19]] : []), // Q21: Vendor data sharing purposes (only if Q20 is Yes)
              screeningQuestions[20],  // Q22: Monitoring/CCTV (page 5)
              screeningQuestions[21],  // Q23: Data subject rights (page 5)
              screeningQuestions[22],  // Q24: Large-scale processing (page 5)
              screeningQuestions[23],  // Q25: Criminal convictions data (page 5)
              screeningQuestions[24],  // Q26: Combining datasets (page 5)
              screeningQuestions[25],  // Q27: Innovative technologies (page 5)
              screeningQuestions[26],  // Q28: Government/law enforcement sharing (page 5)
              screeningQuestions[27],  // Q29: Profiling/automated decision-making (page 5)
              screeningQuestions[28],  // Q30: Data retention duration (page 5)
              screeningQuestions[29]   // Q31: Review and delete outdated data (page 5)
            ];
          }
          
          // Filter questions by current page
          const questionsForCurrentPage = questionsToShow.filter(q => (q.page || 1) === currentPage);
          
          // Calculate total pages (only if first question is "yes")
          const totalPages = shouldShowAdditionalQuestions && questionsToShow.length > 0 
            ? Math.max(...questionsToShow.map(q => q.page || 1)) 
            : 1;
          
          // Debug: Log if no questions are showing
          if (questionsForCurrentPage.length === 0 && shouldShowAdditionalQuestions) {
            console.log("No questions for current page:", { currentPage, questionsToShow, shouldShowAdditionalQuestions });
          }
          
          return (
            <>
              {questionsForCurrentPage.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    No questions available for this page. Please answer the first question to proceed.
                  </Typography>
                </Alert>
              ) : (
                questionsForCurrentPage.map((q, idx) => {
            const thread = getThreadForQuestion(q.text);
            const hasThread = !!thread;
            const hasOpenThread = hasThread && thread.status === 'open';
            const needsClarification = hasOpenThread && isOwner;
            const isEditing = editingQuestion === q.id;
            const hasAnswer = answers[q.id] !== undefined;
            const hasSubmittedAnswer = previousAnswers[q.id] !== undefined;
            // Edit icon only visible for questions with open threads (raised by approver and not ended)
            const canEditThis = isOwner && hasOpenThread;
            // Show input buttons when:
            // 1. Editing a question with a thread (clarification needed), OR
            // 2. Assessment is in screening status and user is owner (new assessment - allow answering)
            const showInputButtons = (isEditing && hasThread) || 
              (!isApprover && assessment?.status === 'screening');
          
          return (
            <Card key={q.id} sx={{ mb: 3, p: 2, border: needsClarification ? '2px solid #ff9800' : (hasThread && thread.status === 'resolved' ? '1px solid #4caf50' : '1px solid #e5e7eb') }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {q.text}
                  </Typography>
                  {/* Always show submitted answer if it exists (for system owners and approvers to see all responses) */}
                  {/* Show submitted answers for all statuses except initial screening (when answers haven't been submitted yet) */}
                  {hasSubmittedAnswer && !isEditing && (
                    <Box sx={{ 
                      mb: 2,
                      p: 1.5,
                      bgcolor: isApprover ? '#fff3e0' : '#f0f7ff',
                      borderRadius: 1,
                      border: isApprover ? '1px solid #ff9800' : '1px solid #2196f3'
                    }}>
                      {q.type === "text" ? (
                        <>
                          <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                            {previousAnswers[q.id] || "No description provided"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            {isApprover ? "System owner's response" : "Your submitted response"}
                          </Typography>
                        </>
                      ) : q.type === "multiselect" ? (
                        <>
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 1 }}>
                            {isApprover ? "System owner's response" : "Your submitted response"}
                          </Typography>
                          {(() => {
                            const allItems = Array.isArray(previousAnswers[q.id]) ? previousAnswers[q.id] : [];
                            const regularItems = allItems.filter(item => !(typeof item === 'string' && item.startsWith('Other: ')));
                            const otherItems = allItems.filter(item => typeof item === 'string' && item.startsWith('Other: '));
                            
                            if (allItems.length === 0) {
                              return (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                                  No personal data categories selected
                                </Typography>
                              );
                            }
                            
                            return (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {regularItems.map((item, idx) => (
                                  <Chip 
                                    key={idx}
                                    label={item} 
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                  />
                                ))}
                                {otherItems.map((item, idx) => (
                                  <Chip 
                                    key={`other-${idx}`}
                                    label={item} 
                                    color="secondary"
                                    size="small"
                                    sx={{ fontWeight: 500 }}
                                  />
                                ))}
                              </Box>
                            );
                          })()}
                        </>
                      ) : q.type === "select" ? (
                        <>
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 1 }}>
                            {isApprover ? "System owner's response" : "Your submitted response"}
                          </Typography>
                          <Chip 
                            label={(() => {
                              // For Q12, extract storage location from notes if it includes provider details
                              // For Q30, extract retention option from notes if it includes duration details
                              const answer = previousAnswers[q.id];
                              if (q.id === 12 && typeof answer === 'string' && answer.includes(" - Provider: ")) {
                                return answer.split(" - Provider: ")[0];
                              } else if (q.id === 30 && typeof answer === 'string' && answer.includes(" - Duration: ")) {
                                return answer.split(" - Duration: ")[0];
                              }
                              return answer || "Not selected";
                            })()} 
                            color="primary"
                            sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 1 }}
                          />
                          {/* Show provider details for Q12 if stored */}
                          {q.id === 12 && previousAnswers[q.id] && typeof previousAnswers[q.id] === 'string' && previousAnswers[q.id].includes(" - Provider: ") && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                              Provider details: {previousAnswers[q.id].split(" - Provider: ")[1]}
                            </Typography>
                          )}
                          {/* Also check otherAnswers for Q12 (in case it's loaded separately) */}
                          {q.id === 12 && otherAnswers[q.id] && (!previousAnswers[q.id] || !previousAnswers[q.id].includes(" - Provider: ")) && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                              Provider details: {otherAnswers[q.id]}
                            </Typography>
                          )}
                          {/* Show "Other" retention duration for Q30 if stored */}
                          {q.id === 30 && previousAnswers[q.id] && typeof previousAnswers[q.id] === 'string' && previousAnswers[q.id].includes(" - Duration: ") && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                              Retention duration: {previousAnswers[q.id].split(" - Duration: ")[1]}
                            </Typography>
                          )}
                          {/* Also check otherAnswers for Q30 (in case it's loaded separately) */}
                          {q.id === 30 && otherAnswers[q.id] && (!previousAnswers[q.id] || !previousAnswers[q.id].includes(" - Duration: ")) && (
                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                              Retention duration: {otherAnswers[q.id]}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                            <Chip 
                              label={previousAnswers[q.id] ? "Yes" : "No"} 
                              color={previousAnswers[q.id] ? "primary" : "default"}
                              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              {isApprover ? "System owner's response" : "Your submitted response"}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      {canEditThis && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          • Click edit icon to change (clarification needed)
                        </Typography>
                      )}
                      {!canEditThis && isOwner && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mt: 1 }}>
                          • Cannot be edited
                        </Typography>
                      )}
                    </Box>
                  )}
                  {/* Show current answer if edited (different from submitted) */}
                  {hasAnswer && !hasSubmittedAnswer && !isEditing && q.type !== "text" && (
                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 2, 
                      mb: 2,
                      p: 1.5,
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}>
                      <Chip 
                        label={answers[q.id] ? "Yes" : "No"} 
                        color={answers[q.id] ? "primary" : "default"}
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      />
                    </Box>
                  )}
                  {/* Show input field based on question type */}
                  {showInputButtons && (
                    <>
                      {q.type === "text" ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          value={answers[q.id] || ""}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          placeholder="Enter a detailed description of the system..."
                          disabled={isApprover && isAwaitingApproval}
                          sx={{ 
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: '#1e3a8a'
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#1e3a8a'
                              }
                            }
                          }}
                        />
                      ) : q.type === "multiselect" ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select all applicable personal data categories:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {q.options.map((option, idx) => {
                              const selectedItems = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                              const isSelected = selectedItems.includes(option);
                              return (
                                <Button
                                  key={idx}
                                  variant={isSelected ? "contained" : "outlined"}
                                  size="small"
                                  onClick={() => {
                                    const currentSelection = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                                    const newSelection = isSelected
                                      ? currentSelection.filter(item => item !== option)
                                      : [...currentSelection, option];
                                    handleAnswer(q.id, newSelection);
                                    if (isEditing) {
                                      setEditingQuestion(null);
                                      setError("");
                                    }
                                  }}
                                  disabled={isApprover && isAwaitingApproval}
                                  sx={{
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    minWidth: 'auto',
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    ...(isSelected ? {
                                      bgcolor: '#1e3a8a',
                                      '&:hover': { bgcolor: '#1e40af' }
                                    } : {
                                      borderColor: '#e5e7eb',
                                      color: '#1e293b',
                                      '&:hover': {
                                        borderColor: '#1e3a8a',
                                        bgcolor: '#eff6ff'
                                      }
                                    })
                                  }}
                                >
                                  {option}
                                </Button>
                              );
                            })}
                          </Box>
                          {/* Other option text field - not shown for continents question (Q8) */}
                          {q.id !== 8 && (
                            <TextField
                              fullWidth
                              size="small"
                              label="Other (specify)"
                              placeholder="Enter other personal data categories not listed above"
                              value={otherAnswers[q.id] || ""}
                              onChange={(e) => {
                                setOtherAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                                if (isEditing) {
                                  setEditingQuestion(null);
                                  setError("");
                                }
                              }}
                              disabled={isApprover && isAwaitingApproval}
                              sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#1e3a8a'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#1e3a8a'
                                  }
                                }
                              }}
                            />
                          )}
                          {Array.isArray(answers[q.id]) && answers[q.id].length > 0 && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              Selected: {answers[q.id].length} category/categories
                              {otherAnswers[q.id] && otherAnswers[q.id].trim() && ` + 1 other`}
                            </Typography>
                          )}
                        </Box>
                      ) : q.type === "select" ? (
                        <Box sx={{ mb: 2 }}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id={`select-label-${q.id}`}>Select an option</InputLabel>
                            <Select
                              labelId={`select-label-${q.id}`}
                              value={answers[q.id] || ""}
                              label="Select an option"
                              onChange={(e) => {
                                handleAnswer(q.id, e.target.value);
                                if (isEditing) {
                                  setEditingQuestion(null);
                                  setError("");
                                }
                              }}
                              disabled={isApprover && isAwaitingApproval}
                              sx={{
                                borderRadius: 2,
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#e5e7eb'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#1e3a8a'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#1e3a8a'
                                }
                              }}
                            >
                              {q.options.map((option, idx) => (
                                <MenuItem key={idx} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {/* Show "Other" text field for Q12 (data storage) when "Other" is selected */}
                          {q.id === 12 && answers[q.id] === "Other" && (
                            <TextField
                              fullWidth
                              size="small"
                              label="Provider details (specify)"
                              placeholder="Enter provider details for 'Other' storage location"
                              value={otherAnswers[q.id] || ""}
                              onChange={(e) => {
                                setOtherAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                                if (isEditing) {
                                  setEditingQuestion(null);
                                  setError("");
                                }
                              }}
                              disabled={isApprover && isAwaitingApproval}
                              sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#1e3a8a'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#1e3a8a'
                                  }
                                }
                              }}
                            />
                          )}
                          {/* Show "Other" text field for Q30 (data retention) when "Other (specify)" is selected */}
                          {q.id === 30 && answers[q.id] === "Other (specify)" && (
                            <TextField
                              fullWidth
                              size="small"
                              label="Specify retention duration"
                              placeholder="Enter data retention duration"
                              value={otherAnswers[q.id] || ""}
                              onChange={(e) => {
                                setOtherAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                                if (isEditing) {
                                  setEditingQuestion(null);
                                  setError("");
                                }
                              }}
                              disabled={isApprover && isAwaitingApproval}
                              sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#1e3a8a'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#1e3a8a'
                                  }
                                }
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <Button 
                              variant={answers[q.id] === true ? "contained" : "outlined"} 
                              onClick={() => {
                                handleAnswer(q.id, true);
                                if (isEditing) {
                                  setEditingQuestion(null);
                                  setError(""); // Clear any errors when answer is updated
                                }
                              }}
                              disabled={isApprover && isAwaitingApproval}
                              sx={{ 
                                minWidth: 100,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                py: 1,
                                ...(answers[q.id] === true ? {
                                  bgcolor: '#1e3a8a',
                                  '&:hover': { bgcolor: '#1e40af' }
                                } : {
                                  borderColor: '#1e3a8a',
                                  color: '#1e3a8a',
                                  '&:hover': {
                                    borderColor: '#1e40af',
                                    bgcolor: '#eff6ff'
                                  }
                                })
                              }}
                            >
                              Yes
                            </Button>
                            <Button 
                              variant={answers[q.id] === false ? "contained" : "outlined"} 
                              onClick={async () => {
                                handleAnswer(q.id, false);
                                if (isEditing) {
                                  setEditingQuestion(null);
                                  setError(""); // Clear any errors when answer is updated
                                }
                                // If this is the first question and answered "No", auto-complete
                                if (q.id === 1 && !isApprover && assessment?.status === 'screening') {
                                  // Small delay to ensure state is updated
                                  setTimeout(() => {
                                    handleFirstQuestionNo();
                                  }, 100);
                                }
                              }}
                              disabled={isApprover && isAwaitingApproval}
                              sx={{ 
                                minWidth: 100,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                py: 1,
                                ...(answers[q.id] === false ? {
                                  bgcolor: '#6b7280',
                                  '&:hover': { bgcolor: '#4b5563' }
                                } : {
                                  borderColor: '#6b7280',
                                  color: '#6b7280',
                                  '&:hover': {
                                    borderColor: '#4b5563',
                                    bgcolor: '#f9fafb'
                                  }
                                })
                              }}
                            >
                              No
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  {/* Edit icon for questions that need clarification or can be edited */}
                  {canEditThis && !isEditing && (
                    <IconButton 
                      onClick={() => {
                        setEditingQuestion(q.id);
                        setError(""); // Clear errors when starting to edit
                      }}
                      color="warning"
                      title={hasThread ? "Edit answer (clarification needed)" : "Edit answer"}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {/* Question icon visible to approvers, or system owners can view existing threads */}
                  {(isApprover || (isOwner && hasThread)) && (
                    <IconButton 
                      onClick={() => {
                        if (hasThread) {
                          setSelectedThread(thread.id);
                          setChatOpen(true);
                        } else if (isApprover) {
                          // Use question ID to find the correct question in screeningQuestions array
                          const questionIndex = screeningQuestions.findIndex(sq => sq.id === q.id);
                          setPopupIdx(questionIndex >= 0 ? questionIndex : null);
                          setPopupText("");
                        }
                      }}
                      color={hasThread ? (thread.status === 'open' ? "primary" : "success") : "default"}
                      title={hasThread ? (thread.status === 'open' ? "View question thread (open)" : "View question thread (resolved)") : "Raise a question"}
                    >
            <HelpOutlineIcon />
          </IconButton>
                  )}
                  {hasThread && (
                    <Chip 
                      label={thread.status === 'open' ? "Clarification needed" : "Clarification resolved"} 
                      size="small" 
                      color={thread.status === 'open' ? "warning" : "success"} 
                    />
                  )}
                </Box>
              </Box>
            </Card>
          );
          }))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '1rem',
                        fontWeight: 600
                      }
                    }}
                  />
                </Box>
              )}
            </>
          );
        })()}
        
        {/* Show notification only if assessment is completed (status is 'completed') */}
        {assessment?.status === 'completed' && previousAnswers[1] === false && (
          <Alert severity="success" sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Risk Assessment Not Required
            </Typography>
            <Typography variant="body2">
              Since the system does not collect any Personal information from individuals, a Risk Assessment is not required. This assessment has been auto-completed.
            </Typography>
          </Alert>
        )}
        
        {!isApprover && (
          <Box sx={{ mt: 4 }}>
            {/* Show submit button for initial submission or resubmission (only after approver review) */}
            {/* Hide submit button if assessment is completed (no PI data) */}
            {(() => {
              // Don't show submit button if assessment is already completed
              if (assessment?.status === 'completed') {
                return null;
              }
              
              return (assessment?.status === 'screening' || canResubmit) && (
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  disabled={loading}
                  onClick={async () => {
                  // For resubmission: use edited answers for questions with threads, previous answers for others
                  // For initial submission: ensure all questions are answered
                  const isResubmission = Object.keys(previousAnswers).length > 0;
                  
                  // Determine which questions should be answered based on first question
                  const firstQAnswer = answers[1] !== undefined ? answers[1] : (previousAnswers[1] !== undefined ? previousAnswers[1] : null);
                  let questionsToAnswer;
                  
                  if (firstQAnswer !== true) {
                    // Only first question if answer is "no"
                    questionsToAnswer = [screeningQuestions[0]];
                  } else {
                    // First question is "yes" - include Q1, Q2, Q3, Q5, and conditionally Q4
                    const thirdQAnswer = answers[3] !== undefined ? answers[3] : (previousAnswers[3] !== undefined ? previousAnswers[3] : null);
                    const shouldIncludeSensitiveQ = thirdQAnswer === true;
                    
                    // Check if Europe is selected in Q8 (continents)
                    const continentsAnswerForSubmit = answers[8] !== undefined ? answers[8] : (previousAnswers[8] !== undefined ? previousAnswers[8] : []);
                    const hasEuropeSelectedForSubmit = Array.isArray(continentsAnswerForSubmit) && continentsAnswerForSubmit.includes("Europe");
                    
                    // Check if Q14 (data transfer outside country) is answered "Yes"
                    const dataTransferAnswerForSubmit = answers[14] !== undefined ? answers[14] : (previousAnswers[14] !== undefined ? previousAnswers[14] : null);
                    const shouldIncludeCountriesQ = dataTransferAnswerForSubmit === true;
                    
                    questionsToAnswer = [
                      screeningQuestions[0], // Q1: Does system collect PI?
                      screeningQuestions[1], // Q2: System description
                      screeningQuestions[2], // Q3: Sensitive data yes/no
                      ...(shouldIncludeSensitiveQ ? [screeningQuestions[3]] : []), // Q4: Sensitive data categories (only if Q3 is yes)
                      screeningQuestions[4],  // Q5: Non-sensitive data categories
                      screeningQuestions[5],  // Q6: Data subject groups
                      screeningQuestions[6],  // Q7: Data collection purposes
                      screeningQuestions[7],  // Q8: Continents
                      ...(hasEuropeSelectedForSubmit ? [screeningQuestions[8]] : []), // Q9: GDPR compliance (only if Europe is selected, right after Q8)
                      screeningQuestions[9],   // Q10: Data processing scale (after Q9)
                      screeningQuestions[10],  // Q11: Upstream systems (page 3)
                      screeningQuestions[11],   // Q12: Data storage location (page 3)
                      screeningQuestions[12],  // Q13: Downstream systems (page 3)
                      screeningQuestions[13],  // Q14: Data transfer outside country (page 3)
                      ...(shouldIncludeCountriesQ ? [screeningQuestions[14]] : []), // Q15: Countries (only if Q14 is Yes)
                      screeningQuestions[15],  // Q16: Group companies/affiliates/partners (page 3)
                      screeningQuestions[16],  // Q17: Security measures (page 4)
                      screeningQuestions[17],  // Q18: Access rights review frequency (page 4)
                      screeningQuestions[18],  // Q20: Third-party vendors/processors (page 4)
                      ...((answers[20] === true || previousAnswers[20] === true) ? [screeningQuestions[19]] : []), // Q21: Vendor data sharing purposes (only if Q20 is Yes)
                      screeningQuestions[20],  // Q22: Monitoring/CCTV (page 5)
                      screeningQuestions[21],  // Q23: Data subject rights (page 5)
                      screeningQuestions[22],  // Q24: Large-scale processing (page 5)
                      screeningQuestions[23],  // Q25: Criminal convictions data (page 5)
                      screeningQuestions[24],  // Q26: Combining datasets (page 5)
                      screeningQuestions[25],  // Q27: Innovative technologies (page 5)
                      screeningQuestions[26],  // Q28: Government/law enforcement sharing (page 5)
                      screeningQuestions[27],  // Q29: Profiling/automated decision-making (page 5)
                      screeningQuestions[28],  // Q30: Data retention duration (page 5)
                      screeningQuestions[29]   // Q31: Review and delete outdated data (page 5)
                    ];
                  }
                  
                  // Questions are optional - no mandatory validation
                  // For resubmission: allow submission regardless of edits - system owner's choice
                  // They can submit after editing, without editing, or just after replying in chat

                  // Build payload: use edited answers for questions with threads, previous answers for others
                  // Only include questions that should be shown based on first question answer
                  const payload = questionsToAnswer.map(q => {
                  const thread = getThreadForQuestion(q.text);
                  const hasThread = !!thread;
                  // If question has thread and has been edited, use current answer
                  // Otherwise, use previous answer if exists (preserve all previous responses)
                  let answerToUse;
                  if (hasThread && answers[q.id] !== undefined) {
                    // Question has thread and has been edited - use edited answer
                    answerToUse = answers[q.id];
                  } else if (previousAnswers[q.id] !== undefined) {
                    // Use previous answer (preserve all previous responses)
                    answerToUse = previousAnswers[q.id];
                  } else {
                    // Fallback to current answer if no previous answer exists
                    answerToUse = answers[q.id];
                  }
                  
                  // Handle different question types
                  if (q.type === "text") {
                    // For text questions, store text in notes field, answer as true
                    return {
          question: q.text,
                      answer: true, // Indicates question is answered
                      notes: answerToUse || ""
                    };
                  } else if (q.type === "multiselect") {
                    // For multiselect questions, store JSON array in notes field, answer as true
                    // Include "Other" text if provided (not for Q8 - continents)
                    const selectedItems = Array.isArray(answerToUse) ? answerToUse : [];
                    // Check if we have current "Other" text input (not for Q8)
                    const currentOtherText = q.id !== 8 ? otherAnswers[q.id]?.trim() : null;
                    
                    // Check if previous answer had "Other" items (for resubmission when not edited)
                    // Skip for Q8 (continents) as it doesn't have "Other" option
                    const previousOtherItems = q.id !== 8
                      ? selectedItems.filter(item => typeof item === 'string' && item.startsWith('Other: '))
                      : [];
                    const previousOtherText = previousOtherItems.length > 0 
                      ? previousOtherItems[0].replace('Other: ', '')
                      : null;
                    
                    // Use current "Other" text if available, otherwise preserve previous "Other" text
                    const otherText = currentOtherText || previousOtherText;
                    
                    // Filter out "Other: " items from selectedItems (we'll add it back if needed)
                    // Skip for Q8 (continents)
                    const cleanItems = q.id !== 8
                      ? selectedItems.filter(item => !(typeof item === 'string' && item.startsWith('Other: ')))
                      : selectedItems;
                    
                    // Include "Other" text if available (not for Q8)
                    const itemsToStore = (q.id !== 8 && otherText)
                      ? [...cleanItems, `Other: ${otherText}`]
                      : cleanItems;
                    
                    return {
                      question: q.text,
                      answer: true, // Indicates question is answered
                      notes: JSON.stringify(itemsToStore)
                    };
                  } else if (q.type === "select") {
                    // For select/dropdown questions, store selected value in notes field, answer as true
                    // For Q12 (data storage), if "Other" is selected, include provider details
                    let notesValue = answerToUse || "";
                    if (q.id === 12 && answerToUse === "Other") {
                      const currentOtherText = otherAnswers[q.id]?.trim();
                      // Check if previous answer had provider details (for resubmission when not edited)
                      const previousAnswer = previousAnswers[q.id];
                      const previousOtherText = previousAnswer && typeof previousAnswer === 'string' && previousAnswer.includes(" - Provider: ") 
                        ? previousAnswer.split(" - Provider: ")[1]
                        : null;
                      const providerDetails = currentOtherText || previousOtherText || "";
                      if (providerDetails) {
                        notesValue = `${answerToUse} - Provider: ${providerDetails}`;
                      }
                    }
                    return {
                      question: q.text,
                      answer: true, // Indicates question is answered
                      notes: notesValue
                    };
                  } else {
                    // For boolean questions, store boolean in answer field
                    return {
                      question: q.text,
                      answer: !!answerToUse,
                      notes: ""
                    };
                  }
                });
                
                try {
                  setLoading(true);
                  setError("");
                  setSubmitMsg("");
                  
          const res = await submitScreening(id, payload);
                  setSubmitMsg(`Submitted successfully! Status: ${res.next_status || res.message}`);
                  
                  // Reload assessment and answers to get updated status
                  const assessments = await fetchAssessments();
                  const found = assessments.find(a => a.id === parseInt(id));
                  if (found) {
                    setAssessment(found);
                  }
                  
                  // Reload answers to show updated state
                  try {
                    const savedAnswers = await getScreeningAnswers(parseInt(id));
                    if (savedAnswers && savedAnswers.length > 0) {
                      const answersMap = {};
                      savedAnswers.forEach((ans) => {
                        const question = screeningQuestions.find(q => q.text === ans.question);
                        if (question) {
                          if (question.type === "text") {
                            // For text questions, store the text from notes field
                            answersMap[question.id] = ans.notes || "";
                          } else if (question.type === "multiselect") {
                            // For multiselect questions, parse JSON array from notes field
                            try {
                              answersMap[question.id] = ans.notes ? JSON.parse(ans.notes) : [];
                            } catch (e) {
                              answersMap[question.id] = [];
                            }
                          } else {
                            // For boolean questions, store the boolean value
                            answersMap[question.id] = ans.answer;
                          }
                        }
                      });
                      setPreviousAnswers(answersMap);
                      setAnswers(answersMap);
                    }
                  } catch (e) {
                    // Not critical if reload fails
                    console.error("Failed to reload answers:", e);
                  }
                  
                  setEditingQuestion(null);
        } catch(e) {
                  setSubmitMsg("");
                  const errorMessage = e.message || "Failed to submit screening. Please try again.";
                  setError(errorMessage);
                  console.error("Submission error:", e);
                } finally {
                  setLoading(false);
                }
              }}
              sx={{ 
                py: 1.5, 
                textTransform: 'none', 
                fontWeight: 600,
                bgcolor: '#1e3a8a',
                '&:hover': { bgcolor: '#1e40af' },
                borderRadius: 2,
                px: 3
              }}
            >
                {loading ? "Submitting..." : Object.keys(previousAnswers).length > 0 ? "Resubmit Assessment" : "Submit Assessment"}
              </Button>
            );
          })()}
            {/* Show status message if assessment is already submitted (but not completed, as completed status is shown in the top alert) */}
            {isOwner && assessment?.status !== 'screening' && assessment?.status !== 'completed' && Object.keys(previousAnswers).length > 0 && (
              <Alert severity={canResubmit ? "info" : "success"} sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Assessment has been submitted. Status: <strong>{assessment?.status?.replace('_', ' ').toUpperCase() || 'Submitted'}</strong>
                  {canResubmit && threads.length > 0 && (
                    <span> • You can edit questions needing clarification or reply in chat, then resubmit.</span>
                  )}
                  {!canResubmit && (
                    <span> • Waiting for approver review. You cannot resubmit until the approver has reviewed this assessment.</span>
                  )}
                </Typography>
              </Alert>
            )}
          </Box>
        )}
        {submitMsg && <Alert severity="success" sx={{ mt: 2 }}>{submitMsg}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
        
        {/* Status update buttons for approvers - at the end of questions */}
        {/* Show buttons when approver is reviewing and assessment is not in initial screening or already completed */}
        {/* Allow approvers to mark as completed even after red flag, and to change red flag status */}
        {isApprover && assessment && assessment.status !== 'screening' && assessment.status !== 'completed' && (
          <Card sx={{ mt: 4, p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
              Assessment Review Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                disabled={loading}
                onClick={() => handleStatusUpdate('completed')}
                sx={{ 
                  py: 1.5, 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Mark as Completed
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                disabled={loading}
                onClick={() => handleStatusUpdate('red_flag')}
                sx={{ 
                  py: 1.5, 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Raise Red Flag
              </Button>
            </Box>
          </Card>
        )}

        {/* Delete button for approvers and system owners */}
        {canDelete && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={loading}
              onClick={() => setDeleteConfirmOpen(true)}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                borderColor: '#d32f2f',
                '&:hover': {
                  borderColor: '#c62828',
                  bgcolor: '#ffebee'
                }
              }}
            >
              Delete Assessment
            </Button>
          </Box>
        )}
      </Container>
      
      <Dialog open={popupIdx !== null} onClose={() => setPopupIdx(null)} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">Raise a question</DialogTitle>
        <DialogContent>
            <Typography sx={{ mb: 2 }}><b>About:</b> {popupIdx !== null ? screeningQuestions[popupIdx].text : ""}</Typography>
            <TextField 
              autoFocus 
              fullWidth 
              multiline 
              minRows={3}
            label="Ask your question or clarification"
            value={popupText}
            onChange={e => setPopupText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopupIdx(null)}>Cancel</Button>
            <Button 
              variant="contained"
            onClick={() => {
              if (popupIdx !== null && popupText.trim()) {
                handleSendQuestion(screeningQuestions[popupIdx].text, popupText.trim());
              }
            }}
            disabled={!popupText.trim()}
            >
              Send
            </Button>
        </DialogActions>
      </Dialog>

      {/* Chat Drawer - Show for both approvers and system owners */}
      {chatOpen && selectedThread && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            right: 0, 
            top: 0, 
            width: 400, 
            height: '100vh', 
            p: 3, 
            overflowY: 'auto',
            boxShadow: '-4px 0 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            bgcolor: 'white',
            borderLeft: '1px solid #e5e7eb'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>Q&A Discussion</Typography>
            <IconButton 
              onClick={() => setChatOpen(false)} 
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {threads.find(t => t.id === selectedThread) && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
                    {threads.find(t => t.id === selectedThread)?.question_text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Asked by: {threads.find(t => t.id === selectedThread)?.opener_email || 'Unknown'}
                  </Typography>
                </Box>
                {threads.find(t => t.id === selectedThread)?.status === 'open' && (
                  <Chip label="Open" size="small" color="warning" sx={{ ml: 1 }} />
                )}
                {threads.find(t => t.id === selectedThread)?.status === 'resolved' && (
                  <Chip label="Resolved" size="small" color="success" sx={{ ml: 1 }} />
                )}
              </Box>
              {/* End button for approvers - only show if thread is open */}
              {isApprover && threads.find(t => t.id === selectedThread)?.status === 'open' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => handleEndThread(selectedThread)}
                  disabled={loading}
                  sx={{ mt: 1, textTransform: 'none' }}
                >
                  End Discussion
                </Button>
              )}
            </Box>
          )}

          <Box sx={{ mb: 2, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
            {getCommentsForThread(selectedThread).length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No responses yet. Be the first to respond!
              </Typography>
            ) : (
              getCommentsForThread(selectedThread).map((comment, idx) => (
                <Box key={idx} sx={{ 
                  mb: 2, 
                  p: 2, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2,
                  border: '1px solid #e5e7eb'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
                    {comment.author_email || 'Unknown'} • {new Date(comment.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b' }}>{comment.body}</Typography>
                </Box>
              ))
            )}
          </Box>

          {/* Allow both approvers and system owners to respond - only if thread is open */}
          {(isApprover || isOwner) && threads.find(t => t.id === selectedThread)?.status === 'open' && (
            <Box component="form" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const body = formData.get('comment');
              if (body && body.trim()) {
                handleSendComment(selectedThread, body.trim());
                e.target.reset();
              }
            }}>
              <TextField
                name="comment"
                fullWidth
                multiline
                rows={3}
                placeholder="Type your response..."
                sx={{ mb: 2 }}
                disabled={loading}
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                disabled={loading}
                sx={{
                  bgcolor: '#1e3a8a',
                  '&:hover': { bgcolor: '#1e40af' },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5
                }}
              >
                Send Response
              </Button>
            </Box>
          )}
          {/* Show message if thread is resolved */}
          {threads.find(t => t.id === selectedThread)?.status === 'resolved' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                This discussion has been ended by the approver. No further responses can be added.
              </Typography>
            </Alert>
          )}
        </Paper>
      )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this assessment? This action cannot be undone.
                <br />
                <strong>Warning:</strong> All assessment data, including chat history, screening answers, and threads will be permanently deleted.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteAssessment} 
                color="error" 
                variant="contained"
                disabled={loading}
              >
                Delete
              </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
