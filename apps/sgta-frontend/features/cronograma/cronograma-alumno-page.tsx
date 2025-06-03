"use client";
import { useState } from "react";
import { 
  Calendar, 
  CalendarViewTrigger,
  CalendarCurrentDate, 
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarNextTrigger,
  CalendarDayView,
  CalendarWeekView,
  CalendarMonthView
} from "@/components/ui/full-calendar-mod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as MonthPicker } from "@/components/ui/calendar"; // asegúrate de tenerlo
import { es } from "date-fns/locale";


type TipoEvento = "Entregable" | "Reunión" | "Exposición";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start?: Date;
  end: Date;
  tipoEvento: TipoEvento;
}

const MiCronogramaPage = () => {
  const createDate = (day: number, month: number, year: number, hours = 0, minutes = 0) =>
    new Date(year, month - 1, day, hours, minutes);

  const getColorByTipoEvento = (tipo: TipoEvento) => {
    switch (tipo) {
      case "Entregable":
        return "blue";
      case "Reunión":
        return "green";
      case "Exposición":
        return "pink";
      default:
        return "default";
    }
  };

  const leyendaItemVariants = cva("flex items-center gap-2 text-sm", {
    variants: {
      color: {
        blue: "text-blue-600",
        green: "text-green-600",
        pink: "text-pink-600",
        black: "text-black",
        default: "text-gray-600"
      }
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Reunión con el asesor 1",
      description: "Primera revision de avances",
      start: createDate(26, 5, 2025, 8, 0),
      end: createDate(26, 5, 2025, 10, 0),
      tipoEvento: "Reunión"
    },
    {
      id: "2",
      title: "Exposición de avances",
      description: "Presentación de resultados parciales",
      start: createDate(26, 5, 2025, 11, 0),
      end: createDate(26, 5, 2025, 12, 0),
      tipoEvento: "Exposición"
    },
    {
      id: "3",
      title: "Entrega de Documentos",
      description: "Fecha límite para entregar los documentos",
      start: createDate(26, 5, 2025, 13, 0),
      end: createDate(26, 5, 2025, 13, 0),
      tipoEvento: "Entregable"
    },
    {
      id: "4",
      title: "Entrega de Documentos 2",
      description: "Fecha límite para entregar los documentos",
      start: createDate(26, 6, 2025, 13, 0),
      end: createDate(26, 6, 2025, 13, 0),
      tipoEvento: "Entregable"
    }
  ]);

  const eventosParaCalendario = events.map((event) => ({
    ...event,
    color: getColorByTipoEvento(event.tipoEvento),
    type: event.tipoEvento
  }));

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [modoExportacion, setModoExportacion] = useState<"actual" | "rango">("actual");
  const [mesInicioDate, setMesInicioDate] = useState<Date | null>(new Date());
  const [mesFinDate, setMesFinDate] = useState<Date | null>(new Date());

  const handleExport = () => {
    const now = new Date();

    let eventosFiltrados = events;

    if (modoExportacion === "actual") {
      const mesActual = now.getMonth();
      eventosFiltrados = events.filter((event) => {
        const fecha = event.start ?? event.end;
        return fecha.getMonth() === mesActual && fecha.getFullYear() === now.getFullYear();
      });
    } else {
      if (!mesInicioDate || !mesFinDate) return;
      const startMonth = mesInicioDate.getMonth();
      const startYear = mesInicioDate.getFullYear();
      const endMonth = mesFinDate.getMonth();
      const endYear = mesFinDate.getFullYear();

      eventosFiltrados = events.filter((event) => {
        const fecha = event.start ?? event.end;
        const mes = fecha.getMonth();
        const anio = fecha.getFullYear();
        const desde = new Date(startYear, startMonth);
        const hasta = new Date(endYear, endMonth + 1); // incluye el mesFin
        return fecha >= desde && fecha < hasta;
      });
    }

    const headers = ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description"];
    const rows = eventosFiltrados.map((event) => [
      event.tipoEvento,
      format(event.start ?? event.end, "yyyy-MM-dd"),
      format(event.start ?? event.end, "HH:mm"),
      format(event.end, "yyyy-MM-dd"),
      format(event.end, "HH:mm"),
      event.description || ""
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "calendario_eventos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportDialogOpen(false);
  };

  const isRangoInvalido =
  modoExportacion === "rango" &&
  mesInicioDate &&
  mesFinDate &&
  (mesFinDate.getFullYear() < mesInicioDate.getFullYear() ||
    (mesFinDate.getFullYear() === mesInicioDate.getFullYear() &&
      mesFinDate.getMonth() < mesInicioDate.getMonth()));

  const mesActual = new Date().toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Mi Cronograma</h1>
        <p className="text-muted-foreground">Visualización de eventos planificados</p>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className={cn(leyendaItemVariants({ color: "blue" }))}>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Entregable</span>
        </div>
        <div className={cn(leyendaItemVariants({ color: "green" }))}>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Reunión</span>
        </div>
        <div className={cn(leyendaItemVariants({ color: "pink" }))}>
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Exposición</span>
        </div>

        {/* Botón para abrir el popup de exportación */}
        <Button
          onClick={() => setIsExportDialogOpen(true)}
          variant="outline"
          className="flex items-center gap-2 ml-auto cursor-pointer"
        >
          <Download size={16} />
          Exportar calendario para Google Calendar
        </Button>
      </div>

      {/* Modal de selección de exportación */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar calendario para Google Calendar</DialogTitle>
            <DialogDescription>Selecciona el periodo de exportación.</DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={modoExportacion}
            onValueChange={(val) => setModoExportacion(val as "actual" | "rango")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="actual" id="actual" />
              <label htmlFor="actual" className="text-sm">
                Mes actual: {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rango" id="rango" />
              <label htmlFor="rango" className="text-sm">Rango personalizado</label>
            </div>
          </RadioGroup>

          {modoExportacion === "rango" && (
          <div className="flex gap-4 pt-4">
            {/* MES INICIO */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Mes inicio</span>
              <div className="flex gap-2">
                <select
                  value={(mesInicioDate?.getMonth() ?? 0)}
                  onChange={(e) =>
                    setMesInicioDate((prev) => {
                      const year = prev?.getFullYear() ?? new Date().getFullYear();
                      return new Date(year, parseInt(e.target.value));
                    })
                  }
                  className="border p-2 rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {format(new Date(2000, i), "MMMM", { locale: es })}
                    </option>
                  ))}
                </select>
                <select
                  value={(mesInicioDate?.getFullYear() ?? new Date().getFullYear())}
                  onChange={(e) =>
                    setMesInicioDate((prev) => {
                      const month = prev?.getMonth() ?? 0;
                      return new Date(parseInt(e.target.value), month);
                    })
                  }
                  className="border p-2 rounded"
                >
                  {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {isRangoInvalido && (
                <p className="text-sm text-red-600 mt-2">
                  El mes inicio no puede ser posterior al mes fin.
                </p>
              )}
            </div>

            {/* MES FIN */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Mes fin</span>
              <div className="flex gap-2">
                <select
                  value={(mesFinDate?.getMonth() ?? 0)}
                  onChange={(e) =>
                    setMesFinDate((prev) => {
                      const year = prev?.getFullYear() ?? new Date().getFullYear();
                      return new Date(year, parseInt(e.target.value));
                    })
                  }
                  className="border p-2 rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {format(new Date(2000, i), "MMMM", { locale: es })}
                    </option>
                  ))}
                </select>
                <select
                  value={(mesFinDate?.getFullYear() ?? new Date().getFullYear())}
                  onChange={(e) =>
                    setMesFinDate((prev) => {
                      const month = prev?.getMonth() ?? 0;
                      return new Date(parseInt(e.target.value), month);
                    })
                  }
                  className="border p-2 rounded"
                >
                  {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {isRangoInvalido && (
                <p className="text-sm text-red-600 mt-2">
                  El mes fin no puede ser anterior al mes inicio.
                </p>
              )}
            </div>
          </div>
)}


        <DialogFooter>
          <Button onClick={handleExport} disabled={isRangoInvalido}>
            Exportar
          </Button>
        </DialogFooter>

        </DialogContent>
      </Dialog>

      <div className="h-screen flex flex-col">
        <Calendar events={eventosParaCalendario}>
          <div className="h-full flex flex-col">
            <div className="flex px-6 items-center gap-2 mb-6 py-4 border-b">
              <CalendarViewTrigger
                view="day"
                className="aria-[current=true]:bg-accent px-3 py-1 text-sm rounded"
              >
                Día
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent px-3 py-1 text-sm rounded"
              >
                Semana
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent px-3 py-1 text-sm rounded"
              >
                Mes
              </CalendarViewTrigger>

              <span className="flex-1" />

              <CalendarPrevTrigger className="p-2 rounded hover:bg-accent">
                <ChevronLeft size={20} />
                <span className="sr-only">Anterior</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger className="px-3 py-1 text-sm rounded hover:bg-accent">
                Ver día de hoy
              </CalendarTodayTrigger>

              <CalendarNextTrigger className="p-2 rounded hover:bg-accent">
                <ChevronRight size={20} />
                <span className="sr-only">Siguiente</span>
              </CalendarNextTrigger>
            </div>

            <div className="flex-1 overflow-auto px-6 pb-6">
              <CalendarMonthView />
              <CalendarWeekView />
              <CalendarDayView />
            </div>
          </div>
        </Calendar>
      </div>
    </div>
  );
};

export default MiCronogramaPage;
