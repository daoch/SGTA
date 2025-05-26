"use client";

import { Button } from "@/components/ui/button";
import { ObservacionesCard } from "@/features/temas/components/alumno/observaciones-card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  id: string;
}

interface Observacion {
  campo: "título" | "descripción";
  detalle: string;
  autor: string;
  fecha: string;
}

export function ObservacionesAlumnoView({ id }: Props) {
  const router = useRouter();
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        const response = await fetch(`http://localhost:5000/solicitudes/listSolicitudesByTema/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener las observaciones");
        }
        const data = await response.json();

        // Filtrar tipos de solicitud 2 y 3
        const observacionesFiltradas = data.changeRequests
          .filter((req: any) => req.tipoSolicitud.id === 2 || req.tipoSolicitud.id === 3)
          .map((req: any) => ({
            campo: req.tipoSolicitud.id === 2 ? "título" : "descripción",
            detalle: req.reason,
            autor: `${req.usuario.nombres} ${req.usuario.primerApellido}`,
            fecha: req.registerTime,
          }));

        setObservaciones(observacionesFiltradas);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObservaciones();
  }, [id]);

  if (loading) {
    return <p className="p-6">Cargando observaciones...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Error: {error}</p>;
  }

  if (observaciones.length === 0) {
    return <p className="p-6">No se encontraron observaciones para este tema.</p>;
  }

  return (
    <div className="space-y-8 mt-4">
      <div className="flex flex-col items-start gap-2">
        {/* Botón + título */}
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-[#042354] ml-3">
            Observaciones del Tema
          </h1>
        </div>

        {/* Descripción */}
        <p className="text-muted-foreground">
          A continuación se muestran las observaciones realizadas al tema de tesis.
        </p>
      </div>

      <ObservacionesCard observaciones={observaciones} />
    </div>
  );
}
