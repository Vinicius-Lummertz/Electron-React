import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { useAgenda } from '../../context/AgendaContext';

export default function AddAppointmentModal({ isOpen, setIsOpen }) {
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [formData, setFormData] = useState({
    cliente_id: '',
    profissional_id: '',
    servico_descricao: '',
    data_hora_inicio: '',
    data_hora_fim: '',
  });
  const { triggerRefresh } = useAgenda();

  useEffect(() => {
    // Carrega os dados para os dropdowns quando o modal abre
    if (isOpen) {
      // Busca clientes
      axios.get('http://localhost:3001/api/clientes')
        .then(res => setClientes(res.data))
        .catch(err => console.error("Erro ao buscar clientes", err));

      // Busca profissionais
      axios.get('http://localhost:3001/api/usuarios?cargo=Profissional')
        .then(res => setProfissionais(res.data))
        .catch(err => console.error("Erro ao buscar profissionais", err));
    }
  }, [isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/atendimentos', formData);
      setIsOpen(false);
      triggerRefresh(); // << A MÁGICA ACONTECE AQUI!
    } catch (error) {
      console.error("Erro ao agendar atendimento", error);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold">Novo Agendamento</Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            
            <select name="cliente_id" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione o Cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <select name="profissional_id" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione o Profissional</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>

            <input type="text" name="servico_descricao" onChange={handleChange} placeholder="Descrição do Serviço (ex: Corte + Escova)" required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            
            <div className='flex gap-4'>
                <input type="datetime-local" name="data_hora_inicio" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="datetime-local" name="data_hora_fim" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary hover:bg-primary/90">Agendar</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.getElementById('modal-root')
  );
}