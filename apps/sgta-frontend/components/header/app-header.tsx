"use client";

import { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Bell } from "lucide-react";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  (window as any).toast = toast;
}

type TipoEvento = "Entregable" | "Reunión" | "Exposición";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  tipoEvento: TipoEvento;
  allDay?: boolean;
}

const createDate = (
  day: number, 
  month: number, 
  year: number, 
  hours: number = 0, 
  minutes: number = 0
) => {
  return new Date(year, month - 1, day, hours, minutes);
};

const eventosEstaticos: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunión con el asesor 1",
    description: "Primera revision de avances",
    start: createDate(29, 5, 2025, 8, 0),
    end: createDate(29, 5, 2025, 10, 0),
    tipoEvento: "Reunión"
  },
  {
    id: "2",
    title: "Exposición de avances",
    description: "Presentación de resultados parciales",
    start: createDate(30, 5, 2025, 11, 0),
    end: createDate(30, 5, 2025, 12, 0),
    tipoEvento: "Exposición"
  },
  {
    id: "3",
    title: "Entrega de Documentos",
    description: "Fecha límite para entregar los documentos",
    start: createDate(28, 5, 2025, 1, 0),
    end: createDate(28, 5, 2025, 1, 0),
    tipoEvento: "Entregable",
    allDay: true
  },
  {
    id: "4",
    title: "Entrega de Documentos",
    description: "Fecha límite para entregar los documentos",
    start: createDate(27, 5, 2025, 1, 15),
    end: createDate(2, 5, 2025, 1, 15),
    tipoEvento: "Entregable",
    allDay: true
  },
  {
    id: "5",
    title: "Entrega de Documentos",
    description: "Fecha límite para entregar los documentos",
    start: createDate(27, 5, 2025, 0, 43),
    end: createDate(27, 5, 2025, 0, 43),
    tipoEvento: "Entregable",
    allDay: true
  },
  {
    id: "6",
    title: "Entrega de Documentos",
    description: "Fecha límite para entregar los documentos",
    start: createDate(27, 5, 2025, 1, 15),
    end: createDate(2, 5, 2025, 1, 15),
    tipoEvento: "Entregable",
    allDay: true
  },
  {
    id: "7",
    title: "Entrega de Documentos",
    description: "Fecha límite para entregar los documentos",
    start: createDate(27, 5, 2025, 1, 15),
    end: createDate(2, 5, 2025, 1, 15),
    tipoEvento: "Entregable",
    allDay: true
  },
  {
    id: "8",
    title: "Entrega de Documentos",
    description: "Fecha límite para entregar los documentos",
    start: createDate(27, 5, 2025, 1, 15),
    end: createDate(2, 5, 2025, 1, 15),
    tipoEvento: "Entregable",
    allDay: true
  },
];

const AppHeader = () => {
  const [notificaciones, setNotificaciones] = useState<CalendarEvent[]>([]);

  useEffect(() => {
  const obtenerEventosProximos = () => {
    const ahora = new Date();
    const proximos: CalendarEvent[] = [];

    eventosEstaticos.forEach((evento) => {
      const diffMin = (evento.start.getTime() - ahora.getTime()) / 60000;

      if (diffMin <= 1440 && diffMin >= -15) {
        proximos.push(evento); // se mostrará en campanita
      }
    });

    return proximos;
  };

  const manejarNotificacionesToast = (eventos: CalendarEvent[]) => {
    const ahora = new Date();
    const notificados: string[] = JSON.parse(localStorage.getItem("toastNotificados") || "[]");

    eventos.forEach((evento) => {
      const diffMin = Math.round((evento.start.getTime() - ahora.getTime()) / 60000);

      const id1d = `${evento.id}-1d`;
      const id30 = `${evento.id}-30`;
      const id5 = `${evento.id}-5`;

      // Hasta 1 día
      if (diffMin <= 1440 && !notificados.includes(id1d)) {
        toast.info(`${evento.tipoEvento}: ${evento.title}\n\n${evento.start.toLocaleString("es-PE")}`);

        if (Notification.permission === "granted") {
          new Notification("Próximo evento:", {
            body: `${evento.title}\n${evento.start.toLocaleTimeString("es-PE")} - ${evento.end.toLocaleTimeString("es-PE")}`,
            icon: "/logo.png",
          });
        }
        notificados.push(id1d);
      }

      // 30 min
      if (diffMin >= 30 && !notificados.includes(id30)) {
         toast.info(`Próximo evento en 30 minutos: ${evento.title}\n\n${evento.start.toLocaleString("es-PE")}`);

        if (Notification.permission === "granted") {
          new Notification("Próximo evento en 30 minutos", {
            body: `${evento.title}\n${evento.start.toLocaleTimeString("es-PE")} - ${evento.end.toLocaleTimeString("es-PE")}`,
            icon: "/logo.png",
          });
        }
        notificados.push(id30);
      }

      // 5 min
      if (diffMin >= 5 && !notificados.includes(id5)) {
        toast.info(`Próximo evento en 5 minutos: ${evento.title}\n\n${evento.start.toLocaleString("es-PE")}`);

        if (Notification.permission === "granted") {
          new Notification("Próximo evento en 5 minutos", {
            body: `${evento.title}\n${evento.start.toLocaleTimeString("es-PE")} - ${evento.end.toLocaleTimeString("es-PE")}`,
            icon: "/logo.png",
          });
        }

        notificados.push(id5);
      }
    });

    localStorage.setItem("toastNotificados", JSON.stringify(notificados));
  };

  // Ejecutar al cargar y luego cada 30s
  const actualizar = () => {
    const proximos = obtenerEventosProximos();
    setNotificaciones(proximos);
    manejarNotificacionesToast(proximos);
  };

  actualizar();
  const interval = setInterval(actualizar, 30000); // cada 30s

  return () => clearInterval(interval);
}, []);



  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white">
      <div className="flex items-center justify-between gap-2 px-4 flex-1">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={36}
          className="select-none pointer-events-none"
          draggable={false}
        />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificaciones.length > 0 && (
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 rounded-lg"
          >
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>No tienes nuevas notificaciones</DropdownMenuItem> */}
            {notificaciones.length === 0 ? (
              <DropdownMenuItem>No tienes nuevas notificaciones</DropdownMenuItem>
            ) : (
              notificaciones.map((n, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {n.start.toLocaleString("es-PE")}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
