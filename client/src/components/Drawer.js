import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDaysIcon,
  UsersIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  PlusCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Agenda', href: '/', icon: CalendarDaysIcon },
  { name: 'Clientes', href: '/clientes', icon: UsersIcon },
];

export default function Drawer({ openClientModal, openAppointmentModal }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col flex-shrink-0 w-72 h-screen px-4 py-8 overflow-y-auto bg-surface border-r border-gray-700">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-white mb-2">S</div>
        <h2 className="text-xl font-semibold text-text-primary">{user?.nome || 'Usuário'}</h2>
        <p className="text-sm text-text-secondary">{user?.cargo || 'Cargo'}</p>
      </div>
      
      <div className="flex flex-col justify-between flex-grow mt-10">
        <nav className="flex-1 space-y-2">
          <button onClick={openAppointmentModal} className="flex items-center w-full px-4 py-2 text-lg font-medium text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary/90">
            <PlusCircleIcon className="w-6 h-6 mr-3" />
            Adicionar Atendimento
          </button>
          
          <button onClick={openClientModal} className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-text-secondary transition-colors duration-200 rounded-md hover:bg-gray-700 hover:text-white">
            <UserPlusIcon className="w-6 h-6 mr-3" />
            Adicionar Cliente
          </button>
          
          <div className="pt-4 mt-4 border-t border-gray-700">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href} className={({ isActive }) => `flex items-center px-4 py-2 mt-2 text-text-secondary transition-colors duration-200 transform rounded-md hover:bg-gray-700 hover:text-white ${isActive ? 'bg-gray-700 text-white' : ''}`}>
                <item.icon className="w-5 h-5" />
                <span className="mx-4 font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
        
        <button onClick={logout} className="flex items-center px-4 py-2 mt-5 text-text-secondary transition-colors duration-200 transform rounded-md hover:bg-gray-700 hover:text-white">
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
          <span className="mx-4 font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}