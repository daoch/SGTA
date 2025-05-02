"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth";
import { usePathname } from "next/navigation";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { getNavigationGroups } from "./navigation-groups";

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
