"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  CalendarViewTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarNextTrigger,
  CalendarDayView,
  CalendarWeekView,
  CalendarMonthView,
} from "@/components/ui/full-calendar-mod";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { es } from "date-fns/locale";
import { useAuth } from "@/features/auth";
import { useAuthStore } from "@/features/auth/store/auth-store";
import axiosInstance from "@/lib/axios/axios-instance";
import {
  RegistrarReunionModal,
  type ReunionFormData,
} from "@/features/cronograma/registrar-reunion-modal";
type TipoEvento = "ENTREGABLE" | "REUNION" | "EXPOSICION";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start?: Date;
  end: Date;
  tipoEvento: TipoEvento;
}

interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  tesistas: null;
}

// Importa los tipos si usas TypeScript
declare global {
  interface Window {
    gapi: unknown;
  }
}

const MiCronogramaPage = () => {
  const getColorByTipoEvento = (
    tipo: TipoEvento,
  ): "blue" | "green" | "pink" | "default" | "purple" | null => {
    switch (tipo) {
      case "ENTREGABLE":
        return "blue";
      case "REUNION":
        return "green";
      case "EXPOSICION":
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
        default: "text-gray-600",
      },
    },
  });

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const normalizarTipoEvento = (tipo: string): TipoEvento => {
    switch (tipo.toUpperCase()) {
      case "REUNION":
        return "REUNION";
      case "ENTREGABLE":
        return "ENTREGABLE";
      case "EXPOSICION":
        return "EXPOSICION";
      default:
        return "Sin título" as TipoEvento;
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }
        const response = await axiosInstance.get("/api/eventos/tesista");

        // Mapear eventos asignando IDs únicos desde el front
        const eventosMapeados = response.data.map(
          (evento: Evento, index: number) => {
            const tipoEvento = normalizarTipoEvento(evento.tipo);
            const endDate = new Date(evento.fechaFin || evento.fechaInicio);
            const startDate =
              tipoEvento === "ENTREGABLE"
                ? endDate
                : new Date(evento.fechaInicio);

            return {
              id: (index + 1).toString(), // ID generado automáticamente desde 1 en adelante
              title: evento.nombre || "Sin título",
              description: evento.descripcion || "",
              start: startDate,
              end: endDate,
              tipoEvento,
            };
          },
        );

        setEvents(eventosMapeados);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  const eventosParaCalendario = events.map((event) => ({
    ...event,
    color: getColorByTipoEvento(event.tipoEvento),
    type: event.tipoEvento,
    tesista: "X",
  }));

  //console.log(eventosParaCalendario);

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [modoExportacion, setModoExportacion] = useState<"actual" | "rango">(
    "actual",
  );
  const [mesInicioDate, setMesInicioDate] = useState<Date | null>(new Date());
  const [mesFinDate, setMesFinDate] = useState<Date | null>(new Date());
  const [isReunionModalOpen, setIsReunionModalOpen] = useState(false);
  const handleEventClick = (event: CalendarEvent) => {
    console.log("Evento seleccionado:", event);
  };
  const handleRegistrarReunion = async (reunionData: ReunionFormData) => {
    try {
      // Here you would typically make an API call to save the meeting
      console.log("Registrando reunión:", reunionData);

      // For now, we'll just add it to the local events state
      const newEvent: CalendarEvent = {
        id: (events.length + 1).toString(),
        title: reunionData.titulo,
        description: reunionData.descripcion,
        start: new Date(reunionData.fechaHoraInicio),
        end: new Date(reunionData.fechaHoraFin),
        tipoEvento: "REUNION",
      };

      setEvents((prev) => [...prev, newEvent]);

      // You could also make an API call here:
      // await axiosInstance.post("/api/reuniones", reunionData);

      // Close the modal
      setIsReunionModalOpen(false);

      // You could show a success message here
      console.log("Reunión registrada exitosamente");
    } catch (error) {
      console.error("Error al registrar la reunión:", error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleExport = () => {
    const now = new Date();
    let eventosFiltrados = events;

    if (modoExportacion === "actual") {
      const mesActual = now.getMonth();
      eventosFiltrados = events.filter((event) => {
        const fecha = event.start ?? event.end;
        return (
          fecha.getMonth() === mesActual &&
          fecha.getFullYear() === now.getFullYear()
        );
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

    const headers = [
      "Subject",
      "Start Date",
      "Start Time",
      "End Date",
      "End Time",
      "Description",
    ];
    const rows = eventosFiltrados.map((event) => [
      event.tipoEvento,
      format(event.start ?? event.end, "yyyy-MM-dd"),
      format(event.start ?? event.end, "HH:mm"),
      format(event.end, "yyyy-MM-dd"),
      format(event.end, "HH:mm"),
      event.description || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

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

        <div className="flex gap-2 ml-auto">
          <Button onClick={() => setIsReunionModalOpen(true)}>
            Registrar reunión
          </Button>
          <Button
            onClick={() => setIsExportDialogOpen(true)}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            Exportar calendario para Google Calendar
          </Button>
        </div>
      </div>

      {/* Modal de selección de exportación */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar calendario para Google Calendar</DialogTitle>
            <DialogDescription>
              Selecciona el periodo de exportación.
            </DialogDescription>
          </DialogHeader>

          <RadioGroup
            value={modoExportacion}
            onValueChange={(val) =>
              setModoExportacion(val as "actual" | "rango")
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="actual" id="actual" />
              <label htmlFor="actual" className="text-sm">
                Mes actual:{" "}
                {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rango" id="rango" />
              <label htmlFor="rango" className="text-sm">
                Rango personalizado
              </label>
            </div>
          </RadioGroup>

          {modoExportacion === "rango" && (
            <div className="flex gap-4 pt-4">
              {/* MES INICIO */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Mes inicio</span>
                <div className="flex gap-2">
                  <select
                    value={mesInicioDate?.getMonth() ?? 0}
                    onChange={(e) =>
                      setMesInicioDate((prev) => {
                        const year =
                          prev?.getFullYear() ?? new Date().getFullYear();
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
                    value={
                      mesInicioDate?.getFullYear() ?? new Date().getFullYear()
                    }
                    onChange={(e) =>
                      setMesInicioDate((prev) => {
                        const month = prev?.getMonth() ?? 0;
                        return new Date(parseInt(e.target.value), month);
                      })
                    }
                    className="border p-2 rounded"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ),
                    )}
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
                    value={mesFinDate?.getMonth() ?? 0}
                    onChange={(e) =>
                      setMesFinDate((prev) => {
                        const year =
                          prev?.getFullYear() ?? new Date().getFullYear();
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
                    value={
                      mesFinDate?.getFullYear() ?? new Date().getFullYear()
                    }
                    onChange={(e) =>
                      setMesFinDate((prev) => {
                        const month = prev?.getMonth() ?? 0;
                        return new Date(parseInt(e.target.value), month);
                      })
                    }
                    className="border p-2 rounded"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                {isRangoInvalido && (
                  <p className="text-sm text-red-600 mt-2">
                    El mes fin no puede ser anterior al mes inicio.
                  </p>
                )}
              </div>
              {isRangoInvalido && (
                <p className="text-sm text-red-600 mt-2">
                  El mes inicio no puede ser posterior al mes fin.
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleExport} disabled={!!isRangoInvalido}>
              Exportar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="h-screen flex flex-col">
        <Calendar
          events={eventosParaCalendario}
          numTesistas={1}
          tipoUsuario="ALUMNO"
        >
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
              <CalendarWeekView tipoUsuario="Alumno" />
              <CalendarDayView tipoUsuario="Alumno" />
            </div>
          </div>
        </Calendar>
        <RegistrarReunionModal
          isOpen={isReunionModalOpen}
          onClose={() => setIsReunionModalOpen(false)}
          onSubmit={handleRegistrarReunion}
        />
      </div>
    </div>
  );
};

export default MiCronogramaPage;
