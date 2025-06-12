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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { es } from "date-fns/locale";


import { Filter } from "lucide-react";
import { useEffect, useMemo  } from "react"; // Añade useEffect aquí
// ... (importaciones sin cambios)

import { useAuth } from "@/features/auth";
import axiosInstance from "@/lib/axios/axios-instance";

//type TipoEvento = "ENTREGABLE" | "REUNION" | "Otros";
type TipoEvento = "ENTREGABLE" | "REUNION" | "EXPOSICION";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start?: Date;
  end: Date;
  tipoEvento: TipoEvento;
  tesistas: string[]; // nombres completos
}

interface Tesista {
  id: number;
  nombreCompleto: string;
  temaTesis: string;
}

interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  tesistas: Tesista[];
}

const MiCronogramaPage = () => {
  const createDate = (day: number, month: number, year: number, hours = 0, minutes = 0) =>
    new Date(year, month - 1, day, hours, minutes);

    const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
    );

  const getColorByTipoEvento = (tipo: TipoEvento): "blue" | "green" | "pink" | "default" | "purple" | null | undefined => {
    switch (tipo) {
      case "ENTREGABLE": return "blue";
      case "REUNION": return "green";
      case "EXPOSICION": return "pink";
      default: return "default";
    }
  };

  const leyendaItemVariants = cva("flex items-center gap-2 text-sm", {
    variants: {
      color: {
        blue: "text-blue-600",
        green: "text-green-600",
        pink: "text-pink-600",
        default: "text-gray-600"
      }
    }
  });
  
  const { user } = useAuth();
  //const userId = 1;
  const [userId, setUserId] = useState<number | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEventosAsesor = async () => {
      try {
        const response = await axiosInstance.get("/api/eventos/asesor");
        const data = response.data;
  
        const eventosMapeados: CalendarEvent[] = [];
  
        data.forEach((evento: Evento, index: number) => {
          const {
            id,
            nombre,
            descripcion,
            tipo,
            fechaInicio,
            fechaFin,
            tesistas,
          } = evento;
  
          tesistas.forEach((tesista: Tesista) => {
            const eventoMapeado: CalendarEvent = {
              id: `${id}-${tesista.id}`, // ID único por evento-tesista
              title: nombre,
              description: descripcion,
              start: fechaInicio ? new Date(fechaInicio) : new Date(fechaFin),
              end: new Date(fechaFin),
              tipoEvento: tipo as TipoEvento,
              tesistas: [tesista.nombreCompleto],
            };
  
            eventosMapeados.push(eventoMapeado);
          });
        });
  
        setEvents(eventosMapeados);
      } catch (error) {
        console.error("Error al obtener eventos del asesor:", error);
      }
    };
  
    fetchEventosAsesor();
  }, []);
  

  // Estados para el filtro de tesistas
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTesistas, setSelectedTesistas] = useState<Record<string, boolean>>({});
  const [initialTesistasLoaded, setInitialTesistasLoaded] = useState(false);


  // Obtener lista única de tesistas
  const tesistasList = useMemo(() => {
    const nombres = events.flatMap(e => e.tesistas);
    return Array.from(new Set(nombres)).sort();
  }, [events]);
  

  // Inicializar los tesistas seleccionados (todos seleccionados por defecto)
  useEffect(() => {
    if (tesistasList.length > 0 && !initialTesistasLoaded) {
      const initialSelection = tesistasList.reduce((acc, tesista) => {
        acc[tesista] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedTesistas(initialSelection);
      setInitialTesistasLoaded(true);
    }
  }, [tesistasList, initialTesistasLoaded]);

  // Función para manejar cambios en los checkboxes
  const handleTesistaChange = (tesista: string) => {
    setSelectedTesistas(prev => ({
      ...prev,
      [tesista]: !prev[tesista]
    }));
  };

  // Función para aplicar los filtros
  const applyFilters = () => {
    setFilterOpen(false);
  };

  // Función para cancelar y restaurar selección anterior
  const cancelFilters = () => {
    setFilterOpen(false);
  };

  // Función para seleccionar/deseleccionar todos
  const toggleAllTesistas = (selectAll: boolean) => {
    const newSelection = tesistasList.reduce((acc, tesista) => {
      acc[tesista] = selectAll;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedTesistas(newSelection);
  };

  // Filtrar eventos basados en los tesistas seleccionados (usando useMemo para optimización)
  const filteredEvents = useMemo(() =>
    events.filter(event => 
      event.tesistas.some(nombre => selectedTesistas[nombre])
    ),
    [events, selectedTesistas]
  );

  // Mapear eventos para el calendario (también con useMemo)
  const eventosParaCalendario = useMemo(() => 
    filteredEvents.map(event => ({
      ...event,
      start: event.start || event.end, // Asegurar que start siempre tenga valor
      color: getColorByTipoEvento(event.tipoEvento),
      type: event.tipoEvento
    })),
    [filteredEvents]
  );

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

  console.log(events);

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Mi Cronograma</h1>
        <p className="text-muted-foreground">Eventos programados por los tesistas</p>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className={cn(leyendaItemVariants({ color: "blue" }))}>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Entregable</span>
        </div>
        <div className={cn(leyendaItemVariants({ color: "green" }))}>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Reunion</span>
        </div>
        <div className={cn(leyendaItemVariants({ color: "pink" }))}>
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Exposición</span>
        </div>


        <Button
          onClick={() => setIsExportDialogOpen(true)}
          variant="outline"
          className="flex items-center gap-2 ml-auto cursor-pointer"
        >
          <Download size={16} />
          Exportar calendario para Google Calendar
        </Button>

        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filtrar por tesista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filtrar por tesista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleAllTesistas(true)}
                >
                  Seleccionar todos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toggleAllTesistas(false)}
                >
                  Deseleccionar todos
                </Button>
              </div>
              
              <div className="space-y-2">
                {tesistasList.map(tesista => (
                  <div key={tesista} className="flex items-center space-x-2">
                    <CustomCheckbox 
                      checked={selectedTesistas[tesista] || false}
                      onChange={() => handleTesistaChange(tesista)}
                    />
                    <label
                      htmlFor={`tesista-${tesista}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tesista}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelFilters}>
                Cancelar
              </Button>
              <Button onClick={applyFilters}>
                Aplicar filtros
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          <Button onClick={handleExport} disabled={!!isRangoInvalido}>
            Exportar
          </Button>
        </DialogFooter>

        </DialogContent>
      </Dialog>

      <div className="h-screen flex flex-col">
        <Calendar 
            events={eventosParaCalendario} 
            key={JSON.stringify(selectedTesistas)} // Forzar re-render al cambiar filtros
            numTesistas={tesistasList.length}
            tipoUsuario='ASESOR'
          >
          <div className="h-full flex flex-col">
            <div className="flex px-6 items-center gap-2 mb-6 py-4 border-b">
              <CalendarViewTrigger view="day" className="aria-[current=true]:bg-accent px-3 py-1 text-sm rounded">Día</CalendarViewTrigger>
              <CalendarViewTrigger view="week" className="aria-[current=true]:bg-accent px-3 py-1 text-sm rounded">Semana</CalendarViewTrigger>
              <CalendarViewTrigger view="month" className="aria-[current=true]:bg-accent px-3 py-1 text-sm rounded">Mes</CalendarViewTrigger>
              <span className="flex-1" />
              <CalendarPrevTrigger className="p-2 rounded hover:bg-accent"><ChevronLeft size={20} /></CalendarPrevTrigger>
              <CalendarTodayTrigger className="px-3 py-1 text-sm rounded hover:bg-accent">Hoy</CalendarTodayTrigger>
              <CalendarNextTrigger className="p-2 rounded hover:bg-accent"><ChevronRight size={20} /></CalendarNextTrigger>
            </div>
            <div className="flex-1 overflow-auto px-6 pb-6">
              <CalendarMonthView />
              <CalendarWeekView tipoUsuario="Asesor" />
              <CalendarDayView tipoUsuario="Asesor"/>
            </div>
          </div>
        </Calendar>
      </div>
    </div>
  );
};

export default MiCronogramaPage;
