import { JornadaExposicionDTO } from "@/features/jurado/dtos/JornadExposicionDTO";

interface Props {
  room: JornadaExposicionDTO;
  isSelected: boolean;
  onSelect: () => void;
}

const SelectorFecha: React.FC<Props> = ({ room, isSelected, onSelect }) => {
  const day = room.fecha?.toLocaleDateString("es-ES", { weekday: "long" });
  const dateNumber = room.fecha?.getDate();
  const month = room.fecha?.toLocaleDateString("es-ES", { month: "long" });
  const availableBlocks = room.salasExposicion.length;

  return (
    <div
      onClick={onSelect}
      className={`border select-none rounded-lg p-4 text-center w-41 cursor-pointer transition-all duration-100 border-gray-300
          ${isSelected ? "bg-blue-100 text-black" : "bg-white"}`}
    >
      <div className="font-medium">{day.toUpperCase()}</div>
      <div className="text-4xl font-bold">
        {dateNumber}
        <span className="text-xs">/{month}</span>
      </div>
      <div className="flex items-center justify-start text-sm gap-2 px-3">
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
        <span>{availableBlocks} disponibles</span>
      </div>
      <div className="flex items-center justify-start text-sm gap-2 px-3">
        <div className="w-2 h-2 rounded-full bg-red-400"></div>
        <span>{availableBlocks} bloqueados</span>
      </div>
    </div>
  );
};

export default SelectorFecha;
