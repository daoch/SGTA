"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { etapasFormativasService, type EtapaFormativaDetail } from "@/features/configuracion/services/etapas-formativas";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

const getEstadoLabel = (estado: string) => {
  const estados = {
    "EN_CURSO": "En curso",
    "FINALIZADO": "Finalizado"
  };
  return estados[estado as keyof typeof estados] || estado;
};

const formatISOtoDuracion = (isoDuracion: string): string => {
    // Convertir formato ISO 8601 (PT[H]H[M]M[S]S) a HH:MM:SS
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const hoursMatch = isoDuracion.match(/(\d+)H/);
    const minutesMatch = isoDuracion.match(/(\d+)M/);
    const secondsMatch = isoDuracion.match(/(\d+)S/);

    if (hoursMatch) hours = parseInt(hoursMatch[1]);
    if (minutesMatch) minutes = parseInt(minutesMatch[1]);
    if (secondsMatch) seconds = parseInt(secondsMatch[1]);

    return `${hours} horas ${minutes} minutos ${seconds} segundos`.trim().replace(/\b0 \w+ ?/g, '').trim() || '0 minutos';
};

export default function DetalleEtapaFormativaPage({ params }: { params: Promise<{ id: string }> }) {
  const [etapaFormativa, setEtapaFormativa] = useState<EtapaFormativaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    loadEtapaFormativa();
  }, [id]);

  const loadEtapaFormativa = async () => {
    try {
      const data = await etapasFormativasService.getById(id);
      setEtapaFormativa(data);
    } catch (error) {
      console.error("Error al cargar etapa formativa:", error);
      toast.error("Error al cargar la etapa formativa");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="py-6 px-2">Cargando etapa formativa...</div>;
  }

  if (!etapaFormativa) {
    return <div className="py-6 px-2">No se encontró la etapa formativa</div>;
  }

  return (
    <div className="py-6 px-2">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/administrador/configuracion/etapas-formativas">
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
            <Badge variant={etapaFormativa.estadoActual === "EN_CURSO" ? "default" : "secondary"}>
              {getEstadoLabel(etapaFormativa.estadoActual)}
            </Badge>
          </div>
          <Link href={`/administrador/configuracion/etapas-formativas/${etapaFormativa.id}/editar`}>
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
              <p>{etapaFormativa.carreraNombre}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Créditos por Tema</h3>
              <p>{etapaFormativa.creditajePorTema}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Duración de Exposición</h3>
              <p>{formatISOtoDuracion(etapaFormativa.duracionExposicion)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Ciclo Actual</h3>
              <p>{etapaFormativa.cicloActual}</p>
            </div>
          </div>

          {etapaFormativa.historialCiclos && etapaFormativa.historialCiclos.length > 0 && (
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
                    {etapaFormativa.historialCiclos.map((ciclo) => (
                      <tr key={ciclo.id}>
                        <td className="py-2 text-sm">{ciclo.ciclo}</td>
                        <td className="py-2 text-sm">
                          <Badge variant={ciclo.estado === "EN_CURSO" ? "default" : "secondary"}>
                            {getEstadoLabel(ciclo.estado)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
