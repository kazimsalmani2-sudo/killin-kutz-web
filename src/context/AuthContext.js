"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token and user
    const savedUser = localStorage.getItem('killinkutz_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      localStorage.setItem('killinkutz_user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password, phone = '') => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      localStorage.setItem('killinkutz_user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('killinkutz_user');
  };

  // Dummy function to prevent errors since we removed Firebase Google Auth
  const loginWithGoogle = async () => {
    throw new Error('Google Sign-in is temporarily disabled while we migrate to the new custom backend.');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
