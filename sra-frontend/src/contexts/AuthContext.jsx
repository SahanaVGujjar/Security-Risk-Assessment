import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    const userEmail = sessionStorage.getItem('userEmail');
    const userId = sessionStorage.getItem('userId');
    
    if (token && userRole && (userRole === 'owner' || userRole === 'approver')) {
      // Try to fetch fresh user info
      getCurrentUser()
        .then(userInfo => {
          setUser({ id: userInfo.id, email: userInfo.email, role: userInfo.role, token });
          sessionStorage.setItem('userId', userInfo.id);
          sessionStorage.setItem('userRole', userInfo.role);
          sessionStorage.setItem('userEmail', userInfo.email);
          setLoading(false);
        })
        .catch((err) => {
          // If token is invalid, clear everything
          console.error('Failed to get user:', err);
          sessionStorage.clear();
          setUser(null);
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email, role, token) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userEmail', email);
    
    // Fetch user ID
    try {
      const userInfo = await getCurrentUser();
      sessionStorage.setItem('userId', userInfo.id);
      setUser({ id: userInfo.id, email: userInfo.email, role: userInfo.role, token });
    } catch (e) {
      // Fallback to stored values
      setUser({ email, role, token });
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

