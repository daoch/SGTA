"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ObservacionV2 } from "@/features/temas/types/temas/entidades";
import { AlertCircle, CheckCircle, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export function ObservacionesCard({ observaciones }: { observaciones: ObservacionV2[] }) {
  const router = useRouter();
  const { idToken } = useAuthStore();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [tema, setTema] = useState<{ titulo: string; resumen: string } | null>(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoResumen, setNuevoResumen] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/temas/porUsuarioTituloAreaCarreraEstadoFecha?titulo=&areaId=&carreraId=&estadoNombre=OBSERVADO&fechaCreacionDesde=&fechaCreacionHasta=`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]) {
          setTema({ titulo: data[0].titulo, resumen: data[0].resumen });
          setNuevoTitulo(data[0].titulo);
          setNuevoResumen(data[0].resumen);
        }
      });
  }, []);

  // Al entrar en modo edición, inicializa los campos con el tema ya cargado
  const handleSubsanar = () => {
    if (tema) {
      setNuevoTitulo(tema.titulo);
      setNuevoResumen(tema.resumen);
    }
    setModoEdicion(true);
  };

  // Determinar si se han hecho cambios en todos los campos mostrados
  const camposMostrados = observaciones.map((obs) =>
    obs.tipo_solicitud === "Solicitud de cambio de título" ? "titulo" : "resumen"
  );

  const cambiosHechos =
    camposMostrados.every((campo) =>
      campo === "titulo"
        ? nuevoTitulo.trim() !== (tema?.titulo.trim() ?? "")
        : nuevoResumen.trim() !== (tema?.resumen.trim() ?? "")
    );

  // Guardar cambios
  const handleGuardar = async () => {
    setIsLoading(true);
    const changeRequests = observaciones.map((obs) => ({
      id: obs.solicitud_id,
      usuario: { id: null },
      students: [
        {
          id: null,
          name: "",
          lastName: "",
          topic: {
            titulo:
              obs.tipo_solicitud === "Solicitud de cambio de título"
                ? nuevoTitulo.trim()
                : tema?.titulo.trim() ?? "",
            resumen:
              obs.tipo_solicitud === "Solicitud de cambio de resumen"
                ? nuevoResumen.trim()
                : tema?.resumen.trim() ?? "",
          },
        },
      ],
    }));

    const payload = {
      changeRequests,
      totalPages: 1,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/solicitudes/atenderSolicitudTemaInscrito`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Error al enviar subsanaciones");

      toast.success("¡Subsanaciones enviadas correctamente!");
      router.push("/alumno/temas");

      setModoEdicion(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Hubo un problema al enviar las subsanaciones.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4 border border-gray-300 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row gap-2 items-start">
        <AlertCircle className="text-yellow-500 mt-1" />
        <div>
          <CardTitle className="text-yellow-500 text-lg">Observaciones del Coordinador</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tu tema tiene observaciones que deben ser subsanadas para continuar con el proceso
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {observaciones.map((obs) => (
          <div
            key={obs.solicitud_id}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
          >
            <div className="font-semibold text-sm text-yellow-500 mb-1">
              {obs.tipo_solicitud}
            </div>
            <div className="text-sm mb-2">{obs.descripcion}</div>
            <div className="italic text-xs text-gray-500">
              {obs.remitente.nombres} {obs.remitente.primer_apellido} -{" "}
              {new Date(obs.fecha_creacion).toLocaleDateString()}
            </div>
            {modoEdicion && tema && obs.tipo_solicitud === "Solicitud de cambio de título" && (
              <div>
                <label className="block text-sm font-medium mb-1 mt-2">Título del Tema</label>
                <input
                  className="border rounded-md px-2 py-1 w-full text-sm"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                />
              </div>
            )}
            {modoEdicion && tema && obs.tipo_solicitud === "Solicitud de cambio de resumen" && (
              <div>
                <label className="block text-sm font-medium mb-1 mt-2">Resumen del Tema</label>
                <textarea
                  className="border rounded-md px-2 py-1 w-full text-sm resize-none"
                  value={nuevoResumen}
                  onChange={(e) => setNuevoResumen(e.target.value)}
                  rows={2}
                  onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        {modoEdicion ? (
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="border border-gray-300 bg-white text-black font-semibold px-6 py-2 rounded-xl hover:bg-gray-100 transition"
              onClick={() => setModoEdicion(false)}
            >
              Cancelar
            </button>
            <button
              className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition ${(!cambiosHechos || isLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleGuardar}
              disabled={!cambiosHechos || isLoading}
            >
              {isLoading ? "Subsanando observaciones..." : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enviar todas las subsanaciones
                </>
              )}
            </button>
          </div>
        ) : (
          <Button
            className="bg-yellow-500 hover:bg-red-700 text-white"
            onClick={handleSubsanar}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Subsanar observaciones
          </Button>
        )}
      </CardFooter>
      <Toaster position="bottom-right" />
    </Card>
  );
}
