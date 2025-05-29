"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DetalleSolicitudCambioAsesor,
  UsuarioSolicitud,
} from "@/features/asesores/types/cambio-asesor/entidades";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Info,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AccionesDisponiblesSolicitud from "../components/assessor-change-request/acciones-disponibles";
import { getDetalleSolicitudCambioAsesor } from "../hooks/cambio-asesor/page";

interface SolicitudDetalleProps {
  rol: "asesor" | "coordinador" | "alumno";
  idSolicitud?: number;
  idUsuario?: number;
}

export default function SolicitudDetalle({
  rol,
  idSolicitud = 1,
  idUsuario = 1,
}: Readonly<SolicitudDetalleProps>) {
  const [solicitudData, setSolicitudData] =
    useState<DetalleSolicitudCambioAsesor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participantesWorkflow, setParticipantesWorkflow] = useState<
    UsuarioSolicitud[]
  >([]);

  useEffect(() => {
    const fetchDataDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDetalleSolicitudCambioAsesor(
          idSolicitud,
          idUsuario,
          rol,
        );
        setSolicitudData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataDetalle();
  }, []);

  useEffect(() => {
    if (solicitudData) {
      const participantes: UsuarioSolicitud[] = [
        solicitudData.solicitante,
        solicitudData.asesorNuevo,
        solicitudData.coordinador,
      ];
      setParticipantesWorkflow(participantes);
    }
  }, [solicitudData]);

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
      case "ASESOR_SALIDA":
        return "Asesor actual";
      case "ASESOR_ENTRADA":
        return "Nuevo asesor";
      default:
        return "Desconocido";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const router = useRouter();

  const handleAprobar = () => {
    console.log("Solicitud aprobada");
  };

  const handleRechazar = () => {
    console.log("Solicitud rechazada");
  };

  const handleEnviarRecordatorio = () => {
    console.log("Recordatorio enviado");
  };

  if (loading) {
    return <div className="text-center text-gray-500">Cargando...</div>;
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
                  {formatDate(solicitudData?.fechaEnvio ?? new Date())}
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
                    Asesor Sugerido
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
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={`text-xs ${getStatusColor(participante.accionSolicitud, participante.rolSolicitud)}`}
                      >
                        {getStatusLabel(
                          participante.accionSolicitud,
                          participante.rolSolicitud,
                        )}
                      </Badge>
                      {participante.fechaAccion && (
                        <span className="text-xs text-gray-500">
                          {formatDate(participante.fechaAccion)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Acciones Disponibles */}
        <AccionesDisponiblesSolicitud
          rol={rol}
          estadoCoordinador={
            solicitudData?.coordinador.accionSolicitud || "SIN_ACCION"
          }
          estadoNuevoAsesor={
            solicitudData?.asesorNuevo.accionSolicitud || "SIN_ACCION"
          }
          nombreNuevoAsesor={solicitudData?.asesorNuevo.nombres || ""}
          onAprobar={handleAprobar}
          onRechazar={handleRechazar}
          onEnviarRecordatorio={handleEnviarRecordatorio}
        />
      </div>
    </div>
  );
}
