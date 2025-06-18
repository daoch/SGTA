"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ObservacionesCard } from "@/features/temas/components/alumno/observaciones-card";
import { ObservacionV2 } from "@/features/temas/types/temas/entidades";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


interface UsuarioSolicitud {
  usuario_solicitud_id: number;
  usuario_id: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  codigo: string;
  rol_solicitud: string;
}

interface SolicitudApiResponse {
  solicitud_id: number;
  descripcion: string;
  tipo_solicitud: string;
  estado_solicitud: string;
  tema_id: number;
  fecha_creacion: string;
  usuarios: UsuarioSolicitud[];
}

export function ObservacionesAlumnoView() {
  const router = useRouter();
  const { idToken } = useAuthStore();
  const [observaciones, setObservaciones] = useState<ObservacionV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const temaId = 1; 

  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/TodasSolicitudesPendientes?offset=0&limit=100`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data: SolicitudApiResponse[] = await res.json();
        const observaciones = data
          .map((s) => {
            const remitente = s.usuarios.find((u) => u.rol_solicitud === "REMITENTE");
            if (!remitente) return null; 
            return {
              solicitud_id: s.solicitud_id,
              descripcion: s.descripcion,
              tipo_solicitud: s.tipo_solicitud,
              estado_solicitud: s.estado_solicitud,
              tema_id: s.tema_id,
              fecha_creacion: s.fecha_creacion,
              remitente: remitente,
            };
          })
          .filter((o): o is NonNullable<typeof o> => o !== null);
        setObservaciones(observaciones);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };
    if (idToken && temaId) fetchObservaciones();
  }, [idToken, temaId]);

  if (loading) return <p className="p-6">Cargando observaciones...</p>;

  return (
    <div className="space-y-8 mt-4">
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-[#042354] ml-3">Observaciones del Tema</h1>
        </div>
        <p className="text-muted-foreground">
          A continuación se muestran las observaciones realizadas al tema de tesis.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {observaciones.length === 0 ? (
        <Alert>
          <AlertTitle>Sin observaciones</AlertTitle>
          <AlertDescription>No se encontraron observaciones para este tema.</AlertDescription>
        </Alert>
      ) : (
        <ObservacionesCard observaciones={observaciones} />
      )}
    </div>
  );
}
