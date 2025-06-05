"use client";

import React from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  ExternalLink,
  MessageSquareText,
  UserMinus,
  XCircle,
  UserX,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

import { INotificacionTransformed } from "@/features/usuario/types/notificacion.types";

interface NotificationItemProps {
  notificacion: INotificacionTransformed;
  onMarkAsRead: (notificacionId: number) => void;
  onDismiss?: (notificacionId: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notificacion,
  onMarkAsRead,
  onDismiss,
}) => {
  // Elegir icono según el tipo de notificación
  const getIcon = () => {
    switch (notificacion.tipoNotificacion.nombre.toLowerCase()) {
      case "informativa":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "advertencia":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "rechazado":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "aprobada":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cese_asesor_solicitado":
        return <UserMinus className="h-4 w-4 text-primary" />;
      default:
        return <MessageSquareText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleMarkAsReadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead(notificacion.id);
  };

  const handleDismissClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDismiss) onDismiss(notificacion.id);
  };

  const isRead = Boolean(notificacion.fechaLectura);
  const isLink = Boolean(notificacion.enlaceRedireccion);

  return (
    <div
      className={`flex items-start gap-3 py-2 px-3 rounded-md hover:bg-muted/50 transition duration-150 ${
        isRead ? "opacity-60" : ""
      } cursor-pointer`}
    >
      {/* Icono principal */}
      <div className="flex-shrink-0">{getIcon()}</div>

      {/* Texto y detalles */}
      <div className="flex-1">
        <div className="flex justify-between items-start gap-1">
          <p className="text-sm font-medium">
            {notificacion.tipoNotificacion.nombre.toUpperCase()} -{" "}
            {notificacion.modulo.nombre}
          </p>

          {/* Icono “marcar como leída” */}
          {!isRead && (
            <span
              title="Marcar como leída"
              className="mark-as-read-icon cursor-pointer"
              onClick={handleMarkAsReadClick}
            >
              <CheckCircle className="h-3 w-3 text-blue-500 hover:text-blue-700" />
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {notificacion.mensaje}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNowStrict(notificacion.fechaCreacion, {
            addSuffix: true,
            locale: es,
          })}
        </p>
      </div>

      {/* Si existe enlaceRedireccion, mostramos un icono que abra en nueva pestaña */}
      {isLink && (
        <Link
          href={notificacion.enlaceRedireccion || "#"}
          target="_blank"
          className="flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground/70" />
        </Link>
      )}

      {/* Si implementas “descartar” */}
      {onDismiss && (
        <button
          className="ml-2"
          title="Descartar notificación"
          onClick={handleDismissClick}
        >
          <UserX className="h-4 w-4 text-muted-foreground hover:text-red-500" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
