"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Check,
  Clock,
  Eye,
  FileText,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getResumenesSolicitudCeseTema } from "../services/cese-tema-services";

interface SolicitudCeseTemaResumen {
  solicitudId: number;
  fechaEnvio: string | Date;
  estadoGlobal: string;
  estadoAccion: string;
  temaId: number;
  temaTitulo: string;
  nombreSolicitante: string;
  correoSolicitante: string;
  nombreAsesorActual: string;
}

// Función para formatear fecha
const formatFecha = (fecha: string | Date): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Componente de filtros inline
function RequestSearchFilters({
  searchTerm,
  onSearchChange,
  statusValue,
  onStatusValueChange,
}: Readonly<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusValue: string;
  onStatusValueChange: (value: string) => void;
}>) {
  const [localTerm, setLocalTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [localTerm, onSearchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 50) value = value.slice(0, 50);
    if (/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ@. ]*$/.test(value)) {
      setLocalTerm(value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <Tabs value={statusValue} onValueChange={onStatusValueChange}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10 w-full"
          placeholder="Buscar por nombre, tema o asesor"
          value={localTerm}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

// Componente de tabla inline
function TablaSolicitudesCeseTema({
  solicitudes = [],
  formatFecha,
  getEstadoBadge,
  rutaDetalle,
}: {
  solicitudes: SolicitudCeseTemaResumen[];
  formatFecha: (fecha: string | Date) => string;
  getEstadoBadge: (estado: string) => React.ReactNode;
  rutaDetalle: string;
}) {
  if (!solicitudes || !Array.isArray(solicitudes)) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">
              Solicitud
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Alumno
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Tema</TableHead>
            <TableHead className="font-semibold text-gray-900">
              Asesor Actual
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Estado
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitudes.map((solicitud) => (
            <TableRow key={solicitud.solicitudId} className="hover:bg-gray-50">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    #{solicitud.solicitudId}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatFecha(solicitud.fechaEnvio)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {solicitud.nombreSolicitante}
                  </div>
                  <div className="text-sm text-gray-500">
                    {solicitud.correoSolicitante}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <div
                    className="font-medium text-gray-900 truncate"
                    title={solicitud.temaTitulo}
                  >
                    {solicitud.temaTitulo}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {solicitud.temaId}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">
                  {solicitud.nombreAsesorActual}
                </div>
              </TableCell>
              <TableCell>{getEstadoBadge(solicitud.estadoGlobal)}</TableCell>
              <TableCell>
                <Link href={`${rutaDetalle}${solicitud.solicitudId}`} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface ListadoSolicitudesCeseTemasProps {
  rol: "asesor" | "coordinador" | "alumno";
}

export default function ListadoSolicitudesCeseTema({
  rol,
}: ListadoSolicitudesCeseTemasProps) {
  const [busqueda, setBusqueda] = useState("");
  const [status, setStatus] = useState("all");
  const [solicitudes, setSolicitudes] = useState<SolicitudCeseTemaResumen[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true);
      setError(null);

      const rolesUsuario = [];

      switch (rol) {
        case "alumno":
          rolesUsuario.push("Tesista");
          break;
        case "asesor":
          rolesUsuario.push("Asesor");
          rolesUsuario.push("Coasesor");
          break;
      }

      try {
        const data = await getResumenesSolicitudCeseTema(rolesUsuario);
        setSolicitudes(data);
      } catch (err) {
        setError("No se pudieron cargar las solicitudes.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [rol]);

  const descripcion =
    rol === "alumno"
      ? "Revise el estado de sus solicitudes de cese de tema enviadas."
      : "Revise y gestione las solicitudes de cese de tema enviadas por los alumnos.";

  const getRutaDetalle = (rol: string): string => {
    switch (rol) {
      case "alumno":
        return "/alumno/solicitudes-academicas/cese-tema/mis-solicitudes/detalle/";
      case "coordinador":
        return "/coordinador/temas/cese-tema/detalle/";
      case "asesor":
        return "/asesor/temas/cese-tema/detalle/";
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
          solicitud.correoSolicitante.toLowerCase().includes(busquedaLower),
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

  if (loading && solicitudes.length === 0)
    return (
      <div className="flex items-center justify-center h-screen w-full flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-lg">
          Cargando solicitudes...
        </span>
      </div>
    );

  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-500">Cargando solicitudes...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Solicitudes de Cese de Tema
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
        />
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

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
          <TablaSolicitudesCeseTema
            solicitudes={solicitudesFiltradas || []}
            formatFecha={formatFecha}
            getEstadoBadge={getEstadoBadge}
            rutaDetalle={rutaDetalle}
          />
        </div>
      )}
    </div>
  );
}
