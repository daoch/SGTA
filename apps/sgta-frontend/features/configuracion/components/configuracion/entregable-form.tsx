import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Datos de ejemplo
const cursos = [
  { id: 1, nombre: "Proyecto de Fin de Carrera 1" },
  { id: 2, nombre: "Proyecto de Fin de Carrera 2" },
];

interface Entregable {
  nombre?: string;
  curso_id?: number;
  plazo?: string;
  descripcion?: string;
}

export function EntregableForm({ entregable = null }: { entregable?: Entregable | null }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{entregable ? "Editar Entregable" : "Nuevo Entregable"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Entregable</Label>
          <Input id="nombre" placeholder="Ej: Propuesta de Proyecto" defaultValue={entregable?.nombre || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="curso">Curso</Label>
          <Select defaultValue={entregable?.curso_id?.toString() || ""}>
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
          <Label htmlFor="plazo">Plazo de Entrega</Label>
          <Input id="plazo" placeholder="Ej: Semana 4" defaultValue={entregable?.plazo || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            placeholder="Descripción general del entregable"
            rows={3}
            defaultValue={entregable?.descripcion || ""}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button>{entregable ? "Guardar Cambios" : "Crear Entregable"}</Button>
      </CardFooter>
    </Card>
  );
}
