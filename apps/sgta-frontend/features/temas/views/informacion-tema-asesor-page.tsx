"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buscarTema,
  obtenerObservacionesTema,
} from "@/features/temas/types/temas/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HistorialTemaCard from "../components/asesor/historial-tema-card";
import { ObservacionesCard } from "../components/asesor/observaciones-tema-card";
import { Observacion, Tema } from "../types/temas/entidades";

export default function InformacionTemaAsesor({
  params,
}: {
  readonly params: string;
}) {
  const router = useRouter();
  const [tema, setTema] = useState<Tema | null>(null);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTema = async (id: number) => {
      try {
        const data = await buscarTema(id);
        setTema(data);
      } catch (error) {
        console.error("Error cargando el tema:", error);
      }
    };

    fetchTema(Number(params));
  }, [params, router]);

  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        const obsData: Observacion[] = await obtenerObservacionesTema();

        const filtradas = obsData.filter(
          (req: Observacion) => req.tema_id === tema?.id,
        );

        const observaciones = filtradas
          .map((s) => {
            const remitente = s.usuarios.find(
              (u) => u.rol_solicitud === "REMITENTE",
            );
            if (!remitente) return null;
            return {
              solicitud_id: s.solicitud_id,
              descripcion: s.descripcion,
              tipo_solicitud: s.tipo_solicitud,
              estado_solicitud: s.estado_solicitud,
              tema_id: s.tema_id,
              fecha_creacion: s.fecha_creacion,
              usuarios: [remitente],
            };
          })
          .filter((o): o is NonNullable<typeof o> => o !== null);

        setObservaciones(observaciones);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error al obtener las observaciones:", err);
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };
    if (tema) {
      setLoading(true);
      fetchObservaciones();
    }
  }, [tema]);

  console.log({ observaciones });
  return (
    <div className="space-y-8 mt-4">
      <div className="flex items-center gap-4">
        <Link href="/asesor/temas">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#042354]">{tema?.titulo}</h1>
          <p className="text-muted-foreground">{"Temas   >   Información"}</p>
        </div>
      </div>
      <Tabs defaultValue={"Comentarios"} className="w-full">
        <TabsList>
          <TabsTrigger value={"Comentarios"}>Comentario(s)</TabsTrigger>
          <TabsTrigger value={"Historial"}>Historial de cambio</TabsTrigger>
        </TabsList>
        <TabsContent value={"Comentarios"}>
          {(() => {
            if (loading) {
              return (
                <p className="p-6 text-muted-foreground">
                  Cargando observaciones...
                </p>
              );
            } else if (observaciones.length === 0) {
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Observaciones pendientes</CardTitle>
                    <CardDescription>
                      Observaciones pendientes por parte del alumno
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6 text-gray-500">
                      No se encontraron observaciones pendientes
                    </div>
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <ObservacionesCard
                  observaciones={observaciones}
                ></ObservacionesCard>
              );
            }
          })()}
        </TabsContent>
        <TabsContent value={"Historial"}>
          <HistorialTemaCard idTema={tema?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
