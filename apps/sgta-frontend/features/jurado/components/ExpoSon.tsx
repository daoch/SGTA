import { Tema } from "@/features/jurado/types/jurado.types";

interface Props {
  expoFind: Tema;
  removeExpo: (expo: Tema) => void;
}

const ExpoSon: React.FC<Props> = ({ expoFind, removeExpo }: Props) => {
  const handleClick = () => {
    if (expoFind) {
      removeExpo(expoFind);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFDFBD",
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

