"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth";
import { Check, Clock, FileText, Loader2, UserX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import RequestSearchFilters from "../components/assessor-change-request/search-filters-request-list";
import TablaSolicitudesCambioAsesor from "../components/assessor-change-request/table-solicitudes-cambio";
import { getResumenesSolicitudCambioAsesor } from "../hooks/cambio-asesor/page";
import { getIdByCorreo } from "../hooks/perfil/perfil-apis";
import { SolicitudCambioAsesorResumen } from "../types/cambio-asesor/entidades";
import { formatFecha } from "../utils/date-functions";

interface ListadoSolicitudesCambioAsesorProps {
  rol: "asesor" | "coordinador" | "alumno";
}

export default function ListadoSolicitudesCambioAsesor(
  { rol }: ListadoSolicitudesCambioAsesorProps = {
    rol: "coordinador", // Default role for the component
  },
) {
  const { user } = useAuth();
  const hasFetchedId = useRef(false);
  const [busqueda, setBusqueda] = useState("");
  const [status, setStatus] = useState("all");
  const [solicitudes, setSolicitudes] = useState<
    SolicitudCambioAsesorResumen[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const getRolSolicitud = (rol: string): string => {
    switch (rol) {
      case "alumno":
        return "REMITENTE";
      case "coordinador":
        return "DESTINATARIO";
      case "asesor":
        return "ASESOR_ENTRADA";
      default:
        return "/";
    }
  };

  const rolSolicitud = getRolSolicitud(rol);

  const loadUsuarioId = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const id = await getIdByCorreo(user.email);

      if (id !== null) {
        setIdUsuario(id);
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
    }
  }, [user]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (!idUsuario || !rolSolicitud) return;
      setLoading(true);
      setError(null);

      try {
        const data = await getResumenesSolicitudCambioAsesor(
          idUsuario,
          rolSolicitud,
        );
        setSolicitudes(data);
        console.log(idUsuario, rolSolicitud);
      } catch (err) {
        setError("No se pudieron cargar las solicitudes.");
      } finally {
        setLoading(false);
      }
    };

    if (idUsuario && rolSolicitud) {
      fetchSolicitudes();
    }
  }, [idUsuario, rolSolicitud]);

  const clearFullNameEmailPage = () => {
    setBusqueda("");
  };

  const descripcion =
    rol === "alumno"
      ? "Revise el estado de sus solicitudes de cambio de asesor enviadas."
      : "Revise y gestione las solicitudes de cambio de asesor enviadas por los alumnos.";

  const getRutaDetalle = (rol: string): string => {
    switch (rol) {
      case "alumno":
        return "/alumno/solicitudes-academicas/cambio-asesor/mis-solicitudes/detalle/";
      case "coordinador":
        return "/coordinador/asesores/cambio-asesor/detalle/";
      case "asesor":
        return "/asesor/asesores/cambio-asesor/detalle/";
      default:
        return "/";
    }
  };

  const rutaDetalle = getRutaDetalle(rol);

  const solicitudesFiltradas = useMemo(() => {
    let filtradas = solicitudes;

    if (status !== "all") {
      if (status === "pending") {
        filtradas = filtradas.filter(
          (solicitud) => solicitud.estadoGlobal === "PENDIENTE",
        );
      } else if (status === "answered") {
        filtradas = filtradas.filter(
          (solicitud) =>
            solicitud.estadoGlobal === "ACEPTADA" ||
            solicitud.estadoGlobal === "RECHAZADA",
        );
      } else if (status === "approved") {
        filtradas = filtradas.filter(
          (solicitud) => solicitud.estadoGlobal === "ACEPTADA",
        );
      } else if (status === "rejected") {
        filtradas = filtradas.filter(
          (solicitud) => solicitud.estadoGlobal === "RECHAZADA",
        );
      }
    }

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      filtradas = filtradas.filter(
        (solicitud) =>
          solicitud.nombreSolicitante.toLowerCase().includes(busquedaLower) ||
          solicitud.temaTitulo.toLowerCase().includes(busquedaLower) ||
          solicitud.nombreAsesorActual.toLowerCase().includes(busquedaLower) ||
          solicitud.nombreAsesorNuevo.toLowerCase().includes(busquedaLower),
      );
    }

    return filtradas;
  }, [solicitudes, status, busqueda]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "ACEPTADA":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <Check className="w-3 h-3 mr-1" />
            Aceptada
          </Badge>
        );
      case "RECHAZADA":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <X className="w-3 h-3 mr-1" />
            Rechazada
          </Badge>
        );
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando solicitudes...
        </span>
      </div>
    );

  if ((!user || !idUsuario) && hasFetchedId.current === true)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-500">
        <UserX className="w-16 h-16 mb-4" />
        <p className="text-base font-medium">Usuario no encontrado</p>
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Solicitudes de Cambio de Asesor
        </h1>
        <p className="text-muted-foreground max-w-3xl">{descripcion}</p>
      </div>

      {/* Filters Tab */}
      <Card className="p-4 shadow-sm">
        <RequestSearchFilters
          searchTerm={busqueda}
          onSearchChange={setBusqueda}
          statusValue={status}
          onStatusValueChange={setStatus}
          clearTerm={clearFullNameEmailPage}
        />
      </Card>
      {/* Solicitudes Table */}
      {solicitudesFiltradas.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay solicitudes registradas
            </h3>
            <p className="text-gray-500">
              {busqueda
                ? "No se encontraron solicitudes que coincidan con tu búsqueda."
                : "No hay solicitudes en este estado actualmente."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <TablaSolicitudesCambioAsesor
            solicitudes={solicitudesFiltradas}
            formatFecha={formatFecha}
            getEstadoBadge={getEstadoBadge}
            rutaDetalle={rutaDetalle}
          />
        </div>
      )}
    </div>
  );
}
