import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Contenido {
  nombre?: string;
  descripcion?: string;
  peso?: number;
}

export function ContenidoForm({
  contenido = null,
  tipo = "entregable",
  conPeso = false,
}: {
  contenido?: Contenido | null;
  tipo?: "entregable" | "exposicion";
  conPeso?: boolean;
}) {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {contenido
            ? `Editar Contenido de ${tipo === "entregable" ? "Entregable" : "Exposición"}`
            : `Nuevo Contenido de ${tipo === "entregable" ? "Entregable" : "Exposición"}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Contenido</Label>
          <Input id="nombre" placeholder="Ej: Introducción" defaultValue={contenido?.nombre || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción Detallada</Label>
          <Textarea
            id="descripcion"
            placeholder="Descripción detallada del contenido esperado"
            rows={4}
            defaultValue={contenido?.descripcion || ""}
          />
        </div>

        {conPeso && (
          <div className="space-y-2">
            <Label htmlFor="peso">Peso en la Calificación (puntos)</Label>
            <Input id="peso" type="number" min="0" max="20" placeholder="Ej: 5" defaultValue={contenido?.peso || ""} />
            <p className="text-xs text-gray-500">El total de puntos entre todos los contenidos debe sumar 20.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button>{contenido ? "Guardar Cambios" : "Crear Contenido"}</Button>
      </CardFooter>
    </Card>
  );
}
