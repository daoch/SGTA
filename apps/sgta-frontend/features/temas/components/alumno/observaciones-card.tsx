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
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AlertCircle, CheckCircle, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Remitente {
  usuario_solicitud_id: number;
  usuario_id: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  codigo: string;
}

interface Observacion {
  solicitud_id: number;
  descripcion: string;
  tipo_solicitud: string;
  estado_solicitud: string;
  tema_id: number;
  fecha_creacion: string;
  remitente: Remitente;
}

export function ObservacionesCard({ observaciones }: { observaciones: Observacion[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const { idToken } = useAuthStore();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [tema, setTema] = useState<{ titulo: string; resumen: string } | null>(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoResumen, setNuevoResumen] = useState("");

  // Cargar el tema al montar el componente (no al editar)
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

      toast({
        title: "Subsanaciones enviadas",
        description: "Tus cambios se guardaron correctamente.",
        duration: 4000,
      });

      setModoEdicion(false);
      setTimeout(() => router.push("/alumno/temas"), 4500);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-4 border border-gray-300 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row gap-2 items-start">
        <AlertCircle className="text-red-500 mt-1" />
        <div>
          <CardTitle className="text-red-700 text-lg">Observaciones del Coordinador</CardTitle>
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
            <div className="font-semibold text-sm text-red-700 mb-1">
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
                  className="border rounded-md px-2 py-1 w-full text-sm"
                  value={nuevoResumen}
                  onChange={(e) => setNuevoResumen(e.target.value)}
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
              className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition ${!cambiosHechos ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleGuardar}
              disabled={!cambiosHechos}
            >
              <CheckCircle className="w-5 h-5" />
              Enviar todas las subsanaciones
            </button>
          </div>
        ) : (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleSubsanar}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Subsanar observaciones
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
