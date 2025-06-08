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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AlertCircle, CheckCircle, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  observaciones: {
    campo: "título" | "descripción" | "asesor";
    detalle: string;
    autor: string;
    fecha: string;
  }[];
  solicitudes: Solicitud[];
}

interface Solicitud {
  id: number;
  usuario: { id: number };
  students: {
    id: number;
    name: string;
    lastName: string;
    topic: {
      titulo: string;
      resumen: string;
    };
  }[];
}

const profesores = [
  "Dr. Roberto Sánchez",
  "Dra. Carmen Vega",
  "Dr. Miguel Torres",
  "Dra. Laura Mendoza",
  "Dr. Javier Pérez",
];

export function ObservacionesCard({ observaciones, solicitudes }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [asesor, setAsesor] = useState("");

  const [tituloOriginal, setTituloOriginal] = useState("");
  const [descripcionOriginal, setDescripcionOriginal] = useState("");
  const [asesorOriginal, setAsesorOriginal] = useState("");

  const [editadoTitulo, setEditadoTitulo] = useState(false);
  const [editadoDescripcion, setEditadoDescripcion] = useState(false);
  const [editadoAsesor, setEditadoAsesor] = useState(false);

  const camposObservados = observaciones.map((obs) => obs.campo);

  const sePuedeGuardar = camposObservados.every((campo) => {
    if (campo === "título") return editadoTitulo && titulo.trim() !== "";
    if (campo === "descripción") return editadoDescripcion && descripcion.trim() !== "";
    if (campo === "asesor") return editadoAsesor && asesor.trim() !== "";
    return true;
  });
    useEffect(() => {
    const fetchTema = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}temas/listarTemasPorUsuarioRolEstado?rolNombre=Tesista&estadoNombre=INSCRITO`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (!res.ok) throw new Error("Error al obtener tema");
        
        const data = await res.json();
        const tema = data[0];
        if (tema) {
          setTitulo(tema.titulo);
          setDescripcion(tema.resumen);
          setTituloOriginal(tema.titulo);
          setDescripcionOriginal(tema.resumen);
        }
      } catch (error) {
        console.error("Error al cargar el tema:", error);
      }
    };
    fetchTema();
  }, []);

  const handleGuardar = async () => {
    const changeRequests = solicitudes.map((solicitud) => ({
      id: solicitud.id,
      usuario: { id: solicitud.usuario?.id ?? null },
      students: solicitud.students.map((student) => ({
        id: student?.id ?? null,
        name: student?.name ?? "",
        lastName: student?.lastName ?? "",
        topic: {
          titulo: titulo.trim(),
          resumen: descripcion.trim(),
        },
      })),
    }));

    const payload = {
      changeRequests,
      totalPages: 1,
    };

    try {
      const { idToken } = useAuthStore.getState();
        
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }
        
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}solicitudes/atenderSolicitudTemaInscrito`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
            Tu tesis tiene observaciones que deben ser subsanadas para continuar con el proceso
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {observaciones.map((obs) => (
          <Card key={obs.campo} className="border border-gray-300 bg-white rounded-md">
            <CardContent className="space-y-2 pt-0">
              <p className="text-sm font-semibold text-red-700">Observación sobre el {obs.campo}</p>
              <p className="text-sm">{obs.detalle}</p>
              <p className="text-xs text-muted-foreground italic">
                {obs.autor} - {obs.fecha}
              </p>

              {modoEdicion && obs.campo === "título" && (
                <div className="space-y-1">
                  <Label>Título del Tema</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value);
                      setEditadoTitulo(true);
                    }}
                    required
                  />
                </div>
              )}

              {modoEdicion && obs.campo === "descripción" && (
                <div className="space-y-1">
                  <Label>Descripción</Label>
                  <Textarea
                    rows={4}
                    value={descripcion}
                    onChange={(e) => {
                      setDescripcion(e.target.value);
                      setEditadoDescripcion(true);
                    }}
                    required
                  />
                </div>
              )}

              {modoEdicion && obs.campo === "asesor" && (
                <div className="space-y-1">
                  <Label>Asesor Principal</Label>
                  <Select
                    value={asesor}
                    onValueChange={(value) => {
                      setAsesor(value);
                      setEditadoAsesor(true);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un asesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {profesores.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
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
                setAsesor(asesorOriginal);
                setEditadoTitulo(false);
                setEditadoDescripcion(false);
                setEditadoAsesor(false);
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
              setTituloOriginal(titulo);
              setDescripcionOriginal(descripcion);
              setAsesorOriginal(asesor);
              setModoEdicion(true);
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
