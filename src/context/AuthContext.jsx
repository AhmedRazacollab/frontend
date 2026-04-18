import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('helplytics_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('helplytics_token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      api.get('/users/profile')
        .then(response => setUser(response.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else { 
      localStorage.removeItem('helplytics_token');
      delete api.defaults.headers.common.Authorization;
      setLoading(false);
    }
  }, [token]);

  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
