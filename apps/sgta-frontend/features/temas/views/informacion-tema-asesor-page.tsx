"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObservacionesCard } from "@/features/temas/components/asesor/observaciones-tema-card";
import {
  buscarTema,
  obtenerObservacionesTema,
} from "@/features/temas/types/temas/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tema } from "../types/inscripcion/entities";
import { Observacion, Solicitud } from "../types/temas/entidades";

export default function InformacionTemaAsesor({ params }: { params: string }) {
  const router = useRouter();
  const [tema, setTema] = useState<Tema | null>(null);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  //const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
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
    const fetchObservaciones = async (id: number) => {
      setLoading(true);
      try {
        const obsData: { changeRequests: Solicitud[] } =
          await obtenerObservacionesTema(id);

        const filtradas = obsData.changeRequests.filter(
          (req) =>
            (req.tipoSolicitud.id === 2 || req.tipoSolicitud.id === 3) &&
            req.solicitudCompletada === false,
        );

        const observacionesFormateadas: Observacion[] = filtradas.map(
          (req) => ({
            campo: req.tipoSolicitud.id === 2 ? "título" : "descripción",
            detalle: req.reason,
            autor: `${req.usuario.nombres} ${req.usuario.primerApellido}`,
            fecha: req.registerTime,
          }),
        );

        setObservaciones(observacionesFormateadas);
        //setSolicitudes(filtradas);
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

    fetchObservaciones(Number(params));
  }, [params]);

  console.log({ tema });
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
        </TabsList>
        <TabsContent value={"Comentarios"}>
          {loading ? (
            <p className="p-6 text-muted-foreground">
              Cargando observaciones...
            </p>
          ) : error ? (
            <p className="p-6 text-red-500">Error: {error}</p>
          ) : observaciones.length === 0 ? (
            <p className="p-6 text-muted-foreground">
              No se encontraron observaciones para este tema
            </p>
          ) : (
            <ObservacionesCard
              observaciones={observaciones}
            ></ObservacionesCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
