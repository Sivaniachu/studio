"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useState, useContext } from 'react';

interface SettingsContextType {
  promptName: string;
  setPromptName: Dispatch<SetStateAction<string>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [promptName, setPromptName] = useState<string>("CmdWeb");

  return (
    <SettingsContext.Provider value={{ promptName, setPromptName }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
