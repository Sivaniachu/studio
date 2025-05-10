"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import TerminalView from '@/components/cmd-web/TerminalView';
import AISection from '@/components/sections/AISection';
import NoteSection from '@/components/sections/NoteSection';
import SettingsSection from '@/components/sections/SettingsSection';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

export type ActiveTab = "home" | "ai" | "note" | "settings";

export default function CmdWebPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <TerminalView />;
      case "ai": return <AISection />;
      case "note": return <NoteSection />;
      case "settings": return <SettingsSection />;
      default: return <TerminalView />;
    }
  };

  return (
    <AppLayoutClient
      activeTab={activeTab}
      setActiveTab={setActiveTab as Dispatch<SetStateAction<ActiveTab>>}
    >
      {/* This div provides padding for the content area.
          pb-24 ensures content doesn't hide behind the BottomTabBar. */}
      <div className="p-2 pb-24 h-full">
        {renderContent()}
      </div>
    </AppLayoutClient>
  );
}
