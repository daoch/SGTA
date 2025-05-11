"use client";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import React, { useState } from "react";

import { JornadaExposicionDTO } from "@/features/jurado/dtos/JornadExposicionDTO";
import { SalaExposicion, Tema, TimeSlot } from "@/features/jurado/types/jurado.types";
import BreadCrumbPlanificacion from "./BreadcrumbPlanification";
import SelectorFecha from "./DateSelector";
import Droppable from "./Droppable";
import RoomSlot from "./RoomSlot";


interface Props {
  roomAvailList: JornadaExposicionDTO[];
  assignedExpos: Record<string, Tema>;
  removeExpo: (expo: Tema) => void;
  onSiguienteFaseClick: () => void;
  bloquesList: TimeSlot[];
}
const PlanificationPanel: React.FC<Props> = ({
  roomAvailList,
  assignedExpos,
  removeExpo,
  onSiguienteFaseClick,
  bloquesList,
}) => {
  const expoDuration = 20;
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
    <section className="h-full w-full flex flex-col gap-6">
      <BreadCrumbPlanificacion></BreadCrumbPlanificacion>
      <div className="flex flex-row gap-4">
        {roomAvailList.map((room) => (
          <SelectorFecha
            key={room.code}
            room={room}
            isSelected={room.code === selectedCode}
            onSelect={() => setSelectedCode(room.code)}
          ></SelectorFecha>
        ))}

        <div className="ml-auto">
          <Button
            onClick={() => onSiguienteFaseClick()}
            className="w-full xl:w-auto"
            style={{ background: "#042354" }}
          >
            Siguiente fase
          </Button>
        </div>
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
          />
        ))}
      </div>
    </section>
  );
};

function TimeSlotCard({
  time,
  filteredRooms,
  assignedExpos,
  removeExpo,
}: {
  time: string;
  spaces?: SalaExposicion[];
  filteredRooms: TimeSlot[];
  assignedExpos: Record<string, Tema>;
  removeExpo: (expo: Tema) => void;
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-gray-500 mr-2" />
        <span className="font-bold text-lg">{time} hrs</span>
        <span className="ml-auto text-gray-500">3 disponibles</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {filteredRooms?.map((room) => (
          <Droppable key={room.key} id={room.key}>
            <RoomSlot
              code={room.key}
              assignedExpos={assignedExpos}
              room={room}
              removeExpo={removeExpo}
            />
          </Droppable>
        ))}
      </div>
    </div>
  );
}

export default PlanificationPanel;
