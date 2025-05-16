"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

import { JornadaExposicionDTO } from "@/features/jurado/dtos/JornadExposicionDTO";
import {
  EstadoPlanificacion,
  OrigenBoton,
  Tema,
  TimeSlot,
} from "@/features/jurado/types/jurado.types";
import SelectorFecha from "./selector-fecha";
import PlanificacionEstadoStepper from "./planificacion-estado-stepper";
import { TimeSlotCard } from "./time-slot-card";

// id 3
interface Props {
  roomAvailList: JornadaExposicionDTO[];
  assignedExpos: Record<string, Tema>;
  removeExpo: (expo: Tema) => void;

  onAvanzarPlanificacionClick: (origen: OrigenBoton) => void;
  bloquesList: TimeSlot[];
  estadoPlan: EstadoPlanificacion;
}
const PlanificationPanel: React.FC<Props> = ({
  roomAvailList,
  assignedExpos,
  removeExpo,
  onAvanzarPlanificacionClick,
  bloquesList,
  estadoPlan,
}) => {
  //BLOQUES
  const [selectedCode, setSelectedCode] = useState<number>(
    roomAvailList[0]?.code ?? 0,
  );

  //FILTRO
  const selectedRoom = roomAvailList.find((room) => room.code === selectedCode);

  //const selectedDateStr = selectedRoom?.fecha.toISOString().split("T")[0];
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

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <PlanificacionEstadoStepper estadoPlan={estadoPlan} />
        <div>
          {estadoPlan.nombre != "Fase 2" &&
            estadoPlan.nombre != "Cierre de planificacion" && (
              <Button onClick={() => onAvanzarPlanificacionClick("siguiente")}>
                Siguiente fase
                <ArrowRight />
              </Button>
            )}

          {estadoPlan.nombre !== "Planificacion inicial" &&
            estadoPlan.nombre !== "Cierre de planificacion" && (
              <Button
                onClick={() => onAvanzarPlanificacionClick("terminar")}
                className="w-full xl:w-auto ml-2"
                style={{ background: "#042354" }}
              >
                Terminar Planificacion
              </Button>
            )}
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {roomAvailList.map((room) => (
          <SelectorFecha
            key={room.code}
            room={room}
            isSelected={room.code === selectedCode}
            onSelect={() => setSelectedCode(room.code)}
          />
        ))}
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
          />
        ))}
      </div>
    </div>
  );
};

export default PlanificationPanel;
