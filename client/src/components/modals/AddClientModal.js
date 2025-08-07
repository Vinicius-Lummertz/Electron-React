import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // Importe o ReactDOM
import { Dialog } from '@headlessui/react';
import axios from 'axios';

export default function AddClientModal({ isOpen, setIsOpen }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/clientes', { nome, telefone, email });
      setIsOpen(false);
      // O ideal aqui seria também chamar uma função para atualizar a lista de clientes na tela
    } catch (error) {
      console.error("Erro ao adicionar cliente", error);
    }
  };
  
  // Se o modal não estiver aberto, não renderizamos nada.
  if (!isOpen) return null;

  // Usamos o Portal para renderizar o modal no #modal-root
  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      {/* O fundo escurecido (backdrop) */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* O container para centralizar o painel do modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold">Adicionar Novo Cliente</Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do Cliente" required className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Telefone" className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded bg-primary hover:bg-primary/90">Salvar Cliente</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.getElementById('modal-root') // O segundo argumento do portal: o destino.
  );
}