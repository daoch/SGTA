import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Edit, Monitor, Presentation, Trash2, Users } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const exposiciones = [
  {
    id: 1,
    nombre: "Exposición de Avance 1",
    curso: "Proyecto de Fin de Carrera 1",
    fechas: "Semana 6-7",
    descripcion: "Primera presentación de avance del proyecto.",
    presencial: false,
    conJurados: false,
    contenidos: 4,
  },
  {
    id: 2,
    nombre: "Exposición de Avance 2",
    curso: "Proyecto de Fin de Carrera 1",
    fechas: "Semana 12-13",
    descripcion: "Segunda presentación de avance del proyecto.",
    presencial: false,
    conJurados: false,
    contenidos: 4,
  },
  {
    id: 3,
    nombre: "Exposición Parcial",
    curso: "Proyecto de Fin de Carrera 1",
    fechas: "Semana 16",
    descripcion: "Presentación final del primer curso.",
    presencial: true,
    conJurados: true,
    contenidos: 5,
  },
  {
    id: 4,
    nombre: "Exposición Final",
    curso: "Proyecto de Fin de Carrera 2",
    fechas: "Semana 16",
    descripcion: "Presentación final del proyecto completo.",
    presencial: true,
    conJurados: true,
    contenidos: 6,
  },
];

export function ExposicionesList() {
  return (
    <div className="space-y-4">
      {exposiciones.map((exposicion) => (
        <Card key={exposicion.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                    <Presentation size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{exposicion.nombre}</h3>
                    <Badge variant="outline" className="mb-3">
                      {exposicion.curso}
                    </Badge>
                    <p className="text-sm text-gray-500 mb-3">{exposicion.descripcion}</p>

                    <div className="flex gap-3">
                      <Badge
                        variant={exposicion.presencial ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <Monitor size={14} />
                        <span>{exposicion.presencial ? "Presencial" : "Virtual"}</span>
                      </Badge>

                      <Badge
                        variant={exposicion.conJurados ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <Users size={14} />
                        <span>{exposicion.conJurados ? "Con jurados" : "Sin jurados"}</span>
                      </Badge>
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
                  <span className="text-gray-500">Fechas:</span> {exposicion.fechas}
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Contenidos esperados:</span> {exposicion.contenidos}
                </div>
              </div>

              <Link href={`/coordinador/configuracion/general/exposiciones/${exposicion.id}`}>
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
