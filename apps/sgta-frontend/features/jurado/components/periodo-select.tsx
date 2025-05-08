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
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="periodo">Periodo</Label>
      <Select value={periodo} onValueChange={setPeriodo}>
        <SelectTrigger id="periodo" className="w-[200px]">
          <SelectValue placeholder="Selecciona un periodo" />
        </SelectTrigger>
        <SelectContent>
          {ciclos.map((ciclo) => (
            <SelectItem
              key={ciclo.id}
              value={`${ciclo.anio}-${ciclo.semestre}`}
            >
              {ciclo.anio} - {ciclo.semestre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

