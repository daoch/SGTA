import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Datos de ejemplo
const cursos = [
  { id: 1, nombre: "Proyecto de Fin de Carrera 1" },
  { id: 2, nombre: "Proyecto de Fin de Carrera 2" },
];

interface Exposicion {
  nombre?: string;
  curso_id?: number;
  fechas?: string;
  descripcion?: string;
  presencial?: boolean;
  conJurados?: boolean;
}

export function ExposicionForm({
  exposicion = null,
}: {
  exposicion?: Exposicion | null;
}) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {exposicion ? "Editar Exposición" : "Nueva Exposición"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre de la Exposición</Label>
          <Input
            id="nombre"
            placeholder="Ej: Exposición de Avance 1"
            defaultValue={exposicion?.nombre || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="curso">Curso</Label>
          <Select defaultValue={exposicion?.curso_id?.toString() || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar curso" />
            </SelectTrigger>
            <SelectContent>
              {cursos.map((curso) => (
                <SelectItem key={curso.id} value={curso.id.toString()}>
                  {curso.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechas">Rango de Fechas</Label>
          <Input
            id="fechas"
            placeholder="Ej: Semana 6-7"
            defaultValue={exposicion?.fechas || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            placeholder="Descripción general de la exposición"
            rows={3}
            defaultValue={exposicion?.descripcion || ""}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="presencial" className="cursor-pointer">
            Exposición Presencial
          </Label>
          <Switch
            id="presencial"
            defaultChecked={exposicion?.presencial || false}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="jurados" className="cursor-pointer">
            Con Jurados
          </Label>
          <Switch
            id="jurados"
            defaultChecked={exposicion?.conJurados || false}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button>{exposicion ? "Guardar Cambios" : "Crear Exposición"}</Button>
      </CardFooter>
    </Card>
  );
}
