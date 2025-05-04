// src/components/curso-select.tsx o src/features/exposiciones/components/curso-select.tsx

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CursoSelectProps {
  curso: string;
  setCurso: (value: string) => void;
}

export const CursoSelect: React.FC<CursoSelectProps> = ({
  curso,
  setCurso,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="curso">Curso</Label>
      <Select value={curso} onValueChange={setCurso}>
        <SelectTrigger id="curso" className="w-[200px]">
          <SelectValue placeholder="Selecciona un curso" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos</SelectItem>
          <SelectItem value="Curso1">Curso 1</SelectItem>
          <SelectItem value="Curso2">Curso 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
