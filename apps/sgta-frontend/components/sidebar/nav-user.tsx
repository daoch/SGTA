"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/features/auth";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const { logout, redirectToLogin } = useAuth();
  const router = useRouter();

 

  console.log("user", user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-auto min-h-[3rem] items-start py-2"
            >
              <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                <span className="truncate font-semibold">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.email}
                </span>
                <div className="flex flex-wrap gap-1 w-full">
                  {user?.roles?.map((role, index) => (
                    <Badge
                      key={index}
                      variant="default"
                      className="text-xs inline-flex"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4 flex-shrink-0 mt-1" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.email}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/perfil");
                }}
              >
                <UserRound />
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />   
                      
            <DropdownMenuItem
              onClick={() => {
                // First logout to clear all tokens and state
                logout();

                // Then redirect to login page
                setTimeout(() => {
                  // Small timeout to ensure logout completes before redirect
                  redirectToLogin();
                }, 100);
              }}
            >
              <LogOut />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
