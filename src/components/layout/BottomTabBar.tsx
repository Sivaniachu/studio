
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { useState, useEffect } from 'react';
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

// The interactive part of the bar (inner div with rounded-xl, p-2) has a height of 5rem.
// The outer div has mb-2 (0.5rem margin).
// When not translated, the top of the outer div's border-box is 5.5rem from the viewport bottom.
// To leave only a very small part (e.g., 0.1rem) visible when collapsed:
// New top position = 0.1rem from viewport bottom.
// Translation amount = Initial top - New top = 5.5rem - 0.1rem = 5.4rem.
const TRANSLATE_Y_COLLAPSED = '5.4rem';


export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent applying transform on initial server render to avoid potential mismatch,
  // apply it only on the client side after mount.
  const transformClass = isClient 
    ? (isHovered ? "translate-y-0" : `translate-y-[${TRANSLATE_Y_COLLAPSED}]`)
    : "translate-y-0"; // Or some initial safe state like fully visible or fully hidden based on preference

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-2 px-2 z-20",
        "transition-transform duration-300 ease-in-out",
        isClient ? (isHovered ? "translate-y-0" : `translate-y-[${TRANSLATE_Y_COLLAPSED}]`) : `translate-y-[${TRANSLATE_Y_COLLAPSED}]` // Start hidden on client
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
              "hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" // Removed hover background
            )}
            onClick={() => onTabChange(tab.name)}
            aria-pressed={activeTab === tab.name}
            aria-label={tab.label}
          >
            <tab.icon className={cn(
                "h-6 w-6 mb-1 transition-colors",
                activeTab === tab.name
                  ? "text-gradient-active" // Active icon uses gradient
                  : "text-muted-foreground group-hover:text-gradient-active" // Hover icon uses gradient
              )}
            />
            <span className={cn(
                "text-xs transition-colors font-medium", 
                activeTab === tab.name
                  ? "text-gradient-active font-semibold" // Active text uses gradient
                  : "text-muted-foreground group-hover:text-gradient-active" // Hover text uses gradient
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
