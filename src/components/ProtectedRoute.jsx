import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" />;
}
