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

const user = {
  name: "Diego Ochoa",
  email: "daochoa@pucp.edu.pe",
  avatar: "https://github.com/daoch.png",
  roles: ["alumno", "jurado", "asesor", "revisor", "coordinador"],
};

export function AppSidebar() {
  const pathname = usePathname();
  const groups = getNavigationGroups(user.roles);

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
