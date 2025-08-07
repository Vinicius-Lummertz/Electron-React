import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import AddClientModal from './modals/AddClientModal';
import AddAppointmentModal from './modals/AddAppointmentModal';

export default function MainLayout() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Drawer
        openClientModal={() => setIsClientModalOpen(true)}
        openAppointmentModal={() => setIsAppointmentModalOpen(true)}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>

      <AddClientModal isOpen={isClientModalOpen} setIsOpen={setIsClientModalOpen} />
      <AddAppointmentModal isOpen={isAppointmentModalOpen} setIsOpen={setIsAppointmentModalOpen} />
    </div>
  );
}