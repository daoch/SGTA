"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/features/temas/components/header/app-header";
import AppMain from "@/features/temas/components/main/app-main";
import { AppSidebar } from "@/features/temas/components/sidebar/app-sidebar";

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
