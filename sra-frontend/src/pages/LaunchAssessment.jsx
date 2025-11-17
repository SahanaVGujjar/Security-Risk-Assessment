// src/pages/LaunchAssessment.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Alert,
  CircularProgress
} from "@mui/material";
import { RocketLaunch as LaunchIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { createAssessment, fetchAssessments, getApprovers } from "../api";

export default function LaunchAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvers, setApprovers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    assessmentType: "new", // "new" or "existing"
    existingAssessmentId: "",
    approverId: ""
  });
  const [existingAssessments, setExistingAssessments] = useState([]);

  useEffect(() => {
    // Load approvers and existing assessments
    const loadData = async () => {
      try {
        setLoading(true);
        const [approversData, assessmentsData] = await Promise.all([
          getApprovers(),
          fetchAssessments()
        ]);
        console.log("Approvers loaded:", approversData); // Debug
        setApprovers(approversData || []);
        // Filter assessments that belong to this user and have answers (approved or completed)
        setExistingAssessments((assessmentsData || []).filter(a => 
          a.owner_user_id === user?.id && (a.status === 'approved' || a.status === 'completed')
        ));
        // Don't set error for empty approvers - just show message in dropdown
      } catch (e) {
        console.error("Failed to load data:", e);
        setError(`Failed to load data: ${e.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadData();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please enter assessment name");
      return;
    }
    if (formData.assessmentType === "existing" && !formData.existingAssessmentId) {
      setError("Please select an existing assessment");
      return;
    }
    if (!formData.approverId) {
      setError("Please select an approver");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createAssessment({
        title: formData.name,
        is_new: formData.assessmentType === "new",
        approver_user_id: parseInt(formData.approverId),
        existing_assessment_id: formData.assessmentType === "existing" ? parseInt(formData.existingAssessmentId) : null
      });
      navigate("/");
    } catch (e) {
      setError(e.message || "Failed to create assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f5f7fa',
      py: 4
    }}>
      <Container maxWidth="md">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <LaunchIcon sx={{ fontSize: 40, color: '#1e3a8a', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Launch Assessment
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Assessment Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ mb: 3 }}
              disabled={loading}
            />

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Assessment Type
              </Typography>
              <RadioGroup
                value={formData.assessmentType}
                onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value, existingAssessmentId: "" })}
              >
                <FormControlLabel value="new" control={<Radio />} label="New Assessment" />
                <FormControlLabel value="existing" control={<Radio />} label="Existing Assessment" />
              </RadioGroup>
            </FormControl>

            {formData.assessmentType === "existing" && (
              <FormControl fullWidth sx={{ mb: 3 }} required>
                <InputLabel>Select Existing Assessment</InputLabel>
                <Select
                  value={formData.existingAssessmentId}
                  label="Select Existing Assessment"
                  onChange={(e) => setFormData({ ...formData, existingAssessmentId: e.target.value })}
                  disabled={loading || existingAssessments.length === 0}
                >
                  {existingAssessments.length === 0 ? (
                    <MenuItem disabled>No existing assessments available</MenuItem>
                  ) : (
                    existingAssessments.map((assessment) => (
                      <MenuItem key={assessment.id} value={assessment.id}>
                        {assessment.title} - {assessment.status}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel>Select Approver</InputLabel>
              <Select
                value={formData.approverId}
                label="Select Approver"
                onChange={(e) => setFormData({ ...formData, approverId: e.target.value })}
                disabled={loading || approvers.length === 0}
              >
                {approvers.length === 0 ? (
                  <MenuItem disabled value="">
                    No approvers available
                  </MenuItem>
                ) : (
                  approvers.map((approver) => (
                    <MenuItem key={approver.id} value={approver.id}>
                      {approver.name || approver.email}
                    </MenuItem>
                  ))
                )}
              </Select>
              {approvers.length === 0 && !loading && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1.5 }}>
                  No approvers found. Please create approver accounts first (e.g., harry@example.com, jas@example.com, alice@example.com)
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#1e3a8a',
                  '&:hover': { bgcolor: '#1e40af' },
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Launch Assessment"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

