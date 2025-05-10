"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger as ShadSidebarTrigger,
  SidebarContent as ShadSidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Home, Brain, FileText, Settings as SettingsIcon, PanelRightOpen, PanelRightClose, MenuSquare } from 'lucide-react';
import type { ActiveTab } from '@/app/page';
import { cn } from '@/lib/utils';
import BottomTabBar from './BottomTabBar';

interface AppLayoutClientProps {
  children: ReactNode;
  activeTab: ActiveTab;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
}

const sidebarTabs: { name: ActiveTab; label: string; icon: React.ElementType }[] = [
  { name: 'home', label: 'Home', icon: Home },
  { name: 'ai', label: 'AI', icon: Brain },
  { name: 'note', label: 'Notes', icon: FileText },
  { name: 'settings', label: 'Settings', icon: SettingsIcon },
];

const CustomSidebarTriggerIcon = () => {
  const { open, isMobile } = useSidebar();
  if (isMobile) { // Mobile usually handled by Sheet's own trigger or a global one
    return <PanelRightOpen className="h-5 w-5" />;
  }
  return open ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />;
};

export default function AppLayoutClient({ children, activeTab, setActiveTab }: AppLayoutClientProps) {
  // Access sidebar context for mobile interactions if needed, e.g. closing sheet
  // const sidebar = useSidebar(); // Call useSidebar at the top level of a component using it

  const handleTabChange = (tabName: ActiveTab) => {
    setActiveTab(tabName);
    // Example: Close mobile sidebar sheet on navigation
    // This would require `sidebar` from `useSidebar()` if used here.
    // For now, assume manual closing or handled by user.
  };


  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar side="right" collapsible="icon" variant="sidebar" className="border-l bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-2 flex justify-center items-center h-14 sm:h-16">
            <h2 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Menu
            </h2>
            <MenuSquare className="h-6 w-6 text-sidebar-foreground group-data-[collapsible=icon]:block hidden" />
          </SidebarHeader>
          <ShadSidebarContent className="p-2">
            <SidebarMenu>
              {sidebarTabs.map((tab) => (
                <SidebarMenuItem key={tab.name}>
                  <SidebarMenuButton
                    onClick={() => handleTabChange(tab.name)}
                    isActive={activeTab === tab.name}
                    className={cn(
                      "w-full justify-start text-sm h-10",
                      activeTab === tab.name && "bg-sidebar-accent" // Basic highlight for active
                    )}
                    tooltip={{
                      children: tab.label,
                      side: "left",
                      className: "group-data-[collapsible=icon]:block hidden"
                    }}
                  >
                    <tab.icon className={cn(
                        "h-5 w-5 shrink-0",
                        activeTab === tab.name ? "text-gradient-active" : "text-sidebar-foreground group-hover:text-gradient-active"
                    )} />
                    <span className={cn(
                        "group-data-[collapsible=icon]:hidden ml-2", // Added ml-2 for spacing
                        activeTab === tab.name ? "text-gradient-active font-semibold" : "text-sidebar-foreground group-hover:text-gradient-active"
                    )}>{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ShadSidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
            {/* Mobile trigger: This is what SheetContent in shadcn/ui Sidebar uses for mobile */}
            <ShadSidebarTrigger className="sm:hidden" aria-label="Toggle sidebar">
              <PanelRightOpen className="h-5 w-5" />
            </ShadSidebarTrigger>
            
            {/* Desktop trigger */}
            <div className="hidden sm:block">
              <ShadSidebarTrigger aria-label="Toggle sidebar">
                <CustomSidebarTriggerIcon />
              </ShadSidebarTrigger>
            </div>
            <h1 className="text-lg font-semibold text-foreground flex-1 text-center sm:text-left">CmdWeb</h1>
          </header>

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
