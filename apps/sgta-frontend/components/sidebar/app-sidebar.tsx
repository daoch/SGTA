"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getNavigationGroups } from "./navigation-groups";
import { NavUser } from "./nav-user";

const user = {
  name: 'Diego Ochoa',
  email: 'daochoa@pucp.edu.pe',
  avatar: 'https://github.com/daoch.png',
  roles: ['alumno','jurado'],
};

export function AppSidebar() {
  const pathname = usePathname();
  const groups = getNavigationGroups(user.roles);

  return (
      <Sidebar 
        className="bg-white border-r" 
        collapsible="icon"
      >
        <SidebarHeader className="p-4 flex items-center justify-between">
          <NavUser user={user} />
        </SidebarHeader>

        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>
                {group.label}
              </SidebarGroupLabel>

              <SidebarMenu className="gap-2">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href || item.children?.some(c => c.href === pathname)}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.children && (
                      <SidebarMenuSub className="pl-4">
                        {item.children.map((child) => (
                          <SidebarMenuSubButton
                            asChild
                            key={child.href}
                            isActive={pathname === child.href}
                          >
                            <Link href={child.href}>
                              <child.icon className="h-3.5 w-3.5" />
                              <span>{child.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>



        <SidebarFooter className="p-4 flex justify-center">
          <SidebarTrigger />
        </SidebarFooter>

      </Sidebar>
  );
}
