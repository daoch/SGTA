"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ObservacionesCard } from "@/features/temas/components/alumno/observaciones-card";
import type {
  Observacion,
  Solicitud
} from "@/features/temas/types/temas/entidades";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ObservacionesAlumnoView() {
  const router = useRouter();
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTemaYObservaciones = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }

        const temaRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/temas/porUsuarioTituloAreaCarreraEstadoFecha?titulo=&areaId=&carreraId=&estadoNombre=INSCRITO&fechaCreacionDesde=&fechaCreacionHasta=`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (!temaRes.ok) throw new Error("Error al obtener tema");
        
        const temaData = await temaRes.json();
        const tema = temaData[0];
        if (!tema?.id) throw new Error("No se encontró tema inscrito");

        const obsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/listSolicitudesByTema/${tema.id}`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (!obsRes.ok) throw new Error("Error al obtener las observaciones");

        const obsData: { changeRequests: Solicitud[] } = await obsRes.json();

        const filtradas = obsData.changeRequests.filter(
          (req) =>
            (req.tipoSolicitud.id === 2 || req.tipoSolicitud.id === 3) &&
            req.solicitudCompletada === false
        );

        const observacionesFormateadas: Observacion[] = filtradas.map((req) => ({
          campo: req.tipoSolicitud.id === 2 ? "título" : "descripción",
          detalle: req.reason,
          autor: `${req.usuario.nombres} ${req.usuario.primerApellido}`,
          fecha: req.registerTime,
        }));

        setObservaciones(observacionesFormateadas);
        setSolicitudesFiltradas(filtradas);
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

    fetchTemaYObservaciones();
  }, []);

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
        <ObservacionesCard observaciones={observaciones} solicitudes={solicitudesFiltradas} />
      )}
    </div>
  );
}
