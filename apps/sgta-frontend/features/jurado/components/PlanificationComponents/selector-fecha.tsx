import { JornadaExposicionDTO } from "@/features/jurado/dtos/JornadExposicionDTO";

interface Props {
  day: JornadaExposicionDTO;
  assignedBlocks: number;
  availableBlocks: number;
  bloquedBlocks: number;
  isSelected: boolean;
  onSelect: () => void;
}

const SelectorFecha: React.FC<Props> = ({
  day,
  isSelected,
  onSelect,
  assignedBlocks,
  availableBlocks,
  bloquedBlocks,
}) => {
  const dayNumber = day.fecha?.toLocaleDateString("es-ES", {
    weekday: "long",
  });
  const dateNumber = day.fecha?.getDate().toString().padStart(2, "0");
  const month = day.fecha?.toLocaleDateString("es-ES", { month: "long" });

  return (
    <div
      onClick={onSelect}
      className={`border select-none rounded-lg p-4 text-center min-w-43 max-w-43 cursor-pointer transition-all duration-100 border-gray-300
          ${isSelected ? "bg-blue-100 text-black" : "bg-white"}`}
    >
      <div className="font-medium">{dayNumber.toUpperCase()}</div>
      <div className="text-4xl font-bold">
        {dateNumber}
        <span className="text-xs">/{month}</span>
      </div>
      <div className="flex items-center justify-start text-sm gap-2 px-3">
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
        <span>{availableBlocks} disponibles</span>
      </div>
      <div className="flex items-center justify-start text-sm gap-2 px-3">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
        <span>{assignedBlocks} asignados</span>
      </div>
      <div className="flex items-center justify-start text-sm gap-2 px-3">
        <div className="w-2 h-2 rounded-full bg-red-400"></div>
        <span>{bloquedBlocks} bloqueados</span>
      </div>
    </div>
  );
};

export default SelectorFecha;
