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

// Definimos los tipos de evento posibles
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
  // Función para crear fechas con formato más legible
  const createDate = (
    day: number, 
    month: number, 
    year: number, 
    hours: number = 0, 
    minutes: number = 0
  ) => {
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Función que asigna colores según el tipo de evento
  const getColorByTipoEvento = (tipo: TipoEvento) => {
    switch(tipo) {
      case "Entregable": return "blue";
      case "Reunión": return "green";
      case "Exposición": return "pink";
      default: return "default";
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

  // Preparamos los eventos con el nuevo formato
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
      tipoEvento: "Entregable",
    }
  ]);

  // Adaptamos los eventos para el calendario (mapeando tipoEvento a color)
  const eventosParaCalendario = events.map(event => ({
    ...event,
    color: getColorByTipoEvento(event.tipoEvento),
    type: event.tipoEvento // <- se adapta al nombre esperado
  }));

  // Estado para el formulario
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
    tipoEvento: "Reunión",
  });

  // Función para manejar el cambio de inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Función para manejar fechas
  const handleDateChange = (name: 'start' | 'end', value: string) => {
    const date = new Date(value);
    setNewEvent(prev => ({ ...prev, [name]: date }));
  };

  // Función para añadir el evento
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
    });
  };

  //Boton de exportar a csv
  const ExportToCSVButton = ({ events }: { events: CalendarEvent[] }) => {
    const exportToCSV = () => {
      // Verificar que todos los eventos tengan start definido
      const validEvents = events.filter(event => event.start !== undefined);
      
      // Encabezados del CSV según especificación
      const headers = [
        'Subject',
        'Start Date',
        'Start Time',
        'End Date',
        'End Time',
        'Description'
      ];
  
      // Convertir eventos a filas CSV (sin comillas en Subject y Description)
      const rows = validEvents.map(event => [
        event.tipoEvento,               // Subject (sin comillas)
        format(event.start!, 'yyyy-MM-dd'), // Start Date
        format(event.start!, 'HH:mm'),     // Start Time
        format(event.end, 'yyyy-MM-dd'),   // End Date
        format(event.end, 'HH:mm'),        // End Time
        event.description || ''           // Description (sin comillas)
      ]);
  
      // Combinar encabezados y filas
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
  
      // Crear archivo descargable
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
        className="flex items-center gap-2 ml-auto cursor-pointer" // Añadido cursor-pointer
      >
        <Download size={16} />
        Exportar calendario a CSV
      </Button>
    );
  };

  return (
    <div className="space-y-8 mt-4">
      <div>
        <h1 className="text-3xl font-bold text-[#042354]">Mi Cronograma</h1>
        <p className="text-muted-foreground">
          Visualización de eventos planificados
        </p>
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
        <div className={cn(leyendaItemVariants({ color: "black" }))}>
          <div className="w-3 h-3 rounded-full bg-black"></div>
          <span>Otros</span>
        </div>

        {/* Botón para abrir el popup */}
        
        {/* Botón para exportar a csv */}
        <ExportToCSVButton events={events} />

      </div>

      <div className="h-screen flex flex-col">
        <Calendar events={eventosParaCalendario}>
          <div className="h-full flex flex-col">
            {/* Barra de controles */}
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

            {/* Vista del Calendario */}
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