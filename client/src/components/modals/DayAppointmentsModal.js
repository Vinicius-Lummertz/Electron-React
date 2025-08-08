import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@headlessui/react';
import { useAgenda } from '../../context/AgendaContext';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function DayAppointmentsModal() {
  const { isDayModalOpen, closeDayModal, selectedDate, atendimentos, openDetailsModal } = useAgenda();

  const dailyAppointments = useMemo(() => {
    if (!selectedDate) return [];

    // AQUI A CORREÇÃO: `selectedDate` já é um objeto Date, não precisa de new Date()
    const filtered = atendimentos.filter(atendimento => 
      isSameDay(parseISO(atendimento.data_hora_inicio), selectedDate)
    );
    
    return filtered.sort((a, b) => 
      parseISO(a.data_hora_inicio) - parseISO(b.data_hora_inicio)
    );
  }, [selectedDate, atendimentos]);

  const handleDetailsClick = (atendimento) => {
    closeDayModal();
    openDetailsModal(atendimento);
  };

  if (!isDayModalOpen) return null;

  return ReactDOM.createPortal(
    <Dialog open={isDayModalOpen} onClose={closeDayModal} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold border-b border-gray-600 pb-2">
            {/* `selectedDate` já é um objeto Date, pode ser formatado diretamente */}
            Agendamentos para {format(selectedDate, "PPP", { locale: ptBR })}
          </Dialog.Title>
          
          <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
            {dailyAppointments.length > 0 ? (
              dailyAppointments.map(atendimento => (
                <div key={atendimento.id} className="flex items-center gap-4 animate-fade-in">
                  <div className="w-[15%] text-right text-text-secondary font-mono text-lg">
                    {format(parseISO(atendimento.data_hora_inicio), 'HH:mm')}
                  </div>
                  <div className="flex items-center justify-between w-[85%] p-3 rounded-md bg-background">
                    <span className="font-semibold">{atendimento.cliente_nome}</span>
                    <button onClick={() => handleDetailsClick(atendimento)} className="flex items-center gap-1 px-2 py-1 text-xs rounded text-primary hover:bg-primary/20">
                      <InformationCircleIcon className="w-4 h-4"/>
                      Detalhes
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-text-secondary">Nenhum agendamento para este dia.</p>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button type="button" onClick={closeDayModal} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Fechar</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>,
    document.getElementById('modal-root')
  );
}