// src/api.js
export const API_BASE = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function apiLogin(username, passwordHash) {
  try {
    // Verify password hash is correct format (64 hex characters)
    if (!passwordHash || passwordHash.length !== 64) {
      throw new Error("Invalid password hash format");
    }
    
  const body = new URLSearchParams();
  body.set("username", username);
    body.set("password", passwordHash); // This is SHA-256 hash, NOT plain password
    
    // Verify we're sending a hash, not plain password
    if (passwordHash.length !== 64 || !/^[a-f0-9]+$/i.test(passwordHash)) {
      throw new Error("Security error: Invalid password hash format");
    }
    
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || "Login failed");
    }
    return res.json();
  } catch (err) {
    // Check if it's a network error (failed to fetch)
    if (err instanceof TypeError || err.message === "Failed to fetch" || err.message.includes("fetch")) {
      throw new Error("Failed to connect to server. Please make sure the backend is running on http://127.0.0.1:8000");
    }
    // Re-throw other errors
    throw err;
  }
}

export async function apiRegister(email, passwordHash, role) {
  try {
    // Verify we're sending a hash, not plain password
    if (passwordHash.length !== 64 || !/^[a-f0-9]+$/i.test(passwordHash)) {
      throw new Error("Security error: Invalid password hash format");
    }
    
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: passwordHash, role }) // passwordHash is SHA-256, NOT plain password
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Registration failed" }));
      throw new Error(error.detail || "Registration failed");
    }
    return res.json();
  } catch (err) {
    if (err.message) throw err;
    throw new Error("Failed to connect to server. Please make sure the backend is running.");
  }
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to get user info");
  return res.json();
}

export async function fetchAssessments() {
  const res = await fetch(`${API_BASE}/assessments`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch assessments");
  return res.json();
}

export async function createAssessment(data) {
  const res = await fetch(`${API_BASE}/assessments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

export async function submitScreening(assessmentId, answers) {
  const res = await fetch(`${API_BASE}/assessments/${assessmentId}/screening`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error("Screening submit failed");
  return res.json();
}

export async function getScreeningAnswers(assessmentId) {
  const res = await fetch(`${API_BASE}/assessments/${assessmentId}/screening`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    // If 404, return empty array (no answers exist yet)
    if (res.status === 404) {
      return [];
    }
    const error = await res.json().catch(() => ({ detail: "Failed to fetch screening answers" }));
    throw new Error(error.detail || "Failed to fetch screening answers");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getApprovers() {
  const res = await fetch(`${API_BASE}/assessments/approvers/list`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch approvers");
  return res.json();
}

export async function updateAssessmentStatus(assessmentId, status) {
  const res = await fetch(`${API_BASE}/assessments/${assessmentId}/status`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function getThreads(assessmentId) {
  const res = await fetch(`${API_BASE}/threads?assessment_id=${assessmentId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch threads");
  return res.json();
}

export async function createThread(assessmentId, questionText) {
  const userId = parseInt(sessionStorage.getItem('userId') || '0');
  const res = await fetch(`${API_BASE}/threads`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ 
      assessment_id: parseInt(assessmentId),
      question_text: questionText,
      opened_by: userId
    }),
  });
  if (!res.ok) throw new Error("Failed to create thread");
  return res.json();
}

export async function addComment(threadId, body) {
  const userId = parseInt(sessionStorage.getItem('userId') || '0');
  const res = await fetch(`${API_BASE}/threads/comment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ 
      thread_id: parseInt(threadId),
      author_id: userId,
      body
    }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function getThreadComments(threadId) {
  const res = await fetch(`${API_BASE}/threads/${threadId}/comments`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function endThread(threadId) {
  const res = await fetch(`${API_BASE}/threads/${threadId}/end`, {
    method: "POST",
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to end thread" }));
    throw new Error(error.detail || "Failed to end thread");
  }
  return res.json();
}

export async function deleteAssessment(assessmentId) {
  const res = await fetch(`${API_BASE}/assessments/${assessmentId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to delete assessment" }));
    throw new Error(error.detail || "Failed to delete assessment");
  }
  return res.json();
}
