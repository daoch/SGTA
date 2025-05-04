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
}

export const PeriodoSelect: React.FC<PeriodoSelectProps> = ({
  periodo,
  setPeriodo,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="periodo">Periodo</Label>
      <Select value={periodo} onValueChange={setPeriodo}>
        <SelectTrigger id="periodo" className="w-[200px]">
          <SelectValue placeholder="Selecciona un periodo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025-1">2025-1</SelectItem>
          <SelectItem value="2025-2">2025-2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
