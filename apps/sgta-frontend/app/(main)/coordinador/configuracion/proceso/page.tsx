import { NuevaEtapaModal } from "@/components/main/configuracion/nueva-etapa-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ChevronRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const etapas = [
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

export default function ConfiguracionProcesoPage() {
  return (
    <div className="py-6 px-2">
     
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Configuración de Proceso</h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/coordinador/configuracion">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h2 className="text-xl font-semibold">Etapas del Proyecto</h2>
        </div>
        <NuevaEtapaModal />
      </div>

      
      <div className="space-y-4">
        {etapas.map((etapa) => (
          <Card key={etapa.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{etapa.nombre}</h3>
                      <p className="text-sm text-gray-500 mb-4">{etapa.descripcion}</p>

                      <div className="text-sm">
                        <strong>Objetivos:</strong> {etapa.objetivos}
                      </div>
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
                    <span className="text-gray-500">Entregables:</span> {etapa.entregables}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Exposiciones:</span> {etapa.exposiciones}
                  </div>
                </div>

                <Link href={`/coordinador/configuracion/proceso/etapa/${etapa.id}`}>
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
    </div>
  );
}
