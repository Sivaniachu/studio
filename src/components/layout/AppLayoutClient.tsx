
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React from 'react';
// Removed sidebar-specific imports:
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarTrigger as ShadSidebarTrigger,
//   SidebarContent as ShadSidebarContent,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarHeader,
//   useSidebar,
// } from '@/components/ui/sidebar';
// import { Home, Brain, FileText, Settings as SettingsIcon, PanelRightOpen, PanelRightClose } from 'lucide-react';
import type { ActiveTab } from '@/app/page';
// import { cn } from '@/lib/utils'; // cn might still be needed if other classes are conditional
import BottomTabBar from './BottomTabBar';

interface AppLayoutClientProps {
  children: ReactNode;
  activeTab: ActiveTab;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
}

// Removed sidebarTabs as it's no longer used here. BottomTabBar has its own.
// const sidebarTabs: { name: ActiveTab; label: string; icon: React.ElementType }[] = [
//   { name: 'home', label: 'Home', icon: Home },
//   { name: 'ai', label: 'AI', icon: Brain },
//   { name: 'note', label: 'Notes', icon: FileText },
//   { name: 'settings', label: 'Settings', icon: SettingsIcon },
// ];

// Removed CustomSidebarTriggerIcon as the trigger is removed.
// const CustomSidebarTriggerIcon = () => {
//   const { open, isMobile, openMobile } = useSidebar();
//   const currentOpenState = isMobile ? openMobile : open;
//   return currentOpenState ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />;
// };

export default function AppLayoutClient({ children, activeTab, setActiveTab }: AppLayoutClientProps) {
  
  // Removed handleTabChange as it was for sidebar items.
  // const handleTabChange = (tabName: ActiveTab) => {
  //   setActiveTab(tabName);
  // };

  return (
    // Removed SidebarProvider
    <div className="flex flex-col min-h-screen w-full bg-background">
      {/* Removed Sidebar component */}
      {/* Removed SidebarInset, header is now a direct child */}
      <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:h-16 sm:px-6">
        {/* Removed ShadSidebarTrigger and CustomSidebarTriggerIcon */}
        <h1 className="text-lg font-semibold text-foreground">CmdWeb</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
