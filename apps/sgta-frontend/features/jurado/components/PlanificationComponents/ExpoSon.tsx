import { EstadoPlanificacion, Tema } from "@/features/jurado/types/jurado.types";

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

  const colorBg = estadoPlan.nombre === "Cierre de planificacion"? "#B0EBD8" : "#FFDFBD";
    
  //B0EBD8
  return (
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
  );
};

export default ExpoSon;

