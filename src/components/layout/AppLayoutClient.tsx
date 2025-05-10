
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React from 'react';
import type { ActiveTab } from '@/app/page';
// import { cn } from '@/lib/utils'; // cn might still be needed if other classes are conditional

interface AppLayoutClientProps {
  children: ReactNode;
  activeTab: ActiveTab;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
}

export default function AppLayoutClient({ children, activeTab, setActiveTab }: AppLayoutClientProps) {
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:h-16 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground">CmdWeb</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* BottomTabBar removed */}
    </div>
  );
}

