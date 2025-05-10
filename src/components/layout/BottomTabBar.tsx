
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import { Home, Brain, FileText, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ActiveTab } from '@/app/page';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: Dispatch<SetStateAction<ActiveTab>>;
}

const tabs: { name: ActiveTab; label: string; icon: React.ElementType }[] = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'ai', label: 'AI', icon: Brain },
  { name: 'note', label: 'Notes', icon: FileText },
  { name: 'settings', label: 'Settings', icon: SettingsIcon },
];

// Current bar height is approx 5rem.
// To hide icons (which are part of the 4rem button height), translate by more.
// Let's make it 4.8rem to leave a 0.2rem sliver.
const TRANSLATE_Y_COLLAPSED = '4.8rem';

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-2 px-2 z-20", // Ensure z-index
        "transition-transform duration-300 ease-in-out",
        isHovered ? "translate-y-0" : `translate-y-[${TRANSLATE_Y_COLLAPSED}]`
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Bottom navigation bar"
    >
      <div className="flex justify-around items-center bg-background border border-border shadow-lg rounded-xl p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col items-center justify-center h-16 w-1/4 rounded-lg group",
              "hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
              // Active tab styling is handled by text and icon classes directly for gradient
               activeTab === tab.name ? "" : "text-muted-foreground" 
            )}
            onClick={() => onTabChange(tab.name)}
            aria-pressed={activeTab === tab.name}
            aria-label={tab.label}
          >
            <tab.icon className={cn(
                "h-6 w-6 mb-1 transition-colors",
                activeTab === tab.name 
                  ? "text-gradient-active" 
                  : "text-muted-foreground group-hover:text-gradient-active"
              )}
            />
            <span className={cn(
                "text-xs transition-colors",
                activeTab === tab.name 
                  ? "text-gradient-active" 
                  : "text-muted-foreground group-hover:text-gradient-active"
              )}
            >
              {tab.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
