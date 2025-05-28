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
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Definimos los tipos de evento posibles
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
      start: createDate(15, 5, 2025, 8, 0),
      end: createDate(15, 5, 2025, 10, 0),
      tipoEvento: "Reunión"
    },
    {
      id: "2",
      title: "Exposición de avances",
      description: "Presentación de resultados parciales",
      start: createDate(15, 5, 2025, 11, 0),
      end: createDate(15, 5, 2025, 12, 0),
      tipoEvento: "Exposición"
    },
    {
      id: "3",
      title: "Entrega de Documentos",
      description: "Fecha límite para entregar los documentos",
      start: createDate(16, 5, 2025, 1, 0),
      end: createDate(16, 5, 2025, 1, 0),
      tipoEvento: "Entregable",
      allDay: true
    }
  ]);

  // Adaptamos los eventos para el calendario (mapeando tipoEvento a color)
  const eventosParaCalendario = events.map(event => ({
    ...event,
    color: getColorByTipoEvento(event.tipoEvento)
  }));

  // Estado para el formulario
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    tipoEvento: "Reunión",
    allDay: false
  });

  // Función para manejar el cambio de inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Función para manejar fechas
  const handleDateChange = (name: "start" | "end", value: string) => {
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
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      tipoEvento: "Reunión",
      allDay: false
    });
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 ml-auto">
              <PlusCircle size={18} />
              Crear nuevo evento
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear nuevo evento</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título*
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipoEvento" className="text-right">
                  Tipo de evento*
                </Label>
                <Select
                  value={newEvent.tipoEvento}
                  onValueChange={(value) => setNewEvent(prev => ({
                    ...prev,
                    tipoEvento: value as TipoEvento
                  }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entregable">Entregable</SelectItem>
                    <SelectItem value="Reunión">Reunión</SelectItem>
                    <SelectItem value="Exposición">Exposición</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right">
                  Fecha inicio*
                </Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={newEvent.start.toISOString().slice(0, 16)}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right">
                  Fecha fin*
                </Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={newEvent.end.toISOString().slice(0, 16)}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="allDay" className="text-right">
                  Todo el día
                </Label>
                <input
                  id="allDay"
                  type="checkbox"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev,
                    allDay: e.target.checked
                  }))}
                  className="h-4 w-4"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvent}>
                Guardar evento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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