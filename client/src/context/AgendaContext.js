import React, { createContext, useState, useContext } from 'react';

const AgendaContext = createContext();

export const AgendaProvider = ({ children }) => {
  // Usamos um número que muda para forçar a atualização
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <AgendaContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </AgendaContext.Provider>
  );
};

export const useAgenda = () => {
  return useContext(AgendaContext);
};