
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

// Height of the inner content (buttons are h-16 = 4rem, div padding p-2 = 0.5rem top/bottom, total approx 5rem)
// Reveal 1.5rem from the top when not hovered.
// So, translate by 5rem - 1.5rem = 3.5rem
const TRANSLATE_Y_COLLAPSED = '3.5rem'; // translate-y-[3.5rem]

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-2 px-2",
        "transition-transform duration-300 ease-in-out",
        isHovered ? "translate-y-0" : `translate-y-[${TRANSLATE_Y_COLLAPSED}]`
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-around items-center bg-background border border-border shadow-lg rounded-xl p-2">
        {tabs.map((tab) => (
          <Button
            key={tab.name}
            variant="ghost"
            size="lg" // Ensure buttons are large enough for touch
            className={cn(
              "flex flex-col items-center justify-center h-16 w-1/4 rounded-lg group", // Added group for hover effect on children
              "hover:bg-transparent focus-visible:bg-transparent", // Override ghost hover/focus background
              activeTab === tab.name ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => onTabChange(tab.name)}
            aria-label={tab.label}
          >
            <tab.icon className={cn(
                "h-6 w-6 mb-1 transition-colors",
                activeTab === tab.name ? "text-primary" : "text-muted-foreground group-hover:text-prompt-gradient"
              )}
            />
            <span className={cn(
                "text-xs transition-colors",
                activeTab === tab.name ? "text-primary" : "text-muted-foreground group-hover:text-prompt-gradient"
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

