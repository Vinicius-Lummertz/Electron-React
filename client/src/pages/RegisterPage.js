import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    cargo_id: '',
  });
  const [cargos, setCargos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Busca os cargos da API para preencher o select
    axios.get('http://localhost:3001/api/cargos')
      .then(res => {
        setCargos(res.data);
        if (res.data.length > 0) {
          // Pré-seleciona o primeiro cargo
          setFormData(prev => ({ ...prev, cargo_id: res.data[0].id }));
        }
      })
      .catch(err => {
        console.error("Erro ao buscar cargos", err);
        setError("Não foi possível carregar os cargos.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    axios.post('http://localhost:3001/api/auth/register', formData)
      .then(res => {
        setSuccess('Usuário cadastrado com sucesso! Redirecionando para o login...');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Erro ao cadastrar.");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-primary">Criar Nova Conta</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          {success && <p className="text-sm text-center text-green-500">{success}</p>}
          
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" required className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha" required className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          <select name="cargo_id" value={formData.cargo_id} onChange={handleChange} required className="relative block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            {cargos.map(cargo => (
              <option key={cargo.id} value={cargo.id}>{cargo.nome_cargo}</option>
            ))}
          </select>

          <div>
            <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Cadastrar
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-primary hover:text-primary/80">
            Já tem uma conta? Faça o login
          </Link>
        </div>
      </div>
    </div>
  );
}