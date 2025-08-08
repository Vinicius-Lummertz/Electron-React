import React from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@headlessui/react';
import { useAgenda } from '../../context/AgendaContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AppointmentDetailsModal() {
  const { isDetailsModalOpen, closeDetailsModal, selectedAppointment, triggerRefresh } = useAgenda();

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    const isConfirmed = window.confirm(`Tem certeza que deseja excluir o agendamento de ${selectedAppointment.cliente_nome}?`);
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/atendimentos/${selectedAppointment.id}`);
        closeDetailsModal();
        triggerRefresh(); // Atualiza o calendário
      } catch (error) {
        console.error("Erro ao excluir agendamento", error);
        alert("Não foi possível excluir o agendamento.");
      }
    }
  };
  
  const handleEdit = () => {
    // Na próxima etapa, isso abrirá o modal de edição
    console.log("Editar agendamento:", selectedAppointment);
    alert("Funcionalidade de edição a ser implementada.");
  };

  if (!isDetailsModalOpen || !selectedAppointment) return null;

  return ReactDOM.createPortal(
    <Dialog open={isDetailsModalOpen} onClose={closeDetailsModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold border-b border-gray-600 pb-2">
            Detalhes do Agendamento
          </Dialog.Title>
          
          <div className="mt-4 space-y-3">
            <p><strong className="text-text-secondary w-28 inline-block">Cliente:</strong> {selectedAppointment.cliente_nome}</p>
            <p><strong className="text-text-secondary w-28 inline-block">Serviço:</strong> {selectedAppointment.servico_descricao}</p>
            <p><strong className="text-text-secondary w-28 inline-block">Profissional:</strong> {selectedAppointment.profissional_nome}</p>
            <p><strong className="text-text-secondary w-28 inline-block">Início:</strong> {format(parseISO(selectedAppointment.data_hora_inicio), "PPP 'às' HH:mm", { locale: ptBR })}</p>
            <p><strong className="text-text-secondary w-28 inline-block">Término:</strong> {format(parseISO(selectedAppointment.data_hora_fim), "HH:mm")}</p>
            <p><strong className="text-text-secondary w-28 inline-block">Status:</strong> <span className="px-2 py-1 text-xs rounded-full bg-primary/30 text-primary">{selectedAppointment.status}</span></p>
          </div>

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-600">
            <button onClick={handleDelete} type="button" className="flex items-center gap-2 px-4 py-2 rounded text-red-400 bg-red-900/50 hover:bg-red-900">
              <TrashIcon className="w-5 h-5" /> Excluir
            </button>
            <div className='flex gap-4'>
              <button type="button" onClick={closeDetailsModal} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Fechar</button>
              <button onClick={handleEdit} type="button" className="flex items-center gap-2 px-4 py-2 rounded bg-primary hover:bg-primary/90">
                <PencilSquareIcon className="w-5 h-5" /> Editar
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.getElementById('modal-root')
  );
}