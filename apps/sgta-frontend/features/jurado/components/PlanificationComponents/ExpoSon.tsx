import { EstadoPlanificacion, Tema } from "@/features/jurado/types/jurado.types";
import { useState } from "react";
import { useIsDragging } from "./DragContext";
import ToolTipoBloque from "./ToolTipoBloque";

interface Props {
  expoFind: Tema;
  removeExpo: (expo: Tema) => void;
  estadoPlan : EstadoPlanificacion
}

const ExpoSon: React.FC<Props> = ({ expoFind, removeExpo,estadoPlan }: Props) => {
  const handleClick = () => {
    if (expoFind) {
      removeExpo(expoFind);
    }
  };
  const [hovered, setHovered] = useState(false);
  const isDragging = useIsDragging();


  const colorBg = estadoPlan.nombre === "Cierre de planificacion"? "#B0EBD8" : "#FFDFBD";
  
  
  //B0EBD8
  return (
    <div      
      className="relative group z-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
        
      <div 
        style={{
          
          backgroundColor: colorBg,
          height: "60px",
          border: "0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        
          }}
        onClick={handleClick}
      >
        {expoFind.codigo}
      </div>

      {hovered && expoFind && !isDragging && (
        <div 
        className="block text-left absolute top-full mb-2 transform -translate-x-1/2 z-[999]"
        style={{
          top: 0, // asegurarte que no se solape verticalmente
        }}
        >
          <ToolTipoBloque expoFind = {expoFind}/>
        </div>
      )}
    </div>
   
  );
};

export default ExpoSon;

