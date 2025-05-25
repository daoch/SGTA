import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EstadoSelectProps {
  estado: string;
  setEstado: (value: string) => void;
}

export const EstadoSelect: React.FC<EstadoSelectProps> = ({
  estado,
  setEstado,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="estado">Estado</Label>
      <Select value={estado} onValueChange={setEstado}>
        <SelectTrigger id="estado" className="w-[200px]">
          <SelectValue placeholder="Selecciona un estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Programada">Pendiente</SelectItem>
          <SelectItem value="Completada">Completada</SelectItem>
          <SelectItem value="Calificada">Calificada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
