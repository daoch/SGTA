"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { useState } from "react";

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
  const [confirmar, setConfirmar] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [tituloOriginal, setTituloOriginal] = useState("");
  const [descripcionOriginal, setDescripcionOriginal] = useState("");

  const [editadoTitulo, setEditadoTitulo] = useState(false);
  const [editadoDescripcion, setEditadoDescripcion] = useState(false);

  const [loadingTema, setLoadingTema] = useState(false);

  const camposObservados = observaciones.map((obs) => obs.tipo_solicitud);

  const sePuedeGuardar = camposObservados.every((tipo) => {
    if (tipo === "Solicitud de cambio de título") return editadoTitulo && titulo.trim() !== "";
    if (tipo === "Solicitud de cambio de resumen") return editadoDescripcion && descripcion.trim() !== "";
    return true;
  });

  const fetchTema = async () => {
    setLoadingTema(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/porUsuarioTituloAreaCarreraEstadoFecha?titulo=&areaId=&carreraId=&estadoNombre=OBSERVADO&fechaCreacionDesde=&fechaCreacionHasta=`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data && data[0]) {
        setTitulo(data[0].titulo);
        setDescripcion(data[0].resumen);
        setTituloOriginal(data[0].titulo);
        setDescripcionOriginal(data[0].resumen);
      }
    } catch (error) {
      console.error("Error al obtener el tema:", error);
    } finally {
      setLoadingTema(false);
    }
  };

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
            titulo: titulo.trim(),
            resumen: descripcion.trim(),
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
            {modoEdicion && obs.tipo_solicitud === "Solicitud de cambio de título" && (
              <div>
                <label className="block text-sm font-medium mb-1 mt-2">Nuevo título</label>
                <input
                  className="border rounded px-2 py-1 w-full"
                  placeholder={titulo}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
            )}
            {modoEdicion && obs.tipo_solicitud === "Solicitud de cambio de resumen" && (
              <div>
                <label className="block text-sm font-medium mb-1 mt-2">Nuevo resumen</label>
                <textarea
                  className="border rounded px-2 py-1 w-full"
                  placeholder={descripcion}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-end gap-4">
        {modoEdicion ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setTitulo(tituloOriginal);
                setDescripcion(descripcionOriginal);
                setEditadoTitulo(false);
                setEditadoDescripcion(false);
                setModoEdicion(false);
              }}
            >
              Cancelar
            </Button>

            <AlertDialog open={confirmar} onOpenChange={setConfirmar}>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!sePuedeGuardar}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Enviar todas las subsanaciones
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Deseas guardar los cambios?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción enviará tus subsanaciones y no podrás editarlas nuevamente por ahora.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGuardar}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              setModoEdicion(true);
              fetchTema(); // se obtiene título y resumen original en el momento exacto
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Subsanar observaciones
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
