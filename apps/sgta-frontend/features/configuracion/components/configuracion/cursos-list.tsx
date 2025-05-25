import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const cursos = [
  {
    id: 1,
    nombre: "Proyecto de Fin de Carrera 1",
    descripcion:
      "Primera fase del proyecto de fin de carrera enfocada en la definición del problema y la propuesta de solución.",
    objetivos: "Definir el problema, realizar el estado del arte, proponer una solución preliminar.",
    entregables: 3,
    exposiciones: 2,
  },
  {
    id: 2,
    nombre: "Proyecto de Fin de Carrera 2",
    descripcion:
      "Segunda fase del proyecto de fin de carrera enfocada en el desarrollo e implementación de la solución.",
    objetivos: "Implementar la solución propuesta, validar resultados, documentar el proyecto.",
    entregables: 2,
    exposiciones: 2,
  },
];

export function CursosList() {
  return (
    <div className="space-y-4">
      {cursos.map((curso) => (
        <Card key={curso.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{curso.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-4">{curso.descripcion}</p>

                  <div className="text-sm">
                    <strong>Objetivos:</strong> {curso.objetivos}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t flex items-center justify-between">
              <div className="flex gap-6">
                <div className="text-sm">
                  <span className="text-gray-500">Entregables:</span> {curso.entregables}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Exposiciones:</span> {curso.exposiciones}
                </div>
              </div>

              <Link href={`/coordinador/configuracion/general/cursos/${curso.id}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <span>Ver detalles</span>
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
