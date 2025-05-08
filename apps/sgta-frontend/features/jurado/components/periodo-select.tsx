import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodoSelectProps {
  periodo: string;
  setPeriodo: (value: string) => void;
  ciclos: { id: number; semestre: string; anio: number }[];
}

export const PeriodoSelect: React.FC<PeriodoSelectProps> = ({
  periodo,
  setPeriodo,
  ciclos,
}) => {
  const handleChange = (value: string) => {
    setPeriodo(value); // actualiza el estado con el ID
    console.log("ID del ciclo seleccionado:", value);
  };
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="periodo">Periodo</Label>
      <Select value={periodo} onValueChange={handleChange}>
        <SelectTrigger id="periodo" className="w-[120px]">
          <SelectValue placeholder="Selecciona un periodo" />
        </SelectTrigger>
        <SelectContent>
          {ciclos.map((ciclo) => (
            <SelectItem key={ciclo.id} value={String(ciclo.id)}>
              {ciclo.anio} - {ciclo.semestre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

