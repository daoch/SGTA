import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Edit, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const entregables = [
  {
    id: 1,
    nombre: "Propuesta de Proyecto",
    curso: "Proyecto de Fin de Carrera 1",
    plazo: "Semana 4",
    descripcion: "Documento que describe el problema a resolver y la propuesta de solución.",
    contenidos: 5,
  },
  {
    id: 2,
    nombre: "Estado del Arte",
    curso: "Proyecto de Fin de Carrera 1",
    plazo: "Semana 8",
    descripcion: "Documento que presenta la revisión de literatura y soluciones existentes.",
    contenidos: 3,
  },
  {
    id: 3,
    nombre: "Informe Final",
    curso: "Proyecto de Fin de Carrera 1",
    plazo: "Semana 16",
    descripcion: "Documento final que integra todos los componentes del proyecto.",
    contenidos: 7,
  },
  {
    id: 4,
    nombre: "Implementación",
    curso: "Proyecto de Fin de Carrera 2",
    plazo: "Semana 10",
    descripcion: "Entrega del código y documentación de la implementación.",
    contenidos: 4,
  },
];

export function EntregablesList() {
  return (
    <div className="space-y-4">
      {entregables.map((entregable) => (
        <Card key={entregable.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{entregable.nombre}</h3>
                    <Badge variant="outline" className="mb-3">
                      {entregable.curso}
                    </Badge>
                    <p className="text-sm text-gray-500">{entregable.descripcion}</p>
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
                  <span className="text-gray-500">Plazo:</span> {entregable.plazo}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Contenidos esperados:</span> {entregable.contenidos}
                </div>
              </div>

              <Link href={`/coordinador/configuracion/general/entregables/${entregable.id}`}>
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
