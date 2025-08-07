import React from 'react';

export default function AppointmentCard({ atendimento }) {
  return (
    <div className="p-3 mb-3 text-sm rounded-lg cursor-pointer bg-surface hover:bg-gray-700">
      <p className="font-bold text-text-primary">{atendimento.cliente_nome}</p>
      <p className="text-text-secondary">{atendimento.servico_descricao}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="px-2 py-1 text-xs rounded-full bg-primary/30 text-primary">{atendimento.status}</span>
        <span className="text-xs text-text-secondary">{atendimento.profissional_nome}</span>
      </div>
    </div>
  );
}