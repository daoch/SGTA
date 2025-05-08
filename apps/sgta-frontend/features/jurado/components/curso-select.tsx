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
  cursos: { id: number; nombre: string }[];
}

export const CursoSelect: React.FC<CursoSelectProps> = ({
  curso,
  setCurso,
  cursos,
}) => {
  const handleChange = (value: string) => {
    setCurso(value); // actualiza el estado con el ID
    console.log("ID del curso seleccionado:", value);
  };
  return (
    <div className="flex flex-col space-y-1">
      <Label htmlFor="curso">Curso</Label>
      <Select value={curso} onValueChange={handleChange}>
        <SelectTrigger id="curso" className="w-[250px]">
          <SelectValue placeholder="Selecciona un curso" />
        </SelectTrigger>
        <SelectContent>
          {cursos.map((curso) => (
            <SelectItem key={curso.id} value={String(curso.id)}>
              {curso.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

