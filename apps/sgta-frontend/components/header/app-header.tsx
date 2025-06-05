// src/components/header/AppHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell, MailCheck, Loader2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import NotificationItem from "@/features/usuario/components/NotificationItem";
import {
  useGetCountMisNotificacionesNoLeidas,
  useGetMisNotificaciones,
  useMarcarNotificacionLeida,
  useMarcarTodasLeidas,
} from "@/features/usuario/queries/notificacion.queries";
import { INotificacionTransformed } from "@/features/usuario/types/notificacion.types";
import { useAuthStore } from "@/features/auth";

const MAX_NOTIFICATIONS_IN_DROPDOWN = 7;

const AppHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isSessionReady } = useAuthStore();
  
  /* ────────── hooks para datos ────────── */
  const {
    data: countData,
  } = useGetCountMisNotificacionesNoLeidas({
    enabled: isSessionReady,          
    refetchInterval: isSessionReady ? 60_000 : false,
  });
  const unreadCount = countData?.count || 0;

  const {
    data: notificacionesData,
    isLoading: isLoadingNotificaciones,
    refetch: refetchNotificacionesDropdown,
  } = useGetMisNotificaciones(0, MAX_NOTIFICATIONS_IN_DROPDOWN, false, {
    enabled: isSessionReady,         
  });

  const markAsReadMutation = useMarcarNotificacionLeida();
  const markAllAsReadMutation = useMarcarTodasLeidas();

  /* ────────── efectos ────────── */
  useEffect(() => {
    if (isDropdownOpen && !isLoadingNotificaciones) {
      refetchNotificacionesDropdown();
    }
  }, [isDropdownOpen, isLoadingNotificaciones, refetchNotificacionesDropdown]);

  /* ────────── handlers ────────── */
  const markOneAsReadAndClose = (n: INotificacionTransformed) => {
    if (!n.fechaLectura) {
      markAsReadMutation.mutate(n.id);
    }
    setIsDropdownOpen(false); // por si Radix no lo cerrase aún
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadCount === 0) return;
    markAllAsReadMutation.mutate();
  };

  /* ────────── render ────────── */
  return (
    <header className="flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 px-4">
      {/* logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <Image src="/logo.png" alt="SGTA Logo" width={38} height={38} className="h-8 w-auto sm:h-9" priority />
        <span className="font-semibold text-lg hidden sm:inline">SGTA</span>
      </Link>

      {/* campana */}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-80 sm:w-96 rounded-lg shadow-xl bg-background">
            {/* encabezado */}
            <DropdownMenuLabel className="flex justify-between items-center px-3 py-2 text-sm font-medium">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto py-1 px-2 text-primary hover:bg-primary/10"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  {markAllAsReadMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <MailCheck className="h-3.5 w-3.5 mr-1" />}
                  Marcar todas leídas
                </Button>
              )}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* lista */}
            <ScrollArea className="max-h-[calc(100vh-12rem)]">
              {isLoadingNotificaciones && isDropdownOpen && (
                <div className="p-4 flex justify-center text-sm text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Cargando...
                </div>
              )}

              {Array.isArray(notificacionesData?.notificaciones) &&
                notificacionesData.notificaciones.length > 0 &&
                notificacionesData.notificaciones
                  .slice(0, MAX_NOTIFICATIONS_IN_DROPDOWN)
                  .map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      asChild
                      onSelect={() => markOneAsReadAndClose(n)}
                      className="p-0" // dejamos el padding al hijo
                    >
                      {n.enlaceRedireccion ? (
                        <Link href={n.enlaceRedireccion} className="w-full no-underline">
                          <NotificationItem notificacion={n} onMarkAsRead={() => markOneAsReadAndClose(n)} />
                        </Link>
                      ) : (
                        <div className="w-full">
                          <NotificationItem notificacion={n} onMarkAsRead={() => markOneAsReadAndClose(n)} />
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))}
            </ScrollArea>

            {/* footer */}
            {(notificacionesData?.totalElements ?? 0) > MAX_NOTIFICATIONS_IN_DROPDOWN && (
              <div className="sticky bottom-0 bg-background pt-2">
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="justify-center p-0">
                  <Link
                    href="/notificaciones"
                    className="w-full text-center text-sm text-primary hover:underline py-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Ver todas las notificaciones ({notificacionesData?.totalElements ?? 0})
                  </Link>
                </DropdownMenuItem>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
