"use client";

import {
  EstadoPlanificacion,
  Tema,
} from "@/features/jurado/types/jurado.types";
import { useIsDragging } from "./DragContext";

interface Props {
  expoFind: Tema;
  removeExpo: (expo: Tema) => void;
  estadoPlan: EstadoPlanificacion;
}

const ExpoSon: React.FC<Props> = ({
  expoFind,
  removeExpo,
  estadoPlan,
}: Props) => {
  const handleClick = () => {
    if (expoFind) {
      removeExpo(expoFind);
    }
  };
  const isDragging = useIsDragging();

  return (
    <div
      className={`relative group z-10 cursor-grab ${isDragging && "cursor-grabbing"}`}
    >
      <div
        className={`h-[60px] flex justify-center items-center ${
          estadoPlan.nombre === "Cierre de planificacion"
            ? "bg-[#B0EBD8]"
            : "bg-[#FFDFBD]"
        }`}
        onClick={handleClick}
      >
        <span className="text-lg">{expoFind.codigo}</span>
      </div>
    </div>
  );
};

export default ExpoSon;
