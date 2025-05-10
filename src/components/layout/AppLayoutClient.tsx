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
import { Home, Brain, FileText, Settings as SettingsIcon, PanelRightOpen, PanelRightClose } from 'lucide-react';
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
  const { open, isMobile, openMobile } = useSidebar();
  // For offcanvas, 'open' (desktop) or 'openMobile' (mobile Sheet) determines visibility.
  const currentOpenState = isMobile ? openMobile : open;
  return currentOpenState ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />;
};

export default function AppLayoutClient({ children, activeTab, setActiveTab }: AppLayoutClientProps) {
  
  const handleTabChange = (tabName: ActiveTab) => {
    setActiveTab(tabName);
    // Potentially close sidebar on navigation, if desired.
    // const { setOpen, setOpenMobile, isMobile } = useSidebar(); // Needs to be called within component using context
    // if (isMobile) setOpenMobile(false); else setOpen(false);
  };

  return (
    // defaultOpen for SidebarProvider controls initial desktop state for collapsible="icon" or "none".
    // For "offcanvas", it's typically false unless programmatically opened.
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar 
          side="right" 
          collapsible="offcanvas" // Changed from "icon" to "offcanvas"
          variant="sidebar" 
          className="border-l bg-sidebar text-sidebar-foreground"
        >
          <SidebarHeader className="p-2 flex justify-start items-center h-14 sm:h-16">
            {/* Simplified header for offcanvas mode, as there's no "icon" state for the sidebar itself */}
            <h2 className="text-lg font-semibold text-sidebar-foreground ml-2"> 
              Menu
            </h2>
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
                      activeTab === tab.name && "bg-sidebar-accent" 
                    )}
                    tooltip={{ // Tooltips are mainly for icon-only state, less relevant for offcanvas full items
                      children: tab.label,
                      side: "left",
                      // className: "group-data-[collapsible=icon]:block hidden" - this class is for icon mode
                    }}
                  >
                    <tab.icon className={cn(
                        "h-5 w-5 shrink-0",
                        activeTab === tab.name ? "text-gradient-active" : "text-sidebar-foreground group-hover:text-gradient-active"
                    )} />
                    <span className={cn(
                        // "group-data-[collapsible=icon]:hidden ml-2", - icon mode class removed
                        "ml-2", // Always show text in offcanvas mode
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
            {/* This trigger now controls the offcanvas sidebar */}
            <ShadSidebarTrigger className="ml-auto" aria-label="Toggle sidebar"> {/* Positioned to the right using ml-auto */}
              <CustomSidebarTriggerIcon />
            </ShadSidebarTrigger>
            {/* Removed the old mobile/desktop split for trigger as CustomSidebarTriggerIcon handles it well.
                The single trigger will show/hide based on screen size due to ShadSidebarTrigger's own responsiveness
                if not explicitly controlled by sm:hidden etc.
                However, for a consistent right-aligned toggle, we'll use one.
            */}
            <h1 className="text-lg font-semibold text-foreground flex-1 text-center sm:text-left absolute left-4 sm:static sm:left-auto">CmdWeb</h1> {/* Ensure title doesn't overlap with right-aligned trigger */}

          </header>

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
