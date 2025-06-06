// src/components/LineaTiempoReporte.tsx

import { useEffect, useState } from "react";
import { addDays, format, isBefore, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";

import { getEntregablesAlumno } from "@/features/reportes/services/report-services";
import type { User } from "@/features/auth/types/auth.types";

const currentDate = new Date("2023-04-18");

type TimeFilter = "all" | "past" | "upcoming30" | "upcoming90";

// Ahora StatusFilter incluye los valores crudos de ambas tablas + "all"
type StatusFilter =
  | "all"
  | "no_enviado"
  | "enviado_a_tiempo"
  | "enviado_tarde"
  | "no_iniciado"
  | "en_proceso"
  | "terminado";

interface Criterio {
  id: number;
  nombre: string;
  notaMaxima: number;
  descripcion: string;
  nota: number | null;
}

interface TimelineEvent {
  event: string;
  date: string;

  // 1) crudo de “entregable”:
  rawEstadoEntregable: "no_iniciado" | "en_proceso" | "terminado";

  // 2) crudo de “entregable_x_tema”:
  rawEstadoXTema: "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";

  // 3) estado interno para filtros “Completado” / “Pendiente” / “En progreso”
  status: "Completado" | "Pendiente" | "En progreso";
  isLate: boolean;
  daysRemaining: number;
  isAtRisk: boolean;

  esEvaluable: boolean;
  nota: number | null;
  criterios: Criterio[];
}

interface Props {
  user: User;
}

export function LineaTiempoReporte({ user }: Props) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Modal de criterios:
  const [isCriteriosModalOpen, setIsCriteriosModalOpen] = useState(false);
  const [selectedCriterios, setSelectedCriterios] = useState<Criterio[]>([]);

  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        const alumnoId = "11"; // Hardcodeado por ahora
        const data = await getEntregablesAlumno(alumnoId);

        // Definimos el tipo de cada elemento que recibimos de la API:
        type RawEntregable = {
          nombreEntregable: string;
          fechaEnvio: string | null;
          estadoEntregable: "no_iniciado" | "en_proceso" | "terminado";
          estadoXTema: "no_enviado" | "enviado_a_tiempo" | "enviado_tarde";
          esEvaluable: boolean;
          nota: number | null;
          criterios: Criterio[];
        };

        // Convertimos data a RawEntregable[] y filtramos los que tengan fechaEnvio != null
        const rawData = data as RawEntregable[];
        const eventosTransformados: TimelineEvent[] = rawData
          .filter((item) => item.fechaEnvio !== null)
          .map((item) => {
            // Para TypeScript, usamos "!" porque ya filtramos los null
            const eventDate = parseISO(item.fechaEnvio!);
            const daysRemaining = Math.ceil(
              (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            // ——— Determinamos el “status” interno (no afecta el filtro por crudo)
            let statusInterno: TimelineEvent["status"] = "Pendiente";
            if (item.estadoEntregable === "terminado") {
              statusInterno = "Completado";
            } else if (item.estadoEntregable === "en_proceso") {
              statusInterno = "En progreso";
            } else {
              statusInterno = "Pendiente"; // no_iniciado
            }

            // isLate si el entregable llegó tarde
            const isLateFlag = item.estadoXTema === "enviado_tarde";

            const isAtRiskFlag =
              daysRemaining > 0 &&
              daysRemaining <= 3 &&
              statusInterno === "Pendiente" &&
              !isLateFlag;

            return {
              event: item.nombreEntregable,
              date: format(eventDate, "yyyy-MM-dd"),
              rawEstadoEntregable: item.estadoEntregable,
              rawEstadoXTema: item.estadoXTema,
              status: statusInterno,
              isLate: isLateFlag,
              daysRemaining,
              isAtRisk: isAtRiskFlag,
              esEvaluable: item.esEvaluable,
              nota: item.nota,
              criterios: item.criterios || [],
            };
          });

        eventosTransformados.sort(
          (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
        );
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
        return (
          !isBefore(eventDate, currentDate) &&
          isBefore(eventDate, addDays(currentDate, 30))
        );
      case "upcoming90":
        return (
          !isBefore(eventDate, currentDate) &&
          isBefore(eventDate, addDays(currentDate, 90))
        );
      case "all":
      default:
        return true;
    }
  });

  // Ahora filtramos por el valor crudo seleccionado en statusFilter
  const filteredEvents = filteredByTime.filter((event) => {
    if (statusFilter === "all") return true;
    // Si coincide con rawEstadoEntregable o rawEstadoXTema
    if (statusFilter === event.rawEstadoEntregable) return true;
    if (statusFilter === event.rawEstadoXTema) return true;
    return false;
  });

  const handleStatusFilterClick = () => {
    setShowStatusFilter(!showStatusFilter);
  };

  const openCriteriosModal = (criterios: Criterio[]) => {
    setSelectedCriterios(criterios);
    setIsCriteriosModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Avances y Entregas</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={timeFilter}
              onValueChange={(v) => setTimeFilter(v as TimeFilter)}
            >
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
                      {(
                        [
                          "all",
                          "no_enviado",
                          "enviado_a_tiempo",
                          "enviado_tarde",
                          "no_iniciado",
                          "en_proceso",
                          "terminado",
                        ] as StatusFilter[]
                      ).map((filter) => (
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
                          {filter === "no_enviado" && (
                            <span className="text-red-600">No Enviado</span>
                          )}
                          {filter === "enviado_a_tiempo" && (
                            <span className="text-green-600">Actual</span>
                          )}
                          {filter === "enviado_tarde" && (
                            <span className="text-red-600">Enviado Tarde</span>
                          )}
                          {filter === "no_iniciado" && (
                            <span className="text-gray-500">Pendiente</span>
                          )}
                          {filter === "en_proceso" && (
                            <span className="text-blue-600">En progreso</span>
                          )}
                          {filter === "terminado" && (
                            <span className="text-green-600">Completado</span>
                          )}
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
              filteredEvents.map((event, index) => {
                // ——— Mapear “estadoXTema” a texto y color:
                let textoXTema = "";
                let colorXTema = "";
                if (event.rawEstadoXTema === "no_enviado") {
                  textoXTema = "No Enviado";
                  colorXTema = "text-red-600";
                } else if (event.rawEstadoXTema === "enviado_a_tiempo") {
                  textoXTema = "Actual";
                  colorXTema = "text-green-600";
                } else if (event.rawEstadoXTema === "enviado_tarde") {
                  textoXTema = "Enviado Tarde";
                  colorXTema = "text-red-600";
                }

                // ——— Mapear “estadoEntregable” a texto y color:
                let textoEntregable = "";
                let colorEntregable = "";
                if (event.rawEstadoEntregable === "no_iniciado") {
                  textoEntregable = "Pendiente";
                  colorEntregable = "text-gray-500";
                } else if (event.rawEstadoEntregable === "en_proceso") {
                  textoEntregable = "En progreso";
                  colorEntregable = "text-blue-600";
                } else if (event.rawEstadoEntregable === "terminado") {
                  textoEntregable = "Completado";
                  colorEntregable = "text-green-600";
                }

                // ——— Determinar la clase del círculo según “estadoXTema” (para el punto en la línea)
                let circleClass = "bg-gray-300 border-gray-300";
                if (event.rawEstadoXTema === "no_enviado") {
                  circleClass = "bg-gray-300 border-gray-300";
                } else if (event.rawEstadoXTema === "enviado_a_tiempo") {
                  circleClass = "bg-green-500 border-green-500";
                } else if (event.rawEstadoXTema === "enviado_tarde") {
                  circleClass = "bg-red-500 border-red-500";
                }

                return (
                  <div key={index} className="relative">
                    {/* Punto del timeline */}
                    <div
                      className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border ${circleClass}`}
                    ></div>

                    <div>
                      <time className="mb-1 text-xs font-normal text-gray-500">
                        {event.date}
                      </time>
                      <h3 className="text-sm font-medium">
                        {event.event}

                        {/* —— Mostrar “estadoXTema” primero —— */}
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            colorXTema === "text-red-600"
                              ? "bg-red-100 text-red-800"
                              : colorXTema === "text-green-600"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }`}
                        >
                          {textoXTema}
                        </span>

                        {/* Etiqueta “En riesgo” */}
                        {event.isAtRisk && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                            En riesgo ({event.daysRemaining} días)
                          </span>
                        )}
                      </h3>

                      <p className={`text-xs flex items-center ${colorEntregable}`}>
                        {/* —— Mostrar “estadoEntregable” debajo —— */}
                        <span>{textoEntregable}</span>

                        {event.esEvaluable && (
                          <span className="ml-2 text-xs font-semibold text-gray-800">
                            — Nota: {event.nota ?? "-"}
                          </span>
                        )}

                        {/* Botón “Ver detalle” */}
                        <Button
                          variant="ghost"
                          className="ml-4 text-gray-800 hover:text-gray-900"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="ml-1 text-xs">Ver detalle</span>
                        </Button>

                        {/* Botón “Ver criterios” */}
                        <Button
                          variant="outline"
                          className="ml-2 text-gray-800 hover:bg-gray-100"
                          size="sm"
                          onClick={() => openCriteriosModal(event.criterios)}
                        >
                          <span className="text-xs">Ver criterios</span>
                        </Button>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay eventos que coincidan con los filtros seleccionados
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ——————— Modal de Criterios —————— */}
      <Dialog open={isCriteriosModalOpen} onOpenChange={setIsCriteriosModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Criterios del Entregable</DialogTitle>
            <DialogDescription>
              A continuación se muestran los criterios, la nota máxima, la descripción y la nota asignada.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
            {selectedCriterios.length > 0 ? (
              selectedCriterios.map((c) => (
                <div key={c.id} className="border rounded-md p-3 bg-white">
                  <p className="font-medium text-sm">{c.nombre}</p>
                  <p className="text-xs text-gray-600">Nota máxima: {c.notaMaxima}</p>
                  <p className="text-xs text-gray-500 mt-1">{c.descripcion}</p>
                  <p className="text-xs mt-1">
                    <span className="font-medium">Nota asignada: </span>
                    {c.nota != null ? c.nota : "Sin nota"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No hay criterios asignados.</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className="mt-4 w-full">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
