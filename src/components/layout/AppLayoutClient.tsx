
"use client";

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import BottomNavbar, { type ActiveTab } from './BottomNavbar';
import TerminalView from '@/components/cmd-web/TerminalView';
import AISection from '@/components/sections/AISection';
import NoteSection from '@/components/sections/NoteSection';
import SettingsSection from '@/components/sections/SettingsSection';


interface AppLayoutClientProps {
  children: ReactNode; // children prop is kept for flexibility, though currently unused directly for main content switching
}

export default function AppLayoutClient({ children }: AppLayoutClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cmd');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        // For 'home', we can render the children passed to AppLayoutClient,
        // or a specific home component. Currently, page.tsx renders TerminalView.
        // If 'home' icon is meant to be the CMD/Terminal, we use 'cmd'.
        // Let's assume 'home' is different for now, or can be an alias for 'cmd'.
        // For simplicity, let's make 'home' show the CMD view as well.
        return <TerminalView />;
      case 'cmd':
        return <TerminalView />;
      case 'ai':
        return <AISection />;
      case 'notes':
        return <NoteSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <TerminalView />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:h-16 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground">CmdWeb</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-20"> {/* Added pb-20 to avoid overlap with bottom navbar */}
        <div className="p-2 h-full">
          {renderContent()}
        </div>
      </main>
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

