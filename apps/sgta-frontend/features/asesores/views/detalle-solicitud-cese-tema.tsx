"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Loader2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDetalleSolicitudCeseTema } from "../services/cese-tema-services";

// Interfaces
export interface UsuarioSolicitud {
  id: number | null;
  nombres: string;
  correoElectronico: string;
  rolSolicitud: string;
  foto: string | null;
  accionSolicitud: string;
  fechaAccion: string | Date | null;
  comentario: string | null;
}

export interface DetalleSolicitudCeseTema {
  solicitudId: number;
  fechaEnvio: string | Date;
  estadoGlobal: string;
  motivoEstudiante: string;
  temaId: number;
  temaTitulo: string;
  solicitante: UsuarioSolicitud;
  asesorActual: UsuarioSolicitud;
  coordinador: UsuarioSolicitud | null;
  fechaResolucion: string | Date | null;
}

interface SolicitudCeseDetalleProps {
  idSolicitud: number;
}

export default function SolicitudCeseDetalle({
  idSolicitud,
}: Readonly<SolicitudCeseDetalleProps>) {
  const [solicitudData, setSolicitudData] =
    useState<DetalleSolicitudCeseTema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantesWorkflow, setParticipantesWorkflow] = useState<
    UsuarioSolicitud[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"aprobar" | "rechazar" | null>(
    null,
  );
  const [comentario, setComentario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchDataDetalle();
  }, [idSolicitud]);

  const fetchDataDetalle = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDetalleSolicitudCeseTema(idSolicitud);
      procesarParticipantesWorkflow(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  function procesarParticipantesWorkflow(
    solicitudData: DetalleSolicitudCeseTema,
  ) {
    const participantes: UsuarioSolicitud[] = [solicitudData.solicitante];
    let coordinador = solicitudData.coordinador;

    // Procesar según el estado de la solicitud
    switch (solicitudData.estadoGlobal) {
      case "APROBACION_DIRECTA":
        // No hay workflow de participantes, solo el alumno
        setSolicitudData({
          ...solicitudData,
          coordinador: null,
        });
        setParticipantesWorkflow([solicitudData.solicitante]);
        return;

      case "PENDIENTE":
        // Agregar coordinador ficticio
        coordinador = {
          id: null,
          nombres: "Coordinador de Carrera",
          correoElectronico: "coordinador@universidad.edu",
          rolSolicitud: "DESTINATARIO",
          foto: null,
          accionSolicitud: "PENDIENTE_ACCION",
          fechaAccion: null,
          comentario: null,
        };
        participantes.push(coordinador);
        break;

      case "RECHAZADA":
        // El coordinador que rechazó viene del API
        if (solicitudData.coordinador) {
          participantes.push(solicitudData.coordinador);
        } else {
          // Coordinador por defecto si no viene del API
          coordinador = {
            id: 3,
            nombres: "Dr. Ana Patricia Vásquez",
            correoElectronico: "ana.vasquez@universidad.edu",
            rolSolicitud: "DESTINATARIO",
            foto: null,
            accionSolicitud: "RECHAZADO",
            fechaAccion: "2024-01-16T14:20:00Z",
            comentario:
              "La solicitud no cumple con los requisitos establecidos para el cese de tema. Se requiere mayor justificación académica.",
          };
          participantes.push(coordinador);
        }
        break;

      default:
        coordinador = null;
    }

    setSolicitudData({
      ...solicitudData,
      coordinador,
    });
    setParticipantesWorkflow(participantes);
  }

  const getStatusColor = (estado: string, rolSolicitud: string) => {
    if (rolSolicitud === "REMITENTE") {
      return "bg-green-100 text-green-800 border-green-200";
    }

    switch (estado.toUpperCase()) {
      case "PENDIENTE":
      case "PENDIENTE_ACCION":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "APROBADO":
      case "APROBADA":
      case "APROBACION_DIRECTA":
        return "bg-green-100 text-green-800 border-green-200";
      case "RECHAZADO":
      case "RECHAZADA":
        return "bg-red-100 text-red-800 border-red-200";
      case "ENVIADO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (estado: string, rolSolicitud: string) => {
    const baseClasses =
      "w-5 h-5 rounded border-2 flex items-center justify-center";

    if (rolSolicitud === "REMITENTE") {
      return (
        <div className="w-5 h-5 rounded border-2 bg-green-100 text-green-800 border-green-200 flex items-center justify-center">
          <CheckCircle className="w-3 h-3" />
        </div>
      );
    }

    const colorClasses = getStatusColor(estado, rolSolicitud);
    let Icon = AlertCircle;

    switch (estado.toUpperCase()) {
      case "APROBADA":
      case "APROBADO":
        Icon = CheckCircle;
        break;
      case "PENDIENTE":
      case "PENDIENTE_ACCION":
        Icon = Clock;
        break;
      case "SIN_ACCION":
        Icon = Info;
        break;
      case "RECHAZADA":
      case "RECHAZADO":
        Icon = AlertCircle;
        break;
      case "ENVIADO":
        Icon = CheckCircle;
        break;
    }

    return (
      <div className={`${baseClasses} ${colorClasses}`}>
        <Icon className="w-3 h-3" />
      </div>
    );
  };

  const getStatusLabel = (estado: string, rolSolicitud: string) => {
    if (rolSolicitud === "REMITENTE") {
      return "Solicitud enviada";
    }

    switch (estado.toUpperCase()) {
      case "PENDIENTE_ACCION":
        return "Pendiente de aprobación";
      case "APROBADO":
        return "Aprobada";
      case "RECHAZADO":
        return "Rechazada";
      case "SIN_ACCION":
        return "Sin acción requerida";
      case "ENVIADO":
        return "Enviado";
      default:
        return "Estado desconocido";
    }
  };

  const getRolLabel = (rolSolicitud: string): string => {
    switch (rolSolicitud.toUpperCase()) {
      case "REMITENTE":
        return "Estudiante";
      case "DESTINATARIO":
        return "Coordinador";
      case "ASESOR_ACTUAL":
        return "Asesor actual";
      default:
        return "Participante";
    }
  };

  const formatFecha = (fecha: string | Date | null): string => {
    if (!fecha) return "No disponible";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoGlobalLabel = (estado: string): string => {
    switch (estado.toUpperCase()) {
      case "APROBACION_DIRECTA":
        return "Aprobación Directa";
      case "PENDIENTE":
        return "Pendiente";
      case "RECHAZADA":
        return "Rechazada";
      default:
        return estado;
    }
  };

  const handleAprobar = () => {
    setModalType("aprobar");
    setIsModalOpen(true);
    setComentario("");
    setIsSuccess(false);
    setError("");
  };

  const handleRechazar = () => {
    setModalType("rechazar");
    setIsModalOpen(true);
    setComentario("");
    setIsSuccess(false);
    setError("");
  };

  const handleCloseModal = () => {
    if (!isLoading && !isSuccess) {
      setIsModalOpen(false);
      setModalType(null);
      setComentario("");
      setError("");
    }
  };

  const handleConfirmarAccion = async () => {
    if (!comentario.trim()) {
      setError("El comentario es obligatorio");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`Solicitud ${modalType}da con comentario:`, comentario);
      setIsSuccess(true);
    } catch (err) {
      setError("Error al procesar la solicitud. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolverASolicitud = () => {
    setIsModalOpen(false);
    setModalType(null);
    setComentario("");
    setIsSuccess(false);
    setError("");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando detalle de solicitud...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
        <p className="text-base font-medium">Error al cargar la solicitud</p>
        <p className="text-sm text-gray-400 mt-2">{error}</p>
        <div className="mt-4">
          <Button onClick={fetchDataDetalle} variant="outline">
            Volver a intentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header con navegación */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </div>

        {/* Título y estado */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Solicitud de Cese de Tema #{solicitudData?.solicitudId}
            </h1>
            <Badge
              className={getStatusColor(
                solicitudData?.estadoGlobal ?? "PENDIENTE",
                "DEFAULT",
              )}
            >
              {getEstadoGlobalLabel(solicitudData?.estadoGlobal ?? "PENDIENTE")}
            </Badge>
          </div>
          <p className="text-gray-600">{solicitudData?.solicitante.nombres}</p>
        </div>

        {/* Información de la Solicitud */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información de la Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Fecha de Envío
                </label>
                <p className="text-gray-900">
                  {formatFecha(solicitudData?.fechaEnvio ?? new Date())}
                </p>
              </div>
              {solicitudData?.fechaResolucion && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Fecha de Resolución
                  </label>
                  <p className="text-gray-900">
                    {formatFecha(solicitudData.fechaResolucion)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Título del Tema Cesado
              </label>
              <p className="text-gray-900 font-medium">
                {solicitudData?.temaTitulo}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Motivo del Cese
              </label>
              <p className="text-gray-900 leading-relaxed">
                {solicitudData?.motivoEstudiante}
              </p>
            </div>

            {/* Información del Asesor Actual */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-3">
                Asesor del Tema (antes del cese)
              </h5>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={solicitudData?.asesorActual.foto || undefined}
                    alt={solicitudData?.asesorActual.nombres}
                    className="w-10 h-10"
                  />
                  <AvatarFallback>
                    {solicitudData?.asesorActual.nombres.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {solicitudData?.asesorActual.nombres}
                  </p>
                  <p className="text-sm text-gray-600">
                    {solicitudData?.asesorActual.correoElectronico}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Este era el asesor con quien el estudiante llevaba el tema
                    antes de solicitar el cese
                  </p>
                </div>
              </div>
            </div>

            {/* Mensaje especial para aprobación directa */}
            {solicitudData?.estadoGlobal === "APROBACION_DIRECTA" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h5 className="font-medium text-green-800">
                    Aprobación Directa
                  </h5>
                </div>
                <p className="text-green-700 text-sm">
                  Esta solicitud fue aprobada directamente porque el tema aún no
                  estaba en etapas avanzadas de desarrollo. No requirió un
                  proceso de aprobación adicional.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flujo de Aprobación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {solicitudData?.estadoGlobal === "APROBACION_DIRECTA"
                ? "Información del Envío"
                : "Flujo de Aprobación"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participantesWorkflow.map((participante, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(
                    participante.accionSolicitud,
                    participante.rolSolicitud,
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={participante.foto || undefined}
                        alt={participante.nombres}
                      />
                      <AvatarFallback className="text-xs">
                        {participante.nombres.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {participante.nombres}
                      </p>
                      <p className="text-xs text-gray-600">
                        {getRolLabel(participante.rolSolicitud)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={`text-xs ${getStatusColor(participante.accionSolicitud, participante.rolSolicitud)}`}
                    >
                      {getStatusLabel(
                        participante.accionSolicitud,
                        participante.rolSolicitud,
                      )}
                    </Badge>
                    {participante.fechaAccion && (
                      <div className="text-xs text-gray-500">
                        {formatFecha(participante.fechaAccion)}
                      </div>
                    )}
                  </div>

                  {participante.comentario && (
                    <div className="text-xs text-gray-500 italic mb-2">
                      Comentario: {participante.comentario}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Acciones Disponibles - Solo para coordinadores en estado PENDIENTE */}
        {solicitudData?.estadoGlobal === "PENDIENTE" && (
          <Card>
            <CardHeader>
              <CardTitle>Acciones Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={handleAprobar}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar Solicitud
                </Button>
                <Button onClick={handleRechazar} variant="destructive">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Rechazar Solicitud
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Confirmación */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={(e) => {
              if (isLoading || isSuccess) {
                e.preventDefault();
              }
            }}
            onEscapeKeyDown={(e) => {
              if (isLoading || isSuccess) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {isSuccess
                  ? "¡Acción Completada!"
                  : `${modalType === "aprobar" ? "Aprobar" : "Rechazar"} Solicitud de Cese`}
              </DialogTitle>
            </DialogHeader>

            {!isSuccess ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="comentario">
                    Comentario{" "}
                    {modalType === "aprobar" ? "de aprobación" : "de rechazo"} *
                  </Label>
                  <Textarea
                    id="comentario"
                    placeholder={`Ingrese el motivo ${modalType === "aprobar" ? "de la aprobación" : "del rechazo"}...`}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    disabled={isLoading}
                    className="mt-2"
                    rows={4}
                  />
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmarAccion}
                    disabled={isLoading || !comentario.trim()}
                    className={`flex-1 ${
                      modalType === "aprobar"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      `${modalType === "aprobar" ? "Aprobar" : "Rechazar"} Solicitud`
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Solicitud{" "}
                    {modalType === "aprobar" ? "aprobada" : "rechazada"}{" "}
                    exitosamente
                  </p>
                  <p className="text-gray-600 mt-2">
                    La solicitud de cese de tema ha sido{" "}
                    {modalType === "aprobar" ? "aprobada" : "rechazada"} y se
                    han notificado a todos los participantes.
                  </p>
                </div>

                <Button
                  onClick={handleVolverASolicitud}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Volver a la Solicitud
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
