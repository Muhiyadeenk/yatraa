import React, { createContext, useState, useEffect, useMemo } from 'react';

export const AuthContext = createContext();

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('yathraa_token'));
  const [loading, setLoading] = useState(true);

  const safeParse = (key) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const storedUser = safeParse('yathraa_user');
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();
      localStorage.setItem('yathraa_token', data.access);
      localStorage.setItem('yathraa_refresh_token', data.refresh);
      setToken(data.access);

      const profile = await fetch(`${API_BASE}/auth/profile/`, {
        headers: { 'Authorization': `Bearer ${data.access}` }
      });

      if (!profile.ok) throw new Error('Failed to load profile');

      const userData = await profile.json();
      setUser(userData);
      localStorage.setItem('yathraa_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errorMsg = 'Registration failed';
        try {
          const err = await res.json();
          if (err.detail) {
            errorMsg = err.detail;
          } else if (typeof err === 'object') {
            // Extract the first error message from the dictionary
            const firstKey = Object.keys(err)[0];
            const errorValue = err[firstKey];
            if (Array.isArray(errorValue)) {
              errorMsg = `${firstKey}: ${errorValue[0]}`;
            } else if (typeof errorValue === 'string') {
              errorMsg = `${firstKey}: ${errorValue}`;
            } else {
              errorMsg = JSON.stringify(err);
            }
          }
        } catch (e) {
          errorMsg = `Error ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      // Keep local admin panel users list updated
      const existingUsers = safeParse('yathraa_users') || [
        { id: 1, username: 'admin', email: 'admin@yatraa.com', is_staff: true, first_name: 'Admin', last_name: 'User' }
      ];
      const newUser = {
        id: Date.now(),
        username: payload.username,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        is_staff: false
      };
      localStorage.setItem('yathraa_users', JSON.stringify([...existingUsers, newUser]));

      return await login(payload.username, payload.password);
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('yathraa_user');
    localStorage.removeItem('yathraa_token');
    localStorage.removeItem('yathraa_refresh_token');
  };

  const toggleWishlist = (hotel) => {
    if (!user) return;
    const list = safeParse('yathraa_wishlist') || [];
    const exists = list.find(item => item.id === hotel.id && item.user_email === user.email);
    
    const updated = exists
      ? list.filter(item => !(item.id === hotel.id && item.user_email === user.email))
      : [...list, { ...hotel, user_email: user.email }];

    localStorage.setItem('yathraa_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const isInWishlist = (hotelId) => {
    if (!user) return false;
    const list = safeParse('yathraa_wishlist') || [];
    return list.some(item => item.id === hotelId && item.user_email === user.email);
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    toggleWishlist,
    isInWishlist
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
