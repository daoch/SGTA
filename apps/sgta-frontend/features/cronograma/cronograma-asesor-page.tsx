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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';


import { Filter } from "lucide-react";
import { useEffect, useMemo  } from 'react'; // Añade useEffect aquí
// ... (importaciones sin cambios)

//type TipoEvento = "Entregable" | "Reunión" | "Otros";
type TipoEvento = "Entregable" | "Reunión";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start?: Date;
  end: Date;
  tipoEvento: TipoEvento;
  tesista: string;
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

  const getColorByTipoEvento = (tipo: TipoEvento) => {
    switch (tipo) {
      case "Entregable": return "blue";
      case "Reunión": return "green";
      //case "Otros": return "black";
      default: return "default";
    }
  };

  const leyendaItemVariants = cva("flex items-center gap-2 text-sm", {
    variants: {
      color: {
        blue: "text-blue-600",
        green: "text-green-600",
        black: "text-black",
        default: "text-gray-600"
      }
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>([
  {
    id: "1",
    title: "Reunión con el asesor",
    description: "Primera revisión",
    start: createDate(26, 5, 2025, 8, 0),
    end: createDate(26, 5, 2025, 10, 0),
    tipoEvento: "Reunión",
    tesista: "Luis Sánchez"
  },
  {
    id: "2",
    title: "Entrega de capítulo 2",
    description: "Fecha límite para entregar",
    start: createDate(27, 5, 2025, 14, 0),
    end: createDate(27, 5, 2025, 14, 0),
    tipoEvento: "Entregable",
    tesista: "Luis Sánchez"
  },
  {
    id: "3",
    title: "Reunión de seguimiento",
    description: "Estado del marco teórico",
    start: createDate(28, 5, 2025, 9, 30),
    end: createDate(28, 5, 2025, 10, 30),
    tipoEvento: "Reunión",
    tesista: "Andrés Quispe"
  },
  {
    id: "4",
    title: "Entrega de cronograma corregido",
    description: "Versión final del cronograma",
    start: createDate(29, 5, 2025, 11, 0),
    end: createDate(29, 5, 2025, 11, 0),
    tipoEvento: "Entregable",
    tesista: "Andrés Quispe"
  },
  {
    id: "5",
    title: "Reunión para feedback",
    description: "Revisión de introducción",
    start: createDate(30, 5, 2025, 13, 0),
    end: createDate(30, 5, 2025, 14, 0),
    tipoEvento: "Reunión",
    tesista: "Carlos Díaz"
  },
  {
    id: "6",
    title: "Entrega de bibliografía",
    description: "Lista preliminar",
    start: createDate(26, 5, 2025, 16, 0),
    end: createDate(26, 5, 2025, 16, 0),
    tipoEvento: "Entregable",
    tesista: "Carlos Díaz"
  },
  {
    id: "7",
    title: "Reunión con jurado interno",
    description: "Defensa preliminar",
    start: createDate(27, 5, 2025, 10, 0),
    end: createDate(27, 5, 2025, 11, 30),
    tipoEvento: "Reunión",
    tesista: "Iván Ramírez"
  },
  {
    id: "8",
    title: "Entrega de análisis de resultados",
    description: "Informe parcial",
    start: createDate(28, 5, 2025, 15, 0),
    end: createDate(28, 5, 2025, 15, 0),
    tipoEvento: "Entregable",
    tesista: "Iván Ramírez"
  },
  {
    id: "9",
    title: "Reunión de planificación",
    description: "Preparación de defensa",
    start: createDate(30, 5, 2025, 9, 0),
    end: createDate(30, 5, 2025, 10, 0),
    tipoEvento: "Reunión",
    tesista: "Eduardo Salas"
  },
  {
    id: "10",
    title: "Entrega del capítulo metodológico",
    description: "Última versión",
    start: createDate(31, 5, 2025, 10, 0),
    end: createDate(31, 5, 2025, 10, 0),
    tipoEvento: "Entregable",
    tesista: "Eduardo Salas"
  }
]);

  // Estados para el filtro de tesistas
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTesistas, setSelectedTesistas] = useState<Record<string, boolean>>({});
  const [initialTesistasLoaded, setInitialTesistasLoaded] = useState(false);


  // Obtener lista única de tesistas
  const tesistasList = useMemo(() => 
    Array.from(new Set(events.map(event => event.tesista))).sort(),
    [events]
  );

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
    events.filter(event => selectedTesistas[event.tesista]),
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    tipoEvento: "Reunión",
    tesista: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: 'start' | 'end', value: string) => {
    const date = new Date(value);
    setNewEvent(prev => ({ ...prev, [name]: date }));
  };

  const handleAddEvent = () => {
    const eventWithId = {
      ...newEvent,
      id: Math.random().toString(36).substring(2, 9)
    };
    setEvents(prev => [...prev, eventWithId]);
    setIsDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      start: new Date(),
      end: new Date(),
      tipoEvento: "Reunión",
      tesista: ''
    });
  };

//Boton de exportar a csv
const ExportToCSVButton = () => {
  const exportToCSV = () => {
    // Usamos directamente eventosParaCalendario y filtramos los que tienen start definido
    const validEvents = eventosParaCalendario.filter(event => event.start !== undefined);
    
    // Encabezados del CSV (se mantienen igual)
    const headers = [
      'Subject',
      'Start Date',
      'Start Time',
      'End Date',
      'End Time',
      'Description'
    ];

    // Convertir eventos a filas CSV (formato idéntico al original)
    const rows = validEvents.map(event => [
      event.tipoEvento,               // Subject
      format(event.start!, 'yyyy-MM-dd'), // Start Date
      format(event.start!, 'HH:mm'),     // Start Time
      format(event.end, 'yyyy-MM-dd'),   // End Date
      format(event.end, 'HH:mm'),        // End Time
      event.description 
    ? (event.tesista ? `${event.description} - ${event.tesista}` : event.description)
    : (event.tesista || '')          // Description
    ]);

    // Crear contenido CSV (igual que antes)
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Crear y descargar archivo (mismo proceso)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calendario_eventos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={exportToCSV}
      variant="outline"
      className="flex items-center gap-2 ml-auto cursor-pointer"
    >
      <Download size={16} />
      Exportar calendario para Google Calendar
    </Button>
  );
};

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
          <span>Reunión</span>
        </div>
        {/*<div className={cn(leyendaItemVariants({ color: "black" }))}>
          <div className="w-3 h-3 rounded-full bg-black"></div>
          <span>Otros</span>
        </div>*/}


        <ExportToCSVButton />


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

      <div className="h-screen flex flex-col">
        <Calendar 
            events={eventosParaCalendario} 
            key={JSON.stringify(selectedTesistas)} // Forzar re-render al cambiar filtros
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
