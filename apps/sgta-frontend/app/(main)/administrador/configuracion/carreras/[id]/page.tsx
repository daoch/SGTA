import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const carrera = {
  id: 1,
  codigo: "INF",
  nombre: "Ingeniería Informática",
  descripcion: "Carrera de software y sistemas",
  facultad: "Facultad de Ciencias e Ingeniería",
  etapasFormativas: 2,
  estado: "Activo",
  etapasFormativasActuales: [
    {
      id: 1,
      nombre: "Proyecto de Tesis 1",
      creditos: 4.0,
    },
    {
      id: 2,
      nombre: "Proyecto de Tesis 2",
      creditos: 4.0,
    },
  ],
};

export default function DetalleCarreraPage({ }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/administrador/configuracion/carreras">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalle de Carrera</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{carrera.nombre}</CardTitle>
            <Badge variant={carrera.estado === "Activo" ? "default" : "secondary"}>{carrera.estado}</Badge>
          </div>
          <Link href={`/administrador/configuracion/carreras/${carrera.id}/editar`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit size={16} />
              <span>Editar</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Código</h3>
              <p>{carrera.codigo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Facultad</h3>
              <p>{carrera.facultad}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descripción</h3>
            <p className="text-gray-600">{carrera.descripcion}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Etapas Formativas Actuales</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 text-sm font-medium text-gray-500">Nombre</th>
                    <th className="pb-2 text-sm font-medium text-gray-500">Créditos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {carrera.etapasFormativasActuales.map((etapa) => (
                    <tr key={etapa.id}>
                      <td className="py-2 text-sm">{etapa.nombre}</td>
                      <td className="py-2 text-sm">{etapa.creditos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
