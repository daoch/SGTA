"use client";

import { Dispatch, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  FileText,
  Target,
  AlertTriangle,
  MessageSquare,
  Check,
  X,
  Trash2,
  Eye,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SolicitudPendiente } from "../types/solicitudes/entities";
import {
  buscarTemaPorId,
  cambiarEstadoTemaPorCoordinador,
  eliminarTemaPorCoordinador,
} from "../types/solicitudes/data";
import { idCoasesor } from "../types/solicitudes/mock";
import { Tema } from "../types/temas/entidades";
import { EstadoSolicitud } from "../types/solicitudes/enums";

interface Props {
  solicitud: SolicitudPendiente;
  setTema: Dispatch<any>;
}

const usuarioId = idCoasesor;

export default function DetalleSolicitudesCoordinadorPage({
  solicitud,
  setTema,
}: Readonly<Props>) {
  // const router = useRouter();
  const [comentario, setComentario] = useState("");
  const [dialogAbierto, setDialogAbierto] = useState<
    "aprobar" | "rechazar" | "observar" | "eliminar" | ""
  >("");
  const [errorComentario, setErrorComentario] = useState("");

  // MOCK de similitud
  const similitudMock = {
    porcentaje: 35,
    temasRelacionados: [
      {
        id: "TEMA-2023-089",
        titulo: "Sistema de Inventario para Retail",
        similitud: 45,
      },
      {
        id: "TEMA-2023-156",
        titulo: "Aplicación de IA en Gestión Empresarial",
        similitud: 30,
      },
      {
        id: "TEMA-2024-003",
        titulo: "Dashboard Analítico para PYMES",
        similitud: 25,
      },
    ],
  };

  // MOCK de historial
  const historialMock = [
    {
      fecha: "2024-01-15",
      accion: "Solicitud creada",
      responsable: "Sistema",
      comentario: "Solicitud enviada por el estudiante",
    },
    {
      fecha: "2024-01-16",
      accion: "Asignada para evaluación",
      responsable: "Dr. Ana Pérez",
      comentario: "Asignada al comité de evaluación",
    },
  ];

  const handleAccion = async (
    accion: "Aprobada" | "Rechazada" | "Observada" | "Eliminada",
  ) => {
    if (!comentario.trim()) {
      return;
    }

    try {
      if (accion === "Eliminada") {
        await eliminarTemaPorCoordinador(
          solicitud.tema.id,
          usuarioId,
          comentario,
        );
      } else {
        const estadoMap: Record<
          "Aprobada" | "Rechazada" | "Observada",
          "REGISTRADO" | "RECHAZADO" | "OBSERVADO"
        > = {
          Aprobada: "REGISTRADO",
          Rechazada: "RECHAZADO",
          Observada: "OBSERVADO",
        };

        const payload = {
          tema: {
            id: solicitud.tema.id,
            estadoTemaNombre: estadoMap[accion],
          },
          usuarioSolicitud: {
            usuarioId,
            comentario,
          },
        };

        await cambiarEstadoTemaPorCoordinador(payload);
      }

      alert(`Solicitud ${accion.toLowerCase()} exitosamente.`);
      setDialogAbierto("");

      // Actualizar solicitud
      const tema = await buscarTemaPorId(solicitud.tema.id);
      setTema(tema);
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      alert("Ocurrió un error. Por favor, intente nuevamente.");
    }
  };

  const validateComment = () => {
    if (!comentario.trim()) {
      setErrorComentario("El comentario es obligatorio.");
    } else {
      setErrorComentario(""); // Limpia si ya es válido
    }
  };

  useEffect(() => {
    validateComment();
  }, [comentario]);

  return (
    <form className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ======= Encabezado ======= */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/coordinador/aprobaciones")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a solicitudes
              </Button> */}
              <Badge variant="secondary" className="text-sm">
                #{solicitud.id}
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {solicitud.tema.titulo}
                </CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {solicitud.estado}
                </Badge>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Estudiantes:</span>
                  <span>
                    {solicitud.tema.tesistas
                      ?.map((t) => `${t.nombres} ${t.primerApellido}`)
                      .join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Asesor:</span>
                  <span>
                    {solicitud.tema.coasesores &&
                    solicitud.tema.coasesores.length > 0
                      ? `${solicitud.tema.coasesores[0].nombres} ${solicitud.tema.coasesores[0].primerApellido}`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Fecha:</span>
                  <span>
                    {new Date(solicitud.fechaSolicitud).toLocaleDateString(
                      "es-PE",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* ======= Información del Tema ======= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información del Tema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resumen del proyecto
              </h4>
              <p>{solicitud.tema.resumen}</p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objetivos del proyecto
              </h4>
              <p>{solicitud.tema.objetivos}</p>
            </div>
          </CardContent>
        </Card>

        {/* ======= Análisis de Similitud ======= */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Análisis de Similitud
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Este tema presenta un{" "}
                <strong>{similitudMock.porcentaje}%</strong> de similitud con
                otros previamente aprobados. Revise antes de tomar una decisión.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              {similitudMock.temasRelacionados.map((tema, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{tema.titulo}</p>
                    <p className="text-xs text-gray-500">ID: {tema.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{tema.similitud}%</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/temas/${tema.id}`, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {solicitud.estado === EstadoSolicitud.PENDIENTE && (
          <>
            {/* ======= Comentarios del Comité ======= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comentarios del Comité
                </CardTitle>
                <CardDescription>
                  Obligatorio para aprobar, rechazar u observar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="comentario">Comentario</Label>
                <Textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => {
                    setComentario(e.target.value);
                    if (e.target.value.trim()) {
                      setErrorComentario("");
                    }
                  }}
                  className="min-h-[120px]"
                />
                {errorComentario && (
                  <p className="mt-1 text-sm text-red-600">{errorComentario}</p>
                )}
              </CardContent>
            </Card>

            {/* ======= Acciones Disponibles ======= */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Aprobar */}
                <Dialog
                  open={dialogAbierto === "aprobar"}
                  onOpenChange={(o) => setDialogAbierto(o ? "aprobar" : "")}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!comentario.trim().length}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Aprobación</DialogTitle>
                      <DialogDescription>
                        ¿Seguro de aprobar esta solicitud?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogAbierto("")}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAccion("Aprobada")}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Rechazar */}
                <Dialog
                  open={dialogAbierto === "rechazar"}
                  onOpenChange={(o) => setDialogAbierto(o ? "rechazar" : "")}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={!comentario.trim().length}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Rechazo</DialogTitle>
                      <DialogDescription>
                        ¿Seguro de rechazar esta solicitud?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogAbierto("")}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleAccion("Rechazada")}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Observar */}
                <Dialog
                  open={dialogAbierto === "observar"}
                  onOpenChange={(o) => setDialogAbierto(o ? "observar" : "")}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                      disabled={!comentario.trim().length}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Observar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Observación</DialogTitle>
                      <DialogDescription>
                        ¿Seguro de observar esta solicitud?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogAbierto("")}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={() => handleAccion("Observada")}>
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Eliminar */}
                <Dialog
                  open={dialogAbierto === "eliminar"}
                  onOpenChange={(o) => setDialogAbierto(o ? "eliminar" : "")}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                      disabled={!comentario.trim().length}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Eliminación</DialogTitle>
                      <DialogDescription>
                        ¿Seguro de eliminar esta solicitud?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogAbierto("")}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleAccion("Eliminada")}
                      >
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* <Button
              variant="link"
              onClick={() => router.push("/coordinador/aprobaciones")}
            >
              Volver a la lista de solicitudes
            </Button> */}
              </CardContent>
            </Card>

            {/* ======= Historial de Evaluación ======= */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Historial de Evaluación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historialMock.map((evt, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {idx < historialMock.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{evt.accion}</span>
                          <Badge variant="outline">{evt.responsable}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(evt.fecha).toLocaleDateString("es-PE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p>{evt.comentario}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </form>
  );
}

