import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Curso {
  nombre?: string;
  descripcion?: string;
  objetivos?: string;
}

export function CursoForm({ curso = null }: { curso?: Curso | null }) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{curso ? "Editar Curso" : "Nuevo Curso"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Curso</Label>
          <Input id="nombre" placeholder="Ej: Proyecto de Fin de Carrera 1" defaultValue={curso?.nombre || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            placeholder="Descripción general del curso"
            rows={3}
            defaultValue={curso?.descripcion || ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="objetivos">Objetivos</Label>
          <Textarea id="objetivos" placeholder="Objetivos del curso" rows={4} defaultValue={curso?.objetivos || ""} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button>{curso ? "Guardar Cambios" : "Crear Curso"}</Button>
      </CardFooter>
    </Card>
  );
}
