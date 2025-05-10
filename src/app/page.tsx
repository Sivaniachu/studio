
"use client";

import React from 'react';
import TerminalView from '@/components/cmd-web/TerminalView';
import AppLayoutClient from '@/components/layout/AppLayoutClient';

// Sections like AISection, NoteSection, SettingsSection are no longer rendered here
// as all navigation has been removed. If they need to be accessible,
// they would require a different routing or UI mechanism.

export default function CmdWebPage() {
  // All navigation state and handlers have been removed.
  // The page will now always render the TerminalView.

  const renderContent = () => {
    return <TerminalView />;
  };

  return (
    <AppLayoutClient>
      <div className="p-2 h-full">
        {renderContent()}
      </div>
    </AppLayoutClient>
  );
}
