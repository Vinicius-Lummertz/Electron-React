import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AgendaProvider } from './context/AgendaContext'; // Importa

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgendaPage from './pages/AgendaPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                {/* Envolvemos o Layout com o provider da Agenda */}
                <AgendaProvider>
                  <MainLayout />
                </AgendaProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<AgendaPage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;