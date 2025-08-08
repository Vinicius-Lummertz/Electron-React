import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@headlessui/react';
import axios from 'axios';

export default function AddClientModal({ isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    dia_semana_padrao: '',
    horario_padrao: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia apenas os campos de agendamento padrão se eles forem preenchidos
      const payload = {
        ...formData,
        dia_semana_padrao: formData.dia_semana_padrao || null,
        horario_padrao: formData.horario_padrao || null,
      };
      await axios.post('http://localhost:3001/api/clientes', payload);
      setIsOpen(false);
      // Aqui poderíamos chamar um refresh da lista de clientes
    } catch (error) {
      console.error("Erro ao adicionar cliente", error);
    }
  };
  
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold">Adicionar Novo Cliente</Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input type="text" name="nome" onChange={handleChange} placeholder="Nome do Cliente *" required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="tel" name="telefone" onChange={handleChange} placeholder="Telefone" className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="email" name="email" onChange={handleChange} placeholder="Email" className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            
            <div className="pt-4 mt-4 border-t border-gray-600">
                <h3 className="font-semibold text-text-secondary">Agendamento Padrão (Opcional)</h3>
                <div className="flex gap-4 mt-2">
                    <select name="dia_semana_padrao" onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Selecione o dia</option>
                        <option value="1">Segunda-feira</option>
                        <option value="2">Terça-feira</option>
                        <option value="3">Quarta-feira</option>
                        <option value="4">Quinta-feira</option>
                        <option value="5">Sexta-feira</option>
                        <option value="6">Sábado</option>
                        <option value="0">Domingo</option>
                    </select>
                    <input type="time" name="horario_padrao" onChange={handleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary hover:bg-primary/90">Salvar Cliente</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.getElementById('modal-root')
  );
}