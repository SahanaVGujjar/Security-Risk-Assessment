// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchAssessments } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  AppBar, 
  Toolbar, 
  IconButton,
  Alert,
  CircularProgress
} from "@mui/material";
import { 
  Assessment as AssessmentIcon, 
  Add as AddIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const statusColors = {
  screening: { color: '#ff9800', bg: '#fff3e0' },
  in_dpia: { color: '#2196f3', bg: '#e3f2fd' },
  awaiting_approval: { color: '#9c27b0', bg: '#f3e5f5' },
  approved: { color: '#4caf50', bg: '#e8f5e9' },
  changes_requested: { color: '#f44336', bg: '#ffebee' },
  completed: { color: '#4caf50', bg: '#e8f5e9' },
  red_flag: { color: '#d32f2f', bg: '#ffebee' }
};

const statusLabels = {
  screening: 'Screening',
  in_dpia: 'In DPIA',
  awaiting_approval: 'Awaiting Approval',
  approved: 'Approved',
  changes_requested: 'Changes Requested',
  completed: 'Completed',
  red_flag: 'Red Flag'
};

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const reload = async () => {
    try {
      setLoading(true);
      const data = await fetchAssessments();
      setItems(data);
      setError("");
    } catch (e) {
      setError("Failed to load assessments. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const getStatusChip = (status) => {
    const config = statusColors[status] || { color: '#757575', bg: '#f5f5f5' };
    return (
      <Chip
        label={statusLabels[status] || status}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem'
        }}
      />
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#1e3a8a', borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Dashboard
          </Typography>
          {user?.role === 'owner' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/launch")}
              sx={{
                bgcolor: '#1e3a8a',
                '&:hover': { bgcolor: '#1e40af' },
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Launch Assessment
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'white' }}>
            <AssessmentIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No assessments found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role === 'owner' 
                ? 'Launch your first assessment to get started'
                : 'No assessments have been assigned yet'}
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {items.map((assessment) => (
              <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    },
                    border: '1px solid #e5e7eb',
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', flex: 1 }}>
                        {assessment.title}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      {getStatusChip(assessment.status)}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Created: {new Date(assessment.created_at).toLocaleDateString()}
                    </Typography>
                    {user?.role === 'approver' && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          System Owner: {assessment.owner_name || 'Unknown'}
                        </Typography>
                        {assessment.approver_name && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Approver: {assessment.approver_name}
                          </Typography>
                        )}
                      </>
                    )}
                    {assessment.status === 'screening' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        component={Link}
                        to={`/assessments/${assessment.id}/screening`}
                        sx={{
                          mt: 2,
                          borderColor: '#1e3a8a',
                          color: '#1e3a8a',
                          '&:hover': {
                            borderColor: '#1e40af',
                            bgcolor: '#eff6ff'
                          },
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Start Screening
                      </Button>
                    )}
                    {assessment.status !== 'screening' && assessment.status !== 'completed' && (
                      <Button
                        variant="text"
                        fullWidth
                        component={Link}
                        to={`/assessments/${assessment.id}/screening`}
                        sx={{
                          mt: 2,
                          color: '#1e3a8a',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        View Details
                      </Button>
                    )}
                    {assessment.status === 'completed' && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2, fontStyle: 'italic' }}>
                          Assessment completed - No PI data collected
                        </Typography>
                        <Button
                          variant="text"
                          fullWidth
                          component={Link}
                          to={`/assessments/${assessment.id}/screening`}
                          sx={{
                            mt: 1,
                            color: '#1e3a8a',
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          View Details
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
    </Container>

    </Box>
  );
}
