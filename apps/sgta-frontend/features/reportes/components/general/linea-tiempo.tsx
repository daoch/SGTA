import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { addDays, format, isBefore, parseISO } from "date-fns";

import { getEntregablesAlumno } from "@/features/reportes/services/report-services";
import type { User } from "@/features/auth/types/auth.types";
import { Eye } from "lucide-react";


const currentDate = new Date("2023-04-18");

interface Props {
  user: User;
}

interface TimelineEvent {
  event: string;
  date: string;
  status: "Completado" | "Pendiente" | "En progreso";
  isLate: boolean;
  daysRemaining: number;
  isAtRisk: boolean;

  esEvaluable: boolean;
  nota: number | null;
}


export function LineaTiempoReporte({ user }: Props) {
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        const alumnoId = "36"; // Hardcodeado por ahora
        const data = await getEntregablesAlumno(alumnoId);

        const eventosTransformados: TimelineEvent[] = data.map((item: {
          nombreEntregable: string;
          fechaEnvio: string;
          estado: string;
          esEvaluable: boolean;
          nota: number | null;
        }) => {
          const eventDate = parseISO(item.fechaEnvio);
          const daysRemaining = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

          const statusMap: Record<string, TimelineEvent["status"]> = {
            no_enviado: "Pendiente",
            enviado_a_tiempo: "Completado",
            enviado_tarde: "Completado",
          };

          const isLate = item.estado === "enviado_tarde";
          const status = statusMap[item.estado] || "Pendiente";

          const isAtRisk =
            daysRemaining > 0 &&
            daysRemaining <= 3 &&
            status !== "Completado" &&
            status !== "En progreso" &&
            !isLate;

          return {
            event: item.nombreEntregable,
            date: format(eventDate, "yyyy-MM-dd"),
            status,
            isLate,
            daysRemaining,
            isAtRisk,
            esEvaluable: item.esEvaluable,
            nota: item.nota,
          };
        });

        eventosTransformados.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        setTimelineEvents(eventosTransformados);
      } catch (error) {
        console.error("Error al obtener entregables:", error);
      }
    };

    fetchEntregables();
  }, [user]);

  const filteredByTime = timelineEvents.filter((event) => {
    const eventDate = parseISO(event.date);

    switch (timeFilter) {
      case "past":
        return isBefore(eventDate, currentDate);
      case "upcoming30":
        return !isBefore(eventDate, currentDate) && isBefore(eventDate, addDays(currentDate, 30));
      case "upcoming90":
        return !isBefore(eventDate, currentDate) && isBefore(eventDate, addDays(currentDate, 90));
      case "all":
      default:
        return true;
    }
  });

  const filteredEvents = filteredByTime.filter((event) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "completed" && event.status === "Completado") return true;
    if (statusFilter === "inProgress" && event.status === "En progreso") return true;
    if (statusFilter === "pending" && event.status === "Pendiente" && !event.isLate && !event.isAtRisk) return true;
    if (statusFilter === "late" && event.isLate) return true;
    if (statusFilter === "atRisk" && event.isAtRisk) return true;
    return false;
  });

  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Avances y Entregas</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tiempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los eventos</SelectItem>
              <SelectItem value="past">Eventos pasados</SelectItem>
              <SelectItem value="upcoming30">Próximos 30 días</SelectItem>
              <SelectItem value="upcoming90">Próximos 90 días</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Button variant="outline" onClick={handleStatusFilterClick}>
              Filtrar por estado
            </Button>
            {showStatusFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                <div className="p-3 space-y-2">
                  <h4 className="font-medium text-sm">Estado</h4>
                  <div className="space-y-1">
                    {["all", "completed", "inProgress", "pending", "late", "atRisk"].map((filter) => (
                      <Button
                        key={filter}
                        variant={statusFilter === filter ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          setStatusFilter(filter);
                          setShowStatusFilter(false);
                        }}
                      >
                        {filter === "all" && "Todos"}
                        {filter === "completed" && "Completado"}
                        {filter === "inProgress" && "En progreso"}
                        {filter === "pending" && "Pendiente"}
                        {filter === "late" && "Retrasado"}
                        {filter === "atRisk" && "En riesgo"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-gray-200 ml-3 pl-8 space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div key={index} className="relative">
                <div
                  className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${
                    event.status === "Completado"
                      ? "bg-green-500 border-green-500"
                      : event.status === "En progreso"
                      ? "bg-blue-500 border-blue-500"
                      : event.isLate
                      ? "bg-red-500 border-red-500"
                      : event.isAtRisk
                      ? "bg-yellow-500 border-yellow-500"
                      : "bg-gray-300 border-gray-300"
                  }`}
                ></div>
                <div>
                  <time className="mb-1 text-xs font-normal text-gray-500">{event.date}</time>
                  <h3 className="text-sm font-medium">
                    {event.event}
                    {event.isLate && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">Retrasado</span>
                    )}
                    {event.isAtRisk && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                        En riesgo ({event.daysRemaining} días)
                      </span>
                    )}
                  </h3>
                  
                  <p
                    className={`text-xs flex items-center ${
                      event.status === "Completado"
                        ? "text-green-600"
                        : event.status === "En progreso"
                        ? "text-blue-600"
                        : event.isLate
                        ? "text-red-600"
                        : event.isAtRisk
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{event.status}</span>
                    {event.esEvaluable && (
                      <span className="ml-2 text-xs font-semibold text-gray-800">
                        — Nota: {event.nota ?? "-"}
                      </span>
                    )}
                    {/* Botón “eye” + texto “Ver detalle” en blanco/negro */}
                    <Button variant="ghost" className="ml-4 text-gray-800 hover:text-gray-900" size="sm">
                      <Eye className="h-4 w-4" />
                      <span className="ml-1 text-xs">Ver detalle</span>
                    </Button>
                  </p>


                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay eventos que coincidan con los filtros seleccionados
            </div>
          )}
        </div>
      </CardContent>

    </Card>
  );
}
