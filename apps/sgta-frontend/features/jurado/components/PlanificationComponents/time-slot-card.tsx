"use client";

import { Clock } from "lucide-react";
import {
  EstadoPlanificacion,
  SalaExposicion,
  Tema,
  TimeSlot,
} from "../../types/jurado.types";
import Droppable from "./Droppable";
import RoomSlot from "./room-slot";
import {
  bloquearBloquePorId,
  desbloquearBloquePorId,
} from "../../services/data";

export function TimeSlotCard({
  time,
  filteredRooms,
  assignedExpos,
  removeExpo,
  estadoPlan,
  actualizarBloque,
}: {
  time: string;
  spaces?: SalaExposicion[];
  filteredRooms: TimeSlot[];
  assignedExpos: Record<string, Tema>;
  removeExpo: (expo: Tema) => void;
  estadoPlan: EstadoPlanificacion;
  actualizarBloque: (idBloque: number, datos: Partial<TimeSlot>) => void;
}) {
  const numberOfAvailableRooms =
    filteredRooms?.reduce(
      (acc, room) => acc + (!room.expo?.id && !room.esBloqueBloqueado ? 1 : 0),
      0,
    ) ?? 0;

  const bloquearBloque = async (bloque: TimeSlot) => {
    if (
      (bloque.expo == null || bloque.expo.id == null) &&
      !bloque.esBloqueBloqueado &&
      estadoPlan.nombre !== "Cierre de planificacion"
    ) {
      const ok = await bloquearBloquePorId(bloque.idBloque);
      if (ok) {
        actualizarBloque(bloque.idBloque, {
          esBloqueBloqueado: true,
        });
      }
    }
  };

  const desbloquearBloque = async (bloque: TimeSlot) => {
    if (
      (bloque.expo == null || bloque.expo.id == null) &&
      bloque.esBloqueBloqueado &&
      estadoPlan.nombre !== "Cierre de planificacion"
    ) {
      const ok = await desbloquearBloquePorId(bloque.idBloque);
      if (ok) {
        actualizarBloque(bloque.idBloque, {
          esBloqueBloqueado: false,
        });
      }
    }
  };

  return (
    <div className="border rounded-lg p-3 select-none flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="font-bold text-lg">{time} hrs</span>
        </div>
        <span className="text-gray-500">
          {numberOfAvailableRooms} disponibles
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {filteredRooms?.map((room) =>
          room.esBloqueBloqueado ? (
            <div key={room.key}>
              <RoomSlot
                code={room.key}
                assignedExpos={assignedExpos}
                room={room}
                removeExpo={removeExpo}
                estadoPlanificacion={estadoPlan}
                onContextMenu={() => desbloquearBloque(room)}
              />
            </div>
          ) : (
            <Droppable key={room.key} id={room.key}>
              <RoomSlot
                code={room.key}
                assignedExpos={assignedExpos}
                room={room}
                removeExpo={removeExpo}
                estadoPlanificacion={estadoPlan}
                onContextMenu={() => bloquearBloque(room)}
              />
            </Droppable>
          ),
        )}
      </div>
    </div>
  );
}
