import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { useAgenda } from '../../context/AgendaContext';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';

export default function AddAppointmentModal({ isOpen, setIsOpen, preselectedDate }) {
  const [clientMode, setClientMode] = useState('avulso'); // 'avulso' ou 'fixo'
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [isEndTimeManual, setIsEndTimeManual] = useState(false);
  
  const { triggerRefresh } = useAgenda();

  const initialFormData = useMemo(() => ({
    cliente_id: '',
    cliente_nome_avulso: '',
    profissional_id: '',
    servico_id: '',
    start_time: '09:00', // Horário de início padrão
    end_time: '10:00', // Horário de fim padrão
  }), []);

  const [formData, setFormData] = useState(initialFormData);

  // Carrega os dados para os dropdowns quando o modal abre
  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:3001/api/clientes').then(res => setClientes(res.data));
      axios.get('http://localhost:3001/api/servicos').then(res => setServicos(res.data));
      axios.get('http://localhost:3001/api/usuarios?cargo=Profissional').then(res => setProfissionais(res.data));
      
      // Reseta o formulário para o estado inicial toda vez que o modal abre
      setFormData(initialFormData);
      setIsEndTimeManual(false);
    }
  }, [isOpen, initialFormData]);

  // Calcula o horário final automaticamente quando o serviço ou horário de início muda
  useEffect(() => {
    if (isEndTimeManual || !formData.start_time || !formData.servico_id) return;

    const selectedService = servicos.find(s => s.id === parseInt(formData.servico_id));
    if (selectedService && preselectedDate) {
      const [hours, minutes] = formData.start_time.split(':');
      let startDate = setMinutes(setHours(preselectedDate, hours), minutes);
      const endDate = addMinutes(startDate, selectedService.duracao_minutos);
      setFormData(prev => ({ ...prev, end_time: format(endDate, 'HH:mm') }));
    }
  }, [formData.start_time, formData.servico_id, servicos, isEndTimeManual, preselectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Constrói as datas completas em formato ISO
    const [startHours, startMinutes] = formData.start_time.split(':');
    const data_hora_inicio = setMinutes(setHours(preselectedDate, startHours), startMinutes).toISOString();
    
    const [endHours, endMinutes] = formData.end_time.split(':');
    const data_hora_fim = setMinutes(setHours(preselectedDate, endHours), endMinutes).toISOString();

    const selectedService = servicos.find(s => s.id === parseInt(formData.servico_id));

    const payload = {
      cliente_id: clientMode === 'fixo' ? formData.cliente_id : null,
      cliente_nome_avulso: clientMode === 'avulso' ? formData.cliente_nome_avulso : null,
      profissional_id: formData.profissional_id,
      servico_descricao: selectedService?.nome || 'Serviço avulso',
      data_hora_inicio,
      data_hora_fim,
    };

    try {
      await axios.post('http://localhost:3001/api/atendimentos', payload);
      setIsOpen(false);
      triggerRefresh();
    } catch (error) {
      console.error("Erro ao agendar atendimento", error);
      alert("Falha ao agendar. Verifique os dados.");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg p-6 mx-auto rounded-lg shadow-xl bg-surface text-text-primary">
          <Dialog.Title className="text-xl font-bold">
            Novo Agendamento para {format(preselectedDate, "dd/MM/yyyy")}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            
            {/* Seletor de Modo de Cliente */}
            <div className="flex p-1 space-x-1 rounded-md bg-background">
              <button type="button" onClick={() => setClientMode('avulso')} className={`w-full px-2 py-1 text-sm rounded ${clientMode === 'avulso' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}>Anotar Nome</button>
              <button type="button" onClick={() => setClientMode('fixo')} className={`w-full px-2 py-1 text-sm rounded ${clientMode === 'fixo' ? 'bg-primary text-white' : 'hover:bg-gray-700'}`}>Cliente Fixo</button>
            </div>
            
            {/* Input Híbrido de Cliente */}
            {clientMode === 'avulso' ? (
              <input type="text" name="cliente_nome_avulso" onChange={handleChange} placeholder="Nome do Cliente" required className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
            ) : (
              <select name="cliente_id" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600">
                <option value="">Selecione a Cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            )}

            <select name="profissional_id" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600">
              <option value="">Selecione o Profissional</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            
            <select name="servico_id" onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600">
              <option value="">Selecione o Serviço</option>
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome} ({s.duracao_minutos} min)</option>)}
            </select>
            
            {/* Seleção de Horário */}
            <div className='flex items-end gap-4'>
              <div className='flex-grow'>
                <label className='text-xs text-text-secondary'>Horário de Início</label>
                <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required className="w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600" />
              </div>
              <div className='flex-grow'>
                <label className='text-xs text-text-secondary'>Horário de Fim</label>
                <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} disabled={!isEndTimeManual} required className={`w-full p-2 mt-1 rounded bg-gray-700 border border-gray-600 ${!isEndTimeManual ? 'opacity-50' : ''}`} />
              </div>
            </div>
            <div className="flex items-center">
              <input id="manual-time" type="checkbox" checked={isEndTimeManual} onChange={(e) => setIsEndTimeManual(e.target.checked)} className="w-4 h-4 rounded text-primary bg-gray-700 border-gray-600 focus:ring-primary" />
              <label htmlFor="manual-time" className="ml-2 text-sm text-text-secondary">Definir horário final manualmente</label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-600">
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