
"use client";

import type { ReactNode } from 'react';
import React from 'react';

// ActiveTab and related props removed as navigation is no longer handled here.

interface AppLayoutClientProps {
  children: ReactNode;
}

export default function AppLayoutClient({ children }: AppLayoutClientProps) {
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:h-16 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground">CmdWeb</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
