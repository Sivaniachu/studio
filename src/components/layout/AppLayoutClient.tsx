"use client";

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import BottomNavbar, { type ActiveTab } from './BottomNavbar';
import TerminalView from '@/components/cmd-web/TerminalView';
import AISection from '@/components/sections/AISection';
import NoteSection from '@/components/sections/NoteSection';
import SettingsSection from '@/components/sections/SettingsSection';
import HomeSection from '@/components/sections/HomeSection'; // Import HomeSection


interface AppLayoutClientProps {
  children: ReactNode; 
}

export default function AppLayoutClient({ children }: AppLayoutClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home'); // Default to home

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection />; // Render HomeSection for 'home' tab
      case 'ai':
        return <TerminalView />; 
      case 'notes':
        return <NoteSection />;
      case 'settings':
        return <SettingsSection />;

    }
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:h-16 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground">CmdWeb</h1>
      </header>

      {/* Adjusted pb-16 to ensure content doesn't overlap with fully visible navbar */}
      <main className="flex-1 overflow-y-auto pb-16"> 
        <div className="p-4 md:p-6 lg:p-8 h-full"> {/* Use consistent padding */}
          {renderContent()}
        </div>
      </main>
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
