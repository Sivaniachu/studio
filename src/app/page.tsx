"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import BottomTabBar from '@/components/layout/BottomTabBar';
import TerminalView from '@/components/cmd-web/TerminalView';
import AISection from '@/components/sections/AISection';
import NoteSection from '@/components/sections/NoteSection';
import SettingsSection from '@/components/sections/SettingsSection';

export type ActiveTab = "home" | "ai" | "note" | "settings";

export default function CmdWebPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Main content area that will change based on the active tab */}
      {/* Added pb-20 to prevent content from being overlapped by fixed tab bar */}
      <main className="flex-grow overflow-y-auto p-2 pb-24"> {/* Increased padding-bottom */}
        {activeTab === "home" && <TerminalView />}
        {activeTab === "ai" && <AISection />}
        {activeTab === "note" && <NoteSection />}
        {activeTab === "settings" && <SettingsSection />}
      </main>
      
      {/* Tab bar fixed at the bottom */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab as Dispatch<SetStateAction<ActiveTab>>} />
    </div>
  );
}
