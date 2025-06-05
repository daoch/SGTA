"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { getUnreadNotifications, markAsRead } from "@/features/notifications/services/notifications";
import { Bell, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Notificacion } from "../types/Notification.type";

export function NotificationsDropdown() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const marcarComoLeida = async (notificacionId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const element = document.getElementById(`notificacion-${notificacionId}`);
    if (element) {
      element.style.height = `${element.offsetHeight}px`;
      element.classList.add('notification-exit');
      // Esperar a que termine la animación antes de remover
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    try {
      await markAsRead(notificacionId);
      setNotificaciones(prev => 
        prev ? prev.filter(n => n.notificacionId !== notificacionId) : []
      );
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  const renderNotificacionesContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (notificaciones?.length === 0) {
      return <DropdownMenuItem disabled>No tienes notificaciones nuevas</DropdownMenuItem>;
    }

    return notificaciones?.map((notificacion) => (
      <div
        id={`notificacion-${notificacion.notificacionId}`}
        key={notificacion.notificacionId}
        className="notification-item overflow-hidden"
      >
        <DropdownMenuItem
          className="flex flex-col items-start gap-1 py-2 group relative pr-8"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm font-medium flex-grow">{notificacion.mensaje}</span>
            <button
              onClick={(e) => marcarComoLeida(notificacion.notificacionId, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted p-1 rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {new Date(notificacion.fechaCreacion).toLocaleString("es-PE")}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{notificacion.modulo}</span>
          </div>
        </DropdownMenuItem>
      </div>
    ));
  };

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        setLoading(true);
        const data = await getUnreadNotifications();
        if (notificaciones){
          const notificacionesNuevas = data.filter(nueva => !notificaciones.some(existente => existente.notificacionId === nueva.notificacionId));
          notificacionesNuevas.forEach(nueva => {
            toast({
              title: "Notificación nueva",
              description: nueva.mensaje,
              variant: "default",
              duration: 6000,
            });
          });
        }
        setNotificaciones(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las notificaciones",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarNotificaciones();
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        .notification-item {
          transition: all 0.2s ease-out;
        }
        .notification-exit {
          opacity: 0;
          height: 0 !important;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificaciones && notificaciones.length > 0 && (
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {renderNotificacionesContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 