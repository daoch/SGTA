import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const entregable = {
  id: 1,
  nombre: "Propuesta de Proyecto",
  curso: "Proyecto de Fin de Carrera 1",
  plazo: "Semana 4",
  descripcion:
    "Documento que describe el problema a resolver y la propuesta de solución.",
  contenidos: [
    {
      id: 1,
      nombre: "Introducción",
      descripcion: "Presentación general del problema y contexto del proyecto.",
      peso: null,
    },
    {
      id: 2,
      nombre: "Problemática",
      descripcion:
        "Descripción detallada del problema a resolver, incluyendo estadísticas y evidencias.",
      peso: null,
    },
    {
      id: 3,
      nombre: "Objetivos",
      descripcion: "Objetivo general y objetivos específicos del proyecto.",
      peso: null,
    },
    {
      id: 4,
      nombre: "Propuesta de solución",
      descripcion:
        "Descripción general de la solución propuesta y su justificación.",
      peso: null,
    },
    {
      id: 5,
      nombre: "Plan de trabajo",
      descripcion:
        "Cronograma de actividades y entregables para el desarrollo del proyecto.",
      peso: null,
    },
  ],
};

export default function EntregableDetailPage({}: {
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
        <h1 className="text-2xl font-bold">Detalles del Entregable</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{entregable.nombre}</CardTitle>
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
              <p>{entregable.curso}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Plazo</h3>
              <p>{entregable.plazo}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Descripción
            </h3>
            <p className="text-gray-600">{entregable.descripcion}</p>
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
            {entregable.contenidos.map((contenido, index) => (
              <div key={contenido.id}>
                {index > 0 && <Separator className="my-6" />}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {contenido.nombre}
                    </h3>
                    <p className="text-gray-600">{contenido.descripcion}</p>

                    {contenido.peso !== null && (
                      <div className="mt-2 text-sm">
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
