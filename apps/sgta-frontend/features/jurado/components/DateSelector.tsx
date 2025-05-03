import { Dispo } from "@/features/jurado/types/jurado.types"

interface Props {
  room : Dispo;
  isSelected: boolean;
  onSelect: () => void;
}  

const SelectorFecha: React.FC<Props> = ({ room,isSelected,onSelect }) => {
  const day = room.date.toLocaleDateString("es-ES", { weekday: "long" });
  const dateNumber = room.date.getDate();
  const availableBlocks = room.spaces.length;

    return(
       <div 
          onClick={onSelect}
          className={`rounded-lg p-4 text-center w-48 cursor-pointer transition-all duration-200 border-gray-300
          ${isSelected ? "bg-blue-100 text-black" : "bg-white"}`}
        >        
          <div className="font-medium">{day}</div>
          <div className="text-4xl font-bold">{dateNumber}</div>
          <div className="flex items-center justify-center mt-2 text-sm">
            <div
              className={`w-3 h-3 rounded-full mr-2
              ${isSelected ? "bg-green-300" : "bg-yellow-500"}`}
              >
            </div>
            <span>{availableBlocks} bloques disponibles</span>
          </div>
        </div>
    );

}

export default SelectorFecha;