import { Tema } from "@/features/jurado/types/jurado.types";
import Draggable from "./Draggable";
import ExpoSon from "./ExpoSon";

interface TimeSlot {
  key: string;
  range: string;
  expo?: Tema;
}

interface Props {
  code: string;
  assignedExpos: Record<string, Tema>;
  room: TimeSlot;
  removeExpo: (expo: Tema) => void;
}

const RoomSlot: React.FC<Props> = ({
  code,
  assignedExpos,
  room,
  removeExpo,
}: Props) => {
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
        <Draggable id={expoFind.codigo} key={expoFind.codigo}>
          <ExpoSon expoFind={expoFind} removeExpo={removeExpo} />
        </Draggable>
      ) : (
        room?.key.split("|")[2]
      )}
    </div>
  );
};

export default RoomSlot;
