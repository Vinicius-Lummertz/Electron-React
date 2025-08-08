import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Menu, Transition } from '@headlessui/react';

export default function ContextMenu({ isOpen, onClose, position, menuItems }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay invisível para fechar o menu ao clicar fora */}
      <div className="fixed inset-0 z-50" onClick={onClose} />
      
      <div style={{ top: position.top, left: position.left }} className="fixed z-50">
        <Menu as="div" className="relative inline-block text-left">
          <Transition
            as={Fragment}
            show={isOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items static className="w-56 mt-2 origin-top-left rounded-md shadow-lg bg-surface ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {menuItems.map((item) => (
                  <Menu.Item key={item.label}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          item.onClick();
                          onClose();
                        }}
                        className={`${
                          active ? 'bg-primary text-white' : 'text-text-primary'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {item.icon && <item.icon className="w-5 h-5 mr-2" aria-hidden="true" />}
                        {item.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>,
    document.getElementById('modal-root') // Usamos o mesmo portal dos modais
  );
}