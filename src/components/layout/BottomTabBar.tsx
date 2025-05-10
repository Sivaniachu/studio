
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

// The interactive part of the bar (div with rounded-xl, p-2, containing h-16 buttons) 
// has an approximate height of 5rem (0.5rem top padding + 4rem button height + 0.5rem bottom padding).
// The outer div has mb-2 (0.5rem margin), so its border-box starts 0.5rem above viewport bottom.
// To leave 0.5rem (10% of 5rem) visible when collapsed:
// The bar needs to be translated down so its top is 0.5rem above viewport bottom.
// If bar height is 5rem, its bottom will be 4.5rem below viewport bottom.
// Initial position of border-box bottom: 0.5rem from viewport bottom.
// Target position of border-box bottom: -4.5rem from viewport bottom.
// Translation amount = Initial - Target = 0.5rem - (-4.5rem) = 5rem.
const TRANSLATE_Y_COLLAPSED = '5rem';


export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-2 px-2 z-20",
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
              "hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
                "text-xs transition-colors font-medium", 
                activeTab === tab.name
                  ? "text-gradient-active font-semibold" 
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

