"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/components/header/app-header";
import AppMain from "@/components/main/app-main";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <SidebarProvider>
        <div className="w-fit">
          <AppSidebar />
        </div>
        <div className="flex flex-col w-full h-full overflow-auto">
          <AppHeader />
          <SidebarInset className="flex-1">
            <AppMain>{children}</AppMain>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
