
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

// Height of the inner content:
// Buttons are h-16 = 4rem
// Div padding p-2 = 0.5rem top + 0.5rem bottom = 1rem
// Total inner content height = 4rem (button)
// The container itself has p-2, so its total height is roughly button height (4rem) + container padding (1rem) = 5rem.
// Let's assume the desired visible part when collapsed is 1.5rem from the top of the bar.
// Translate amount = Total Height - Visible Part.
// If total height of the interactive area (div with bg) is approx 4rem (button) + 1rem (padding) = 5rem.
// To reveal 1.5rem, we need to hide 5rem - 1.5rem = 3.5rem.
const TRANSLATE_Y_COLLAPSED = '3.5rem'; // This will be `translate-y-[3.5rem]`

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-2 px-2", // Horizontal centering and max width
        "transition-transform duration-300 ease-in-out", // Animation properties
        isHovered ? "translate-y-0" : `translate-y-[${TRANSLATE_Y_COLLAPSED}]` // Dynamic translate based on hover
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Bottom navigation bar"
    >
      <div className="flex justify-around items-center bg-background border border-border shadow-lg rounded-xl p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant="ghost" // Ghost variant has no default background
            size="lg" // Ensure buttons are large enough for touch
            className={cn(
              "flex flex-col items-center justify-center h-16 w-1/4 rounded-lg group", // Added group for hover effect on children
              "hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0", // Ensure no bg on hover/focus, remove ring for cleaner look
              activeTab === tab.name ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => onTabChange(tab.name)}
            aria-pressed={activeTab === tab.name}
            aria-label={tab.label}
          >
            <tab.icon className={cn(
                "h-6 w-6 mb-1 transition-colors",
                // If active, use primary color. Else, use muted, but on group hover, use gradient.
                activeTab === tab.name 
                  ? "text-primary" 
                  : "text-muted-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 group-hover:bg-clip-text"
              )}
            />
            <span className={cn(
                "text-xs transition-colors",
                // If active, use primary color. Else, use muted, but on group hover, use gradient.
                activeTab === tab.name 
                  ? "text-primary" 
                  : "text-muted-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 group-hover:bg-clip-text"
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
