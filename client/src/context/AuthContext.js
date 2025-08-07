import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Aqui você poderia ter uma rota /api/auth/me para validar o token
      // e pegar os dados do usuário a cada recarregamento.
      // Por simplicidade, vamos decodificar o que já temos.
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser({ nome: userData.nome, cargo: userData.cargo });
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      navigate('/'); // Redireciona para o dashboard após o login
    } catch (error) {
      console.error('Falha no login:', error.response?.data?.message || 'Erro de conexão');
      // Adicionar lógica para mostrar erro ao usuário
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};