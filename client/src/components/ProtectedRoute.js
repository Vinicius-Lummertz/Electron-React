import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redireciona para a página de login, mantendo a rota original no estado
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;