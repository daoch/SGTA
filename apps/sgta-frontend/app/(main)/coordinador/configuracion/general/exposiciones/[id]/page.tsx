import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Monitor, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const exposicion = {
  id: 3,
  nombre: "Exposición Parcial",
  curso: "Proyecto de Fin de Carrera 1",
  fechas: "Semana 16",
  descripcion: "Presentación final del primer curso.",
  presencial: true,
  conJurados: true,
  contenidos: [
    {
      id: 1,
      nombre: "Introducción y contexto",
      descripcion: "Presentación del problema y contexto del proyecto.",
      peso: 3,
    },
    {
      id: 2,
      nombre: "Estado del arte",
      descripcion: "Revisión de literatura y soluciones existentes.",
      peso: 4,
    },
    {
      id: 3,
      nombre: "Propuesta de solución",
      descripcion: "Descripción detallada de la solución propuesta.",
      peso: 5,
    },
    {
      id: 4,
      nombre: "Avances de implementación",
      descripcion: "Demostración de los avances en la implementación.",
      peso: 5,
    },
    {
      id: 5,
      nombre: "Conclusiones y trabajo futuro",
      descripcion:
        "Conclusiones preliminares y plan de trabajo para el siguiente curso.",
      peso: 3,
    },
  ],
};

export default function ExposicionDetailPage({}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="py-6 px-2">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/coordinador/configuracion/general">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalles de la Exposición</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{exposicion.nombre}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Edit size={16} />
            <span>Editar</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Curso</h3>
              <p>{exposicion.curso}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fechas</h3>
              <p>{exposicion.fechas}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Descripción
            </h3>
            <p className="text-gray-600">{exposicion.descripcion}</p>
          </div>
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
              <span>
                {exposicion.conJurados ? "Con jurados" : "Sin jurados"}
              </span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contenidos Esperados</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nuevo Contenido</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {exposicion.contenidos.map((contenido, index) => (
              <div key={contenido.id}>
                {index > 0 && <Separator className="my-6" />}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {contenido.nombre}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {contenido.descripcion}
                    </p>

                    {exposicion.conJurados && (
                      <div className="mt-2 text-sm bg-gray-50 px-3 py-2 rounded-md inline-block">
                        <span className="font-medium">
                          Peso en la calificación:
                        </span>{" "}
                        {contenido.peso} puntos
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit size={14} />
                      <span>Editar</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-red-500"
                    >
                      <Trash2 size={14} />
                      <span>Eliminar</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
