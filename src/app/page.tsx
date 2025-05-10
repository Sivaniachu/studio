
"use client";

import React from 'react';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

export default function CmdWebPage() {
  // Content rendering is now handled by AppLayoutClient based on BottomNavbar's activeTab state
  return (
    <AppLayoutClient>
      {/* Children of AppLayoutClient can be used for other purposes if needed,
          but for now, the main content (TerminalView, AISection, etc.) 
          is managed within AppLayoutClient itself. */}
    </AppLayoutClient>
  );
}

