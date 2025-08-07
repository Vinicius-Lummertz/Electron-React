import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AppointmentCard from '../components/AppointmentCard';
import { useAgenda } from '../context/AgendaContext';

const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function AgendaPage() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useAgenda(); // Pega a "chave" do contexto

  // Usamos useCallback para evitar recriar a função a cada renderização
  const fetchAppointments = useCallback(() => {
    setLoading(true);
    axios.get('http://localhost:3001/api/atendimentos')
      .then(res => {
        setAtendimentos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar atendimentos:", err);
        setLoading(false);
      });
  }, []);

  // O useEffect agora depende do refreshKey. Quando ele mudar, a função roda de novo.
  useEffect(() => {
    fetchAppointments();
  }, [refreshKey, fetchAppointments]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary">Agenda da Semana</h1>
      
      {loading ? (
        <p className="mt-4 text-text-secondary">Carregando agendamentos...</p>
      ) : (
        <div className="grid grid-cols-6 gap-4 mt-6">
          {diasDaSemana.map(dia => (
            <div key={dia} className="p-2 rounded-lg bg-background/50">
              <h2 className="mb-4 font-semibold text-center text-text-primary">{dia}</h2>
              <div>
                {dia === 'Segunda' && atendimentos.length > 0 ? (
                   atendimentos.map(atendimento => (
                    <AppointmentCard key={atendimento.id} atendimento={atendimento} />
                   ))
                ) : (
                  dia === 'Segunda' && <p className="text-xs text-center text-text-secondary">Nenhum agendamento.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}