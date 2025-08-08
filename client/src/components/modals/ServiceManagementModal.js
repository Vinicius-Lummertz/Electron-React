import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ServiceManagementModal({ isOpen, setIsOpen }) {
  const [servicos, setServicos] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');

  const fetchServices = () => {
    axios.get('http://localhost:3001/api/servicos')
      .then(res => setServicos(res.data))
      .catch(err => console.error("Erro ao buscar serviços:", err));
  };

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const handleAddService = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/servicos', { nome: newServiceName, duracao_minutos: newServiceDuration })
      .then(() => {
        setNewServiceName('');
        setNewServiceDuration('');
        fetchServices(); // Recarrega a lista
      })
      .catch(err => console.error("Erro ao adicionar serviço:", err));
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      axios.delete(`http://localhost:3001/api/servicos/${id}`)
        .then(() => fetchServices())
        .catch(err => console.error("Erro ao excluir serviço:", err));
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold border-b border-gray-600 pb-2">Gerenciar Serviços</Dialog.Title>
          
          <form onSubmit={handleAddService} className="flex items-end gap-4 my-4">
            <div className="flex-grow">
              <label className="text-xs text-text-secondary">Nome do Serviço</label>
              <input type="text" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} required className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600" />
            </div>
            <div>
              <label className="text-xs text-text-secondary">Duração (minutos)</label>
              <input type="number" value={newServiceDuration} onChange={e => setNewServiceDuration(e.target.value)} required className="w-32 p-2 mt-1 rounded bg-gray-700 border border-gray-600" />
            </div>
            <button type="submit" className="px-4 py-2 rounded bg-primary hover:bg-primary/90">Adicionar</button>
          </form>

          <div className="mt-4 border-t border-gray-600 pt-4 max-h-64 overflow-y-auto">
            {servicos.map(servico => (
              <div key={servico.id} className="flex items-center justify-between p-2 rounded hover:bg-background">
                <div>
                  <p className="font-semibold">{servico.nome}</p>
                  <p className="text-sm text-text-secondary">{servico.duracao_minutos} minutos</p>
                </div>
                <button onClick={() => handleDeleteService(servico.id)} className="p-2 text-red-400 rounded-full hover:bg-red-900/50">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-6">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Fechar</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.getElementById('modal-root')
  );
}