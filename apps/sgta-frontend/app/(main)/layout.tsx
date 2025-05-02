"use client";

import AppHeader from "@/components/header/app-header";
import AppMain from "@/components/main/app-main";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <AppMain>{children}</AppMain>
      </SidebarInset>
    </SidebarProvider>
  );
}
