"use client";

import {
  EstadoPlanificacion,
  Tema,
  TimeSlot,
} from "@/features/jurado/types/jurado.types";
import Draggable from "./Draggable";
import ExpoSon from "./ExpoSon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolTipoBloque from "./ToolTipoBloque";

interface Props {
  code: string;
  assignedExpos: Record<string, Tema>;
  room: TimeSlot;
  removeExpo: (expo: Tema) => void;
  estadoPlanificacion: EstadoPlanificacion;
}

const RoomSlot: React.FC<Props> = ({
  code,
  assignedExpos,
  room,
  removeExpo,
  estadoPlanificacion,
}: Props) => {
  const isDraggeable =
    estadoPlanificacion.nombre === "Cierre de planificacion" ? false : true;
  const expoFind =
    room.key in assignedExpos ? assignedExpos[room.key] : undefined;

  const baseStyle: React.CSSProperties = {
    border: "2px dashed #868A8F",
    backgroundColor: "#F4F5F6",
    color: "#4F5254",
    height: "63px",
    textAlign: "center",
    borderRadius: "8px",
    transition: "all 0.3s",
  };

  const centeredStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div
      key={code}
      style={{
        ...baseStyle,
        ...(expoFind ? {} : centeredStyle),
      }}
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
        <span className="text-lg">{room?.key.split("|")[2]}</span>
      )}
    </div>
  );
};

export default RoomSlot;
