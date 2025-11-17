import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiRegister } from "../api";
import { hashPassword } from "../utils/crypto";

const ROLE_OPTIONS = [
  { value: "owner", label: "System Owner" },
  { value: "approver", label: "Approver" },
];

export default function SignUp() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (!email || !password || !role) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    
    try {
      // Hash password before sending - NEVER send plain password
      const passwordHash = await hashPassword(password);
      console.log("Password hashed successfully. Hash length:", passwordHash.length);
      
      // Clear the plain password from memory immediately after hashing
      setPassword("");
      
      await apiRegister(email, passwordHash, role);
      setSuccess("Success! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

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
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Register for Security Risk Assessment Portal
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Full Name" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              fullWidth 
              sx={{mb:2}} 
              required 
              disabled={loading}
            />
            <TextField 
              label="Email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              type="email" 
              fullWidth 
              sx={{mb:2}} 
              required 
              disabled={loading}
            />
            <TextField 
              label="Password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type="password" 
              fullWidth 
              sx={{mb:2}} 
              required 
              disabled={loading}
              autoComplete="new-password"
              data-lpignore="true"
              data-form-type="other"
            />
            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="Role"
                onChange={e => setRole(e.target.value)}
                required
                disabled={loading}
              >
                {ROLE_OPTIONS.map(opt => <MenuItem value={opt.value} key={opt.value}>{opt.label}</MenuItem>)}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={loading || !role}
              sx={{ py: 1.5, mb: 2 }}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <Typography align="center" sx={{mt:2}}>
            Already have an account? <Button variant="text" onClick={()=>navigate("/login")} disabled={loading}>Login</Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}