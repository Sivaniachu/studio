"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import TerminalView from '@/components/cmd-web/TerminalView';
import AISection from '@/components/sections/AISection';
import NoteSection from '@/components/sections/NoteSection';
import SettingsSection from '@/components/sections/SettingsSection';
import AppLayoutClient from '@/components/layout/AppLayoutClient';
import { Button } from '@/components/ui/button';
import { Home, Brain, FileText, Settings as SettingsIcon, PanelLeft, PanelRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export type ActiveTab = "home" | "ai" | "note" | "settings";

const mainTabs: { name: ActiveTab; label: string; icon: React.ElementType }[] = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'ai', label: 'AI', icon: Brain },
  { name: 'note', label: 'Notes', icon: FileText },
  { name: 'settings', label: 'Settings', icon: SettingsIcon },
];


export default function CmdWebPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <TerminalView />;
      case "ai": return <AISection />;
      case "note": return <NoteSection />;
      case "settings": return <SettingsSection />;
      default: return <TerminalView />;
    }
  };

  const handleTabChange = (tabName: ActiveTab) => {
    setActiveTab(tabName);
    setIsSheetOpen(false); // Close sheet on tab selection
  };

  return (
    <AppLayoutClient
      activeTab={activeTab}
      setActiveTab={setActiveTab as Dispatch<SetStateAction<ActiveTab>>}
    >
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
            {isSheetOpen ? <PanelRight className="h-6 w-6" /> : <PanelLeft className="h-6 w-6" />}
            <span className="sr-only">Toggle Navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-sidebar text-sidebar-foreground p-4">
          <div className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold text-sidebar-primary mb-4">Navigation</h2>
            {mainTabs.map((tab) => (
              <Button
                key={tab.name}
                variant="ghost"
                onClick={() => handleTabChange(tab.name)}
                className={cn(
                  "w-full justify-start text-base py-3 px-4 rounded-md",
                  activeTab === tab.name
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-primary hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
                )}
              >
                <tab.icon className={cn("mr-3 h-5 w-5", activeTab === tab.name ? "text-gradient-active" : "")} />
                <span className={cn(activeTab === tab.name ? "text-gradient-active" : "")}>{tab.label}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Removed pb-24 from this div */}
      <div className="p-2 h-full">
        {renderContent()}
      </div>
    </AppLayoutClient>
  );
}

