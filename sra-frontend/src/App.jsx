// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard.jsx";
import Screening from "./pages/Screening";
import SignUp from "./pages/SignUp";
import LaunchAssessment from "./pages/LaunchAssessment";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
          <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/launch" 
            element={
              <ProtectedRoute>
                <LaunchAssessment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assessments/:id/screening" 
            element={
              <ProtectedRoute>
                <Screening />
              </ProtectedRoute>
            } 
          />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
