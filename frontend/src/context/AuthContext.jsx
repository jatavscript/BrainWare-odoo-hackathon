import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const userData = {
        id: response.data.user._id,
        employeeId: response.data.user.employeeId,
        email: response.data.user.email,
        role: response.data.user.role,
        firstName: response.data.user.personalDetails?.firstName,
        lastName: response.data.user.personalDetails?.lastName,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/signin', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Signin error:', error);
      // Handle network errors
      if (!error.response) {
        return {
          success: false,
          message: 'Cannot connect to server. Please ensure the backend is running on port 5000.',
        };
      }
      // Handle specific error messages
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Sign in failed';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const signUp = async (employeeId, email, password, role) => {
    try {
      const response = await axios.post('/api/auth/signup', {
        employeeId,
        email,
        password,
        role,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      // Handle network errors
      if (!error.response) {
        return {
          success: false,
          message: 'Cannot connect to server. Please ensure the backend is running on port 5000.',
        };
      }
      // Handle specific error messages
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Sign up failed';
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

