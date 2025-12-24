import React, { createContext, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children, activeTab, setActiveTab }) => {
  const navigateTo = (tab) => {
    setActiveTab(tab);
  };

  return (
    <NavigationContext.Provider value={{ activeTab, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};