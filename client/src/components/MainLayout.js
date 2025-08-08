import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import { useAgenda } from '../context/AgendaContext';
import ContextMenu from './common/ContextMenu';
import AddClientModal from './modals/AddClientModal';
import AddAppointmentModal from './modals/AddAppointmentModal';
import DayAppointmentsModal from './modals/DayAppointmentsModal';
import AppointmentDetailsModal from './modals/AppointmentDetailsModal';
import ServiceManagementModal from './modals/ServiceManagementModal';

import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function MainLayout() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const { isContextMenuOpen, contextMenuPosition, closeContextMenu, openDayModal, selectedDate } = useAgenda();
  
  const handleOpenAppointmentModal = () => {
    // Agora, quando abrimos o modal de agendamento, já sabemos a data
    setIsAppointmentModalOpen(true);
  }

  const menuItems = [
    { label: 'Ver Atendimentos do Dia', icon: CalendarDaysIcon, onClick: () => openDayModal(selectedDate) },
    { label: 'Adicionar Atendimento', icon: PlusIcon, onClick: handleOpenAppointmentModal },
  ];

  return (
    <div className="flex h-screen bg-background" onContextMenu={(e) => e.preventDefault()}>
      <Drawer
        openClientModal={() => setIsClientModalOpen(true)}
        openAppointmentModal={handleOpenAppointmentModal}
        openServiceModal={() => setIsServiceModalOpen(true)}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

      <ContextMenu 
        isOpen={isContextMenuOpen}
        onClose={closeContextMenu}
        position={contextMenuPosition}
        menuItems={menuItems}
      />
      
      <AddClientModal isOpen={isClientModalOpen} setIsOpen={setIsClientModalOpen} />
      {/* AQUI A MUDANÇA: Passamos a data pré-selecionada como prop */}
      <AddAppointmentModal isOpen={isAppointmentModalOpen} setIsOpen={setIsAppointmentModalOpen} preselectedDate={selectedDate} />
      <DayAppointmentsModal />
      <AppointmentDetailsModal />
      <ServiceManagementModal isOpen={isServiceModalOpen} setIsOpen={setIsServiceModalOpen} />
    </div>
  );
}