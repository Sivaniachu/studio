
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { Home, BrainCircuit, NotebookText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ActiveTab = 'home' | 'ai' | 'notes' | 'settings' | 'cmd';

interface BottomNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, targetTab: 'cmd' as ActiveTab }, // Home redirects to CMD for now
  { id: 'ai', label: 'AI', icon: BrainCircuit, targetTab: 'ai' as ActiveTab },
  { id: 'notes', label: 'Notes', icon: NotebookText, targetTab: 'notes' as ActiveTab },
  { id: 'settings', label: 'Settings', icon: Settings, targetTab: 'settings' as ActiveTab },
];

export default function BottomNavbar({ activeTab, setActiveTab }: BottomNavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center h-16 bg-background/80 backdrop-blur-md border-t border-border">
      <div className="flex space-x-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.targetTab;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.targetTab)}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors group",
                "hover:bg-accent/50", // Subtle hover background
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-transform group-hover:scale-110",
                  isActive && "text-gradient-active" // Apply gradient if active
                )} 
              />
              <span 
                className={cn(
                  "text-xs",
                   isActive && "text-gradient-active font-semibold" // Apply gradient if active
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
