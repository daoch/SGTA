"use client";

import {
  EstadoPlanificacion,
  Tema,
  TimeSlot,
} from "@/features/jurado/types/jurado.types";
import Draggable from "./Draggable";
import ExpoSon from "./expo-son";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolTipoBloque from "./tooltip-bloque";

interface Props {
  code: string;
  assignedExpos: Record<string, Tema>;
  room: TimeSlot;
  removeExpo: (expo: Tema) => void;
  estadoPlanificacion: EstadoPlanificacion;
  onContextMenu?: (e: React.MouseEvent, room: TimeSlot, expo?: Tema) => void;
}

const RoomSlot: React.FC<Props> = ({
  code,
  assignedExpos,
  room,
  removeExpo,
  estadoPlanificacion,
  onContextMenu,
}: Props) => {
  const isBloqueBloqueado = room.esBloqueBloqueado;
  const isDraggeable =
    estadoPlanificacion.nombre === "Cierre de planificacion" ? false : true;
  const expoFind =
    room.key in assignedExpos ? assignedExpos[room.key] : undefined;

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onContextMenu) {
      await onContextMenu(e, room, expoFind);
    }
  };

  return (
    <div
      key={code}
      className={`
        border-2 border-dashed border-[#868A8F] 
        bg-gray-100
        text-black
        h-[63px]
        text-center 
        rounded-lg 
        transition-all duration-300
        ${!expoFind ? "flex justify-center items-center" : ""} 
        ${isBloqueBloqueado ? "bg-red-400 border-red-700" : ""}
      `}
      onContextMenu={handleContextMenu}
    >
      {expoFind ? (
        <Draggable
          id={expoFind.codigo}
          key={expoFind.codigo}
          isDraggeable={isDraggeable}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <ExpoSon
                  expoFind={expoFind}
                  removeExpo={removeExpo}
                  estadoPlan={estadoPlanificacion}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <ToolTipoBloque expoFind={expoFind} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Draggable>
      ) : (
        <div>
          {isBloqueBloqueado && (
            <>
              <span className="text-lg">Bloqueado</span>
              <br />
            </>
          )}
          <span className={`${isBloqueBloqueado ? "text-sm" : "text-lg "}`}>
            {room?.key.split("|")[2]}
          </span>
        </div>
      )}
    </div>
  );
};

export default RoomSlot;
