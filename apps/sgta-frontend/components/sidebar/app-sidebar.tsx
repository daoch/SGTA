"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getNavigationGroups } from "./navigation-groups";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { useAuth } from "@/features/auth";

export function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const groups = getNavigationGroups(user?.roles || []);

  if (!user) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain groups={groups} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
