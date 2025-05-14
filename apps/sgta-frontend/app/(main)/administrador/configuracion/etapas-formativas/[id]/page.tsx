import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

// Datos de ejemplo
const etapaFormativa = {
  id: 1,
  nombre: "Proyecto de Tesis 1",
  carrera: "Ingeniería de Sistemas",
  creditos: 4.0,
  duracionExposicion: "00:20:00",
  cicloActual: {
    id: 3,
    nombre: "2024-I",
    estado: "En curso",
  },
  ciclosAnteriores: [
    {
      id: 2,
      nombre: "2023-II",
      estado: "Finalizado",
    },
    {
      id: 1,
      nombre: "2023-I",
      estado: "Finalizado",
    },
  ],
};

export default function DetalleEtapaFormativaPage({ }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/configuracion/etapas-formativas">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalle de Etapa Formativa</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>{etapaFormativa.nombre}</CardTitle>
            <Badge variant="default">{etapaFormativa.cicloActual.estado}</Badge>
          </div>
          <Link href={`/admin/configuracion/etapas-formativas/${etapaFormativa.id}/editar`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit size={16} />
              <span>Editar</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Carrera</h3>
              <p>{etapaFormativa.carrera}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Créditos</h3>
              <p>{etapaFormativa.creditos}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duración de Exposición</h3>
              <p>{etapaFormativa.duracionExposicion}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ciclo Actual</h3>
              <p>{etapaFormativa.cicloActual.nombre}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Historial de Ciclos</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 text-sm font-medium text-gray-500">Ciclo</th>
                    <th className="pb-2 text-sm font-medium text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 text-sm">{etapaFormativa.cicloActual.nombre}</td>
                    <td className="py-2 text-sm">
                      <Badge variant="default">{etapaFormativa.cicloActual.estado}</Badge>
                    </td>
                  </tr>
                  {etapaFormativa.ciclosAnteriores.map((ciclo) => (
                    <tr key={ciclo.id}>
                      <td className="py-2 text-sm">{ciclo.nombre}</td>
                      <td className="py-2 text-sm">
                        <Badge variant="secondary">{ciclo.estado}</Badge>
                      </td>
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
