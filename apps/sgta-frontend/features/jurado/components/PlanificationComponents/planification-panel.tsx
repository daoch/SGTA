"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import React, { useState } from "react";

import { JornadaExposicionDTO } from "@/features/jurado/dtos/JornadExposicionDTO";
import {
  EstadoPlanificacion,
  TipoAccion,
  Tema,
  TimeSlot,
} from "@/features/jurado/types/jurado.types";
import SelectorFecha from "./selector-fecha";
import PlanificacionEstadoStepper from "./planificacion-estado-stepper";
import { TimeSlotCard } from "./time-slot-card";
import AppLoading from "@/components/loading/app-loading";
import { usePlanificationStore } from "../../store/use-planificacion-store";
import { descargarExcelByExposicionId } from "../../services/planificacion-service";
import { toast } from "sonner";
import ButtonAlertDialog from "../button-alert-dialog";

interface Props {
  days: JornadaExposicionDTO[];
  assignedExpos: Record<string, Tema>;
  removeExpo: (expo: Tema) => void;
  onAvanzarPlanificacionClick: (origen: TipoAccion) => void;
  bloquesList: TimeSlot[];
  estadoPlan: EstadoPlanificacion | undefined;
  isLoading?: boolean;
  exposicionId: number;
}

const PlanificationPanel: React.FC<Props> = ({
  days,
  assignedExpos,
  removeExpo,
  onAvanzarPlanificacionClick,
  bloquesList,
  estadoPlan,
  isLoading,
  exposicionId,
}) => {
  const { actualizarBloque, temasSinAsignar } = usePlanificationStore();

  //BLOQUES
  const [selectedCode, setSelectedCode] = useState<number>(days[0]?.code ?? 0);

  //FILTRO
  const selectedRoom = days.find((room) => room.code === selectedCode);
  const selectedDate = selectedRoom?.fecha;
  const selectedDateStr = selectedDate
    ? `${selectedDate.getDate().toString().padStart(2, "0")}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getFullYear()}`
    : "";

  //BLOQUESSS
  const filteredTimeSlots = bloquesList.filter((slot) =>
    slot.key.startsWith(selectedDateStr + "|"),
  );

  const uniqueTimeSlots = Array.from(
    new Map(filteredTimeSlots.map((slot) => [slot.range, slot])).values(),
  );

  if (estadoPlan === undefined) return <AppLoading />;

  return (
    <div
      className="h-full w-full flex flex-col gap-3"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex flex-row justify-between items-center">
        <PlanificacionEstadoStepper estadoPlan={estadoPlan} />

        {/* Botones */}
        <div className="flex flex-row gap-2">
          {estadoPlan.nombre != "Fase 2" &&
            estadoPlan.nombre != "Cierre de planificacion" && (
              <Button
                onClick={() => onAvanzarPlanificacionClick("siguiente")}
                variant={
                  estadoPlan.nombre == "Planificacion inicial"
                    ? "default"
                    : "outline"
                }
                disabled={isLoading || temasSinAsignar.length > 0}
              >
                Siguiente fase
                <ArrowRight />
              </Button>
            )}

          {estadoPlan.nombre !== "Planificacion inicial" &&
            estadoPlan.nombre !== "Cierre de planificacion" && (
              // <Button
              //   onClick={() => onAvanzarPlanificacionClick("terminar")}
              //   disabled={isLoading}
              // >
              //   Terminar Planificacion
              // </Button>
              <ButtonAlertDialog
                message="¿Estás seguro de que deseas terminar la planificación? Esta acción no se puede deshacer."
                trigger={
                  <Button className="w-fit" disabled={isLoading}>
                    {/* <FolderSync /> */}
                    Terminar Planificación
                  </Button>
                }
                onConfirm={() => onAvanzarPlanificacionClick("terminar")}
              />
            )}
          {estadoPlan.nombre === "Cierre de planificacion" && (
            <Button
              onClick={async () => {
                try {
                  await descargarExcelByExposicionId(exposicionId);
                  toast.success("Archivo descargado correctamente.");
                } catch (error) {
                  toast.error("Error al descargar el archivo.");
                  console.error("No se pudo descargar el archivo:", error);
                }
              }}
            >
              <FileSpreadsheet />
              Exportar Planificacion
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <AppLoading />
      ) : (
        <>
          <div className="w-full flex flex-row gap-4 overflow-x-scroll">
            {days.map((day) => {
              // Formatea la fecha para comparar con el inicio del key de cada bloque
              const dateStr = `${day.fecha.getDate().toString().padStart(2, "0")}-${(day.fecha.getMonth() + 1).toString().padStart(2, "0")}-${day.fecha.getFullYear()}`;
              // Filtra los bloques de ese día
              const bloquesDelDia = bloquesList.filter((bloque) =>
                bloque.key.startsWith(dateStr + "|"),
              );

              const assignedBlocks = bloquesDelDia.filter(
                (bloque) => bloque.expo != null && bloque.expo.id != null,
              ).length;

              // Calcula los bloques asignados (bloquedBlocks)
              const bloquedBlocks = bloquesDelDia.filter(
                (bloque) => bloque.esBloqueBloqueado,
              ).length;

              // Los disponibles son el total menos los asignados
              const availableBlocks =
                bloquesDelDia.filter((bloque) => !bloque.esBloqueBloqueado)
                  .length - assignedBlocks;

              return (
                <SelectorFecha
                  key={day.code}
                  day={day}
                  assignedBlocks={assignedBlocks}
                  availableBlocks={availableBlocks}
                  bloquedBlocks={bloquedBlocks}
                  isSelected={day.code === selectedCode}
                  onSelect={() => setSelectedCode(day.code)}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniqueTimeSlots.map((timeSlot) => (
              <TimeSlotCard
                key={timeSlot.key}
                time={timeSlot.range}
                filteredRooms={filteredTimeSlots.filter(
                  (e) => e.range === timeSlot.range,
                )}
                assignedExpos={assignedExpos}
                removeExpo={removeExpo}
                estadoPlan={estadoPlan}
                actualizarBloque={actualizarBloque}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlanificationPanel;
