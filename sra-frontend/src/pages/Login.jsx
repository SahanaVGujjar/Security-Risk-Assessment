// src/pages/Login.jsx
import { useState } from "react";
import { apiLogin } from "../api";
import { hashPassword } from "../utils/crypto";
import { Container, TextField, Button, Typography, Box, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    setMsg("");
    
    try {
      // Hash password before sending - NEVER send plain password
      const passwordHash = await hashPassword(password);
      console.log("Password hashed successfully. Hash length:", passwordHash.length);
      console.log("Sending hashed password (first 10 chars):", passwordHash.substring(0, 10) + "...");
      
      // Clear the plain password from memory immediately after hashing
      setPassword("");
      
      const data = await apiLogin(email, passwordHash);
      
      // Store token and user info
      await login(email, data.role, data.access_token);
      
      // Check if user has access
      if (data.role !== 'owner' && data.role !== 'approver') {
        setError("Access denied. Only approvers and system owners can access the dashboard.");
        return;
      }
      
      setMsg("Login successful! Redirecting...");
      // Redirect both system owners and approvers to dashboard
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch(e) {
      console.error("Login error:", e); // Debug
      setError(e.message || "Login failed. Please check your credentials.");
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3, fontWeight: 600 }}>
            Security Risk Assessment Portal
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access your dashboard
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
          
          <TextField 
            fullWidth 
            label="Email" 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField 
            fullWidth 
            type="password" 
            label="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            sx={{ mb: 3 }}
            disabled={loading}
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
          <Button 
            variant="contained" 
            fullWidth
            onClick={handleLogin}
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Button 
            variant="text" 
            fullWidth
            onClick={()=>navigate("/signup")}
            disabled={loading}
          >
            Don't have an account? Sign Up
          </Button>
        </Paper>
    </Container>
    </Box>
  );
}
