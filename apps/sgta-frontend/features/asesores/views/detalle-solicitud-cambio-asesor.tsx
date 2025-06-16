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
  DetalleSolicitudCambioAsesor,
  UsuarioSolicitud,
} from "@/features/asesores/types/cambio-asesor/entidades";
import { useAuth } from "@/features/auth";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Info,
  Loader2,
  User,
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AccionesDisponiblesSolicitud from "../components/assessor-change-request/acciones-disponibles";
import {
  aceptarSolicitudPorAsesor,
  aceptarSolicitudPorCoordinador,
  getDetalleSolicitudCambioAsesor,
  rechazarSolicitudPorAsesor,
  rechazarSolicitudPorCoordinador,
} from "../services/cambio-asesor-services";
import { getIdByCorreo } from "../services/perfil-services";
import { formatFecha } from "../utils/date-functions";

interface SolicitudDetalleProps {
  rol: "asesor" | "coordinador" | "alumno";
  idSolicitud: number | null;
}

export default function SolicitudDetalle({
  rol,
  idSolicitud,
}: Readonly<SolicitudDetalleProps>) {
  const { user } = useAuth();
  const hasFetchedId = useRef(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [solicitudData, setSolicitudData] =
    useState<DetalleSolicitudCambioAsesor | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingActions, setLoadingActions] = useState(false);
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
  const [rolSolicitud, setRolSolicitud] = useState<string | null>(null);
  const [accionActual, setAccionActual] = useState<string | null>(null);

  const loadUsuarioId = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const id = await getIdByCorreo(user.email);

      if (id !== null) {
        setUserId(id);
        console.log("ID del asesor obtenido:", id);
      } else {
        console.warn("No se encontró un asesor con ese correo.");
        // puedes mostrar un mensaje de advertencia aquí si deseas
      }
    } catch (error) {
      console.error("Error inesperado al obtener el ID del asesor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasFetchedId.current) {
      hasFetchedId.current = true;
      loadUsuarioId();
      fetchDataDetalle();
    }
  }, [user]);

  useEffect(() => {
    if (userId && solicitudData) {
      try {
        if (rol !== "coordinador")
          if (userId === solicitudData.coordinador.id) {
            setRolSolicitud(solicitudData.coordinador.rolSolicitud);
            setAccionActual(solicitudData.coordinador.accionSolicitud);
          } else if (userId === solicitudData.asesorNuevo.id) {
            setRolSolicitud(solicitudData.asesorNuevo.rolSolicitud);
            setAccionActual(solicitudData.asesorNuevo.accionSolicitud);
          } else if (userId === solicitudData.asesorActual.id) {
            setRolSolicitud(solicitudData.asesorActual.rolSolicitud);
            setAccionActual(solicitudData.asesorActual.accionSolicitud);
          } else {
            setRolSolicitud(null); // o "DESCONOCIDO" si prefieres
            setAccionActual("SIN_ACCION");
          }
        else {
          setRolSolicitud("DESTINATARIO");
          setAccionActual("PENDIENTE_ACCION");
        }
      } catch (error) {
        console.error("Error al determinar el rol de la solicitud:", error);
        setRolSolicitud(null);
      } finally {
        setLoadingActions(false);
      }
    }
  }, [userId, solicitudData]);

  console.log("Rol de solicitud:", rolSolicitud);

  const fetchDataDetalle = async () => {
    setLoading(true);
    setLoadingActions(true);
    setError(null);
    if (!idSolicitud) {
      setError("ID de solicitud no proporcionado");
      setLoading(false);
      return;
    }
    try {
      const data = await getDetalleSolicitudCambioAsesor(idSolicitud);
      console.log("Datos de la solicitud:", data);
      procesarParticipantesWorkflow(data);
      console.log("Datos de la solicitud obtenidos:", data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  console.log("desde la vista: ", rol);

  function procesarParticipantesWorkflow(
    solicitudData: DetalleSolicitudCambioAsesor | null,
  ) {
    console.log("Segunda validación");

    if (!solicitudData) {
      console.warn("No hay datos de solicitud disponibles");
      return;
    }

    const participantes: UsuarioSolicitud[] = [solicitudData.solicitante];

    if (solicitudData.asesorActual.accionSolicitud !== "SIN_ACCION") {
      participantes.push(solicitudData.asesorActual);
    }

    participantes.push(solicitudData.asesorNuevo);

    let coordinador = solicitudData.coordinador;

    console.log("Coordinador:", solicitudData);

    if (solicitudData.estadoGlobal === "PENDIENTE" && !coordinador) {
      coordinador = {
        id: null,
        nombres: "Pendiente de aprobación por coordinador",
        correoElectronico: solicitudData.asesorActual.correoElectronico,
        rolSolicitud: "DESTINATARIO",
        foto: null,
        accionSolicitud: "PENDIENTE_ACCION",
        fechaAccion: null,
        comentario: null,
      };

      const cordi = coordinador as UsuarioSolicitud;

      console.log("Coordinador pendiente:", cordi);

      setSolicitudData((prev) =>
        solicitudData ? { ...solicitudData, coordinador: cordi } : prev,
      );
    } else if (solicitudData.estadoGlobal === "RECHAZADA" && !coordinador) {
      coordinador = {
        id: null,
        nombres: "Sin accion",
        correoElectronico: solicitudData.asesorActual.correoElectronico,
        rolSolicitud: "DESTINATARIO",
        foto: null,
        accionSolicitud: "SIN_ACCION",
        fechaAccion: null,
        comentario: null,
      };

      const cordi = coordinador as UsuarioSolicitud;

      setSolicitudData((prev) =>
        solicitudData ? { ...solicitudData, coordinador: cordi } : prev,
      );
    } else setSolicitudData(solicitudData);

    participantes.push(coordinador);
    setParticipantesWorkflow(participantes.filter(Boolean));
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
        return "bg-green-100 text-green-800 border-green-200";
      case "RECHAZADO":
      case "RECHAZADA":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  console.log("accion: ", accionActual);

  const getStatusIcon = (estado: string, rolSolicitud: string) => {
    const baseClasses =
      "w-5 h-5 rounded border-2 flex items-center justify-center";

    // Si el rol es REMITENTE, fuerza el ícono a ser verde con CheckCircle
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
        return "Sin acción";
      default:
        return "Estado desconocido";
    }
  };

  const getRolLabel = (rolSolicitud: string): string => {
    switch (rolSolicitud.toUpperCase()) {
      case "REMITENTE":
        return "Alumno";
      case "DESTINATARIO":
        return "Coordinador";
      case "ASESOR_ACTUAL":
        return "Asesor actual";
      case "ASESOR_ENTRADA":
        return "Nuevo asesor";
      default:
        return "Desconocido";
    }
  };

  const router = useRouter();

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

  const handleVolverASolicitud = () => {
    setIsModalOpen(false);
    setModalType(null);
    setComentario("");
    setIsSuccess(false);
    setError("");
    // Refrescar la página
    window.location.reload();
  };

  const handleConfirmarAccion = async () => {
    if (!comentario.trim()) {
      setError("El comentario es obligatorio");
      return;
    }

    if (!modalType) {
      setError("No se ha definido la acción a realizar.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (!userId || !idSolicitud || !rolSolicitud) {
        setError("No se ha podido identificar al usuario.");
        return;
      }

      console.log(rolSolicitud);

      if (modalType === "aprobar") {
        if (rol === "asesor")
          await aceptarSolicitudPorAsesor(
            idSolicitud,
            rolSolicitud,
            comentario,
          );
        if (rol === "coordinador") {
          await aceptarSolicitudPorCoordinador(idSolicitud, comentario);
        }
      } else if (modalType === "rechazar") {
        if (rol === "asesor")
          await rechazarSolicitudPorAsesor(
            idSolicitud,
            rolSolicitud,
            comentario,
          );
        if (rol === "coordinador")
          await rechazarSolicitudPorCoordinador(idSolicitud, comentario);
      }
      console.log(`Solicitud ${modalType}da con comentario:`, comentario);
      setIsSuccess(true);
    } catch (err) {
      setError("Error al procesar la solicitud. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnviarRecordatorio = () => {
    console.log("Recordatorio enviado");
  };

  if (loading && loadingActions)
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando detalle...
        </span>
      </div>
    );

  if ((!user || !userId) && hasFetchedId.current === true)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <UserX className="w-16 h-16 mb-4" />
        <p className="text-base font-medium">
          No cuenta con permisos para acceder a esta página
        </p>
        <div className="mt-4">
          <Button
            onClick={loadUsuarioId}
            variant="outline"
            className="bg-white text-black border border-gray-300 hover:bg-gray-100"
          >
            Volver a intentar
          </Button>
        </div>
      </div>
    );

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
              Solicitud #{solicitudData?.solicitudId} - Detalle Completo
            </h1>
            <Badge
              className={getStatusColor(
                solicitudData?.estadoGlobal ?? "SIN_ACCION",
                "DEFAULT",
              )}
            >
              {solicitudData?.estadoGlobal}
            </Badge>
          </div>
          <p className="text-gray-600">{solicitudData?.solicitante.nombres}</p>
        </div>

        {/* Información de la Solicitud - Combined Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información de la Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Fecha de Envío
                </label>
                <p className="text-gray-900">
                  {formatFecha(solicitudData?.fechaEnvio ?? new Date())}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Título del Tema
              </label>
              <p className="text-gray-900">{solicitudData?.temaTitulo}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Motivo de la solicitud
              </label>
              <p className="text-gray-900">{solicitudData?.motivoEstudiante}</p>
            </div>

            {/* Advisor Change - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Advisor */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-3">Asesor Actual</h5>
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
                  </div>
                </div>
              </div>

              {/* New Advisor */}
              {solicitudData?.asesorNuevo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 mb-3">
                    Nuevo Asesor
                  </h5>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={solicitudData?.asesorNuevo.foto || undefined}
                      />
                      <AvatarFallback>
                        {solicitudData?.asesorNuevo.nombres.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {solicitudData?.asesorNuevo.nombres}
                      </p>
                      <p className="text-sm text-gray-600">
                        {solicitudData?.asesorNuevo.correoElectronico}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estado de Participantes - Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Flujo de aprobación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participantesWorkflow.map((participante, index) => {
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(
                        participante.accionSolicitud,
                        participante.rolSolicitud,
                      )}
                    </div>
                  </div>

                  {/* Participant Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-8 h-8">
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

                    {/* Status and Date */}
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

                    {/* Comentario en línea aparte */}
                    {participante.comentario && (
                      <div className="text-xs text-gray-500 italic mb-2">
                        Comentario: {participante.comentario}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Acciones Disponibles */}
        <AccionesDisponiblesSolicitud
          rol={rolSolicitud}
          accionActual={accionActual}
          coordinador={solicitudData?.coordinador}
          nuevoAsesor={solicitudData?.asesorNuevo}
          anteriorAsesor={solicitudData?.asesorActual}
          estadoGlobal={solicitudData?.estadoGlobal ?? "PENDIENTE"}
          handleAprobar={handleAprobar}
          handleRechazar={handleRechazar}
          onEnviarRecordatorio={handleEnviarRecordatorio}
        />

        {/* Modal de Confirmación */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent
            className="sm:max-w-md"
            onPointerDownOutside={(e) => {
              if (loading || isSuccess) {
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
                  : `${modalType === "aprobar" ? "Aprobar" : "Rechazar"} Solicitud`}
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
                    La solicitud ha sido{" "}
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
