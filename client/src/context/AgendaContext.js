import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AgendaContext = createContext();

export const AgendaProvider = ({ children }) => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Estado para o modal de dia
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // --- NOVOS ESTADOS para o modal de detalhes ---
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });


  const fetchAppointments = useCallback(() => {
    setLoading(true);
    axios.get('http://localhost:3001/api/atendimentos')
      .then(res => setAtendimentos(res.data))
      .catch(err => console.error("Erro ao buscar atendimentos:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [refreshKey, fetchAppointments]);

  const triggerRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Funções para o modal de dia
  const openDayModal = (date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };
  const closeDayModal = () => setIsDayModalOpen(false);

  const openContextMenu = (position, date) => {
    setContextMenuPosition(position);
    setSelectedDate(date);
    setIsContextMenuOpen(true);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  // --- NOVAS FUNÇÕES para o modal de detalhes ---
  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAppointment(null);
  };

  const value = {
    atendimentos,
    loading,
    triggerRefresh,
    isDayModalOpen,
    selectedDate,
    openDayModal,
    closeDayModal,
    isDetailsModalOpen,
    selectedAppointment,
    openDetailsModal,
    closeDetailsModal,
    isContextMenuOpen, 
    contextMenuPosition, 
    openContextMenu, 
    closeContextMenu
  };

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
};

export const useAgenda = () => useContext(AgendaContext);