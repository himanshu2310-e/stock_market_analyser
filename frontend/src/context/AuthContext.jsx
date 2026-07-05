import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../config/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* Restore session on mount */
  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /* Persist user data whenever it changes */
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const signup = useCallback(
    async (name, email, password) => {
      const { data } = await api.post('/auth/signup', {
        name,
        email,
        password,
      });
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
      return data;
    },
    [navigate]
  );

  const login = useCallback(
    async (email, password, rememberMe = false) => {
      const { data } = await api.post('/auth/login', {
        email,
        password,
        rememberMe,
      });

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', data.data.token);
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
      return data;
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* Proceed with local logout even if server call fails */
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
    navigate('/');
  }, [navigate]);

  const forgotPassword = useCallback(async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    toast.success(data.message);
    return data;
  }, []);

  const resetPassword = useCallback(
    async (token, password) => {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      localStorage.setItem('token', data.data.token);
      toast.success('Password reset successfully!');
      navigate('/dashboard');
      return data;
    },
    [navigate]
  );

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
