'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WhiteboardContextProps {
  isOpen: boolean;
  openWhiteboard: () => void;
  closeWhiteboard: () => void;
}

const WhiteboardContext = createContext<WhiteboardContextProps | undefined>(undefined);

export const WhiteboardProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openWhiteboard = () => setIsOpen(true);
  const closeWhiteboard = () => setIsOpen(false);

  return (
    <WhiteboardContext.Provider value={{ isOpen, openWhiteboard, closeWhiteboard }}>
      {children}
    </WhiteboardContext.Provider>
  );
};

export const useWhiteboard = (): WhiteboardContextProps => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider');
  }
  return context;
};
