import { createContext, useState, useEffect } from 'react';
import api from '../lib/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/api/auth/profile');
          setUser(data);
        } catch (error) {
          console.error('Error fetching user profile', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const signup = async (name, email, password, role) => {
    const { data } = await api.post('/api/auth/signup', { name, email, password, role });
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post('/api/auth/verify-signup-otp', { email, otp });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
