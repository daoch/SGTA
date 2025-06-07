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
import { Notificacion, NotificacionesService } from "@/services/notifications";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationsDropdown() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await NotificacionesService.getUnreadNotifications();
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

  const marcarComoLeida = async (notificacionId: number) => {
    try {
      await NotificacionesService.markAsRead(notificacionId);
      setNotificaciones(notificaciones.filter(n => n.notificacionId !== notificacionId));
      toast({
        title: "Éxito",
        description: "Notificación marcada como leída",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    cargarNotificaciones();
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificaciones.length > 0 && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>Cargando notificaciones...</DropdownMenuItem>
        ) : notificaciones.length === 0 ? (
          <DropdownMenuItem disabled>No tienes notificaciones nuevas</DropdownMenuItem>
        ) : (
          notificaciones.map((notificacion) => (
            <DropdownMenuItem
              key={notificacion.notificacionId}
              className="flex flex-col items-start gap-1 py-2"
              onClick={() => marcarComoLeida(notificacion.notificacionId)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{notificacion.mensaje}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(notificacion.fechaCreacion).toLocaleString("es-PE")}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{notificacion.modulo}</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 