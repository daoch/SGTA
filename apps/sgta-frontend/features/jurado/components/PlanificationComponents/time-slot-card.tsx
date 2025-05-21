"use client";

import { Clock } from "lucide-react";
import {
  EstadoPlanificacion,
  SalaExposicion,
  Tema,
  TimeSlot,
} from "../../types/jurado.types";
import Droppable from "./Droppable";
import RoomSlot from "./RoomSlot";

export function TimeSlotCard({
  time,
  filteredRooms,
  assignedExpos,
  removeExpo,
  estadoPlan,
}: {
  time: string;
  spaces?: SalaExposicion[];
  filteredRooms: TimeSlot[];
  assignedExpos: Record<string, Tema>;
  removeExpo: (expo: Tema) => void;
  estadoPlan: EstadoPlanificacion;
}) {
  return (
    <div className="border rounded-lg p-3 select-none flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="font-bold text-lg">{time} hrs</span>
        </div>
        <span className="text-gray-500">3 disponibles</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {filteredRooms?.map((room) => (
          <Droppable key={room.key} id={room.key}>
            <RoomSlot
              code={room.key}
              assignedExpos={assignedExpos}
              room={room}
              removeExpo={removeExpo}
              estadoPlanificacion={estadoPlan}
            />
          </Droppable>
        ))}
      </div>
    </div>
  );
}
