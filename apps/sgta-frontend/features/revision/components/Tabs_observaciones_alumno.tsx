"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import axiosInstance from "@/lib/axios/axios-instance";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
interface Props {
  observaciones: ObservacionAlumnoDTO[];
  setObservaciones: React.Dispatch<React.SetStateAction<ObservacionAlumnoDTO[]>>;
  detalle: DetalleSimplificadoEntregable | null;
  orden: string;
  setOrden: (value: string) => void;
  filtroCorregido: "todos" | "corregidos" | "sin_corregir";
  setFiltroCorregido: (value: "todos" | "corregidos" | "sin_corregir") => void;
  busqueda: string;
  setBusqueda: (value: string) => void;
}

export default function TabsObservacionesAlumno({
  observaciones,
  setObservaciones,
  detalle,
  orden,
  setOrden,
  filtroCorregido,
  setFiltroCorregido,
  busqueda,
  setBusqueda,
}: Props) {
  const getTipoObs = (tipo: number) =>
    tipo === 1 ? "Contenido" :
    tipo === 2 ? "Similitud" :
    tipo === 3 ? "Citado" :
    tipo === 4 ? "Inteligencia Artificial" : "";


  const observacionesConRoles = observaciones.map((obs) => ({
    ...obs,
    roles: obs.rolesUsuario ? obs.rolesUsuario.split(",").map((r) => Number(r.trim())) : [],
  }));
   const [pageAsesor, setPageAsesor] = useState(1);
  const [pageRevisor, setPageRevisor] = useState(1);
  const pageSize = 4;
  const obsFiltradas = observacionesConRoles
    .filter((obs) => {
      if (filtroCorregido === "corregidos") return obs.corregido;
      if (filtroCorregido === "sin_corregir") return !obs.corregido;
      return true;
    })
    .filter((obs) => {
      if (!busqueda.trim()) return true;
      const busq = busqueda.toLowerCase();
      return (
        obs.comentario?.toLowerCase().includes(busq) ||
        obs.contenido?.toLowerCase().includes(busq) ||
        getTipoObs(obs.tipoObservacionId).toLowerCase().includes(busq) ||
        obs.numeroPaginaInicio?.toString().includes(busq)
      );
    })
    .sort((a, b) => {
      if (orden === "tipo") return a.tipoObservacionId - b.tipoObservacionId;
      if (orden === "usuario") return a.usuarioCreacionId - b.usuarioCreacionId;
      if (orden === "pagina") return a.numeroPaginaInicio - b.numeroPaginaInicio;
      return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(); // default: fecha
    });

  // Filtrado para asesor/coasesor
  const obsAsesor = obsFiltradas.filter(
    (obs) => obs.roles?.includes(1) || obs.roles?.includes(5)
  );

  // Filtrado para revisor/jurado
  const obsRevisor = obsFiltradas.filter(
    (obs) => obs.roles?.includes(3) || (obs.roles?.includes(2) && !obs.roles?.includes(3))
  );

  const opcionesOrden = [
    { value: "tipo", label: "Tipo de observación" },
    { value: "usuario", label: "Profesor" },
    { value: "fecha", label: "Ultimas observaciones" },
    { value: "pagina", label: "Página" }, 
  ];
  const opcionesCorregido = [
    { value: "todos", label: "Todos" },
    { value: "corregidos", label: "Resueltos" },
    { value: "sin_corregir", label: "Por resolver" },
  ];
  const marcarComoCorregido = async (id: number, corregido: boolean) => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("Token de autenticación no disponible");
          return;
        }

        await axiosInstance.put(
          `/revision/observaciones/${id}/corregido?corregido=${corregido}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        // Opcional: actualizar la observación localmente sin recargar todas
        setObservaciones(prev =>
          prev.map(obs =>
            obs.observacionId === id ? { ...obs, corregido } : obs
          )
        );
      } catch (error) {
        console.error("Error al actualizar el estado de corregido:", error);
      }
    };
      const totalPagesAsesor = Math.ceil(obsAsesor.length / pageSize);
  const comentariosAsesor = obsAsesor.slice((pageAsesor - 1) * pageSize, pageAsesor * pageSize);
function getRolTextoAsesor(roles: number[]) {
  if (roles.includes(1) && roles.includes(5))
    return <span className="font-bold">(Asesor)</span>;
  if (roles.includes(1))
    return <span className="font-bold">(Asesor)</span>;
  if (roles.includes(5))
    return <span className="font-bold">(Coasesor)</span>;
  return null;
}

function getRolTextoRevisor(roles: number[]) {
  if (roles.includes(3))
    return <span className="font-bold">(Revisor)</span>;
  if (roles.includes(2))
    return <span className="font-bold">(Jurado)</span>;
  return null;
}
  // Paginación para Revisor
  const totalPagesRevisor = Math.ceil(obsRevisor.length / pageSize);
  const comentariosRevisor = obsRevisor.slice((pageRevisor - 1) * pageSize, pageRevisor * pageSize);
  useEffect(() => {
  setPageAsesor(1);
}, [filtroCorregido, busqueda, orden]);

useEffect(() => {
  setPageRevisor(1);
}, [filtroCorregido, busqueda, orden]);
  return (
    <Tabs defaultValue="asesor" className="w-full">
      <TabsList>
        <TabsTrigger value="asesor">Por Asesor</TabsTrigger>
        <TabsTrigger value="revisor">Por Revisor/Jurado</TabsTrigger>
      </TabsList>

      <TabsContent value="asesor">
        {/* Usa aquí mismo Card y contenido de Asesor */}
         <Card>
              <CardHeader>
                <CardTitle>Observaciones por Asesor</CardTitle>
                <CardDescription>Observaciones realizadas solo por el asesor</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filtros dentro del Card */}
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Ordenar por:</label>
                    <Select value={orden} onValueChange={setOrden}>
                      <SelectTrigger className="w-48 border rounded px-2 py-1 text-sm">
                        <SelectValue placeholder="Ordenar por..." />
                      </SelectTrigger>
                      <SelectContent>
                        {opcionesOrden.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Estado:</label>
                    <Select value={filtroCorregido} onValueChange={v => setFiltroCorregido(v as "todos" | "corregidos" | "sin_corregir")}>
                      <SelectTrigger className="w-48 border rounded px-2 py-1 text-sm">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {opcionesCorregido.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold mb-1">Buscar:</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full text-sm"
                      placeholder="Buscar por comentario, texto o tipo..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                </div>
                {/* Observaciones */}
                <div className="space-y-2">
                {comentariosAsesor.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No hay observaciones registradas.</div>
                ) : (
                  comentariosAsesor.map((obs, idx) => (
                      <div
                        key={obs.observacionId ?? idx}
                        className="bg-white border border-gray-200 rounded-md p-3"
                      >
                        <div className="flex flex-row items-stretch">
                          {/* IZQUIERDA: info de la observación */}
                          <div className="flex-1 flex flex-row gap-4">
                            <div className="flex flex-col justify-center flex-1">
                              <div className="flex gap-2 items-center">
                                <p className="text-base font-bold text-black">Página {obs.numeroPaginaInicio}</p>
                                <Badge
                                  variant="outline"
                                  className={
                                    obs.tipoObservacionId === 1
                                      ? "bg-yellow-100 text-yellow-800"
                                      : obs.tipoObservacionId === 2
                                      ? "bg-red-100 text-red-800"
                                      : obs.tipoObservacionId === 3
                                      ? "bg-blue-100 text-blue-800"
                                      : obs.tipoObservacionId === 4
                                      ? "bg-green-100 text-green-800"
                                      : ""
                                  }
                                >
                                  {obs.tipoObservacionId === 1 && "Contenido"}
                                  {obs.tipoObservacionId === 2 && "Similitud"}
                                  {obs.tipoObservacionId === 3 && "Citado"}
                                  {obs.tipoObservacionId === 4 && "Inteligencia Artificial"}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    obs.corregido
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-700"
                                  }
                                >
                                  {obs.corregido ? "Resuelto" : "No resuelto"}
                                </Badge>
                              </div>
                              <div className="mt-2">
                                <h4 className="font-bold text-xs text-black">Comentario</h4>
                                <p className="text-xs text-black">{obs.comentario}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-black mt-2">Texto comentado</h4>
                                <p className="text-xs text-black">{obs.contenido}</p>
                              </div>
                            </div>
                            {/* Comentado por alineado con comentario */}
                            <div className="flex flex-col justify-center min-w-[170px] ml-4">
                              <h4 className="font-bold text-xs text-black">Comentado por</h4>
                              <p className="text-xs text-black">
                            {obs.nombres} {obs.primerApellido} {obs.segundoApellido}
                            {" "}
                            {getRolTextoAsesor(obs.roles)}
                          </p>
                            </div>
                          </div>
                          {/* SEPARADOR */}
                          <div className="border-l border-gray-300 mx-4" />
                          {/* DERECHA: botón marcar como corregido */}
                          <div className="flex flex-col items-center justify-center min-w-[100px]">
                            <span
                                className={
                                  "text-[10px] mb-1 transition-colors " +
                                  (obs.corregido
                                    ? "text-muted-foreground hover:text-red-600"
                                    : "text-muted-foreground hover:text-green-600")
                                }
                              >
                                {obs.corregido ? "Desmarcar" : "Marcar como corregido"}
                              </span>
                              <Button
                                size="icon"
                                variant={obs.corregido ? "outline" : "ghost"}
                                className={
                                  (obs.corregido
                                    ? "text-green-600 hover:text-red-600"
                                    : "text-gray-400 hover:text-green-600") +
                                  " transition-colors"
                                }
                                title={obs.corregido ? "Desmarcar" : "Marcar como corregido"}
                                onClick={() => marcarComoCorregido(obs.observacionId!, !obs.corregido)}
                              >
                                {obs.corregido ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <XCircle className="w-5 h-5" />
                                )}
                              </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {totalPagesAsesor > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            if (pageAsesor > 1) setPageAsesor((p) => p - 1);
                          }}
                          className={pageAsesor === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPagesAsesor }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={pageAsesor === i + 1}
                            onClick={() => setPageAsesor(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            if (pageAsesor < totalPagesAsesor) setPageAsesor((p) => p + 1);
                          }}
                          className={pageAsesor === totalPagesAsesor ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
        {/* ... copiar el bloque del TabsContent asesor ... */}
      </TabsContent>

      <TabsContent value="revisor">
        <Card>
          <CardHeader>
            <CardTitle>Observaciones por Revisor/Jurado</CardTitle>
            <CardDescription>Observaciones realizadas por revisores o jurados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {comentariosRevisor.length === 0 ? (
                <div className="text-sm text-muted-foreground">No hay observaciones registradas.</div>
              ) : (
                comentariosRevisor.map((obs, idx) => (
                  <div
                    key={obs.observacionId ?? idx}
                    className="bg-white border border-gray-200 rounded-md p-3"
                  >
                    <div className="flex flex-row items-stretch">
                      {/* IZQUIERDA: info de la observación */}
                      <div className="flex-1 flex flex-row gap-4">
                        <div className="flex flex-col justify-center flex-1">
                          <div className="flex gap-2 items-center">
                            <p className="text-base font-bold text-black">Página {obs.numeroPaginaInicio}</p>
                            <Badge
                              variant="outline"
                              className={
                                obs.tipoObservacionId === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : obs.tipoObservacionId === 2
                                  ? "bg-red-100 text-red-800"
                                  : obs.tipoObservacionId === 3
                                  ? "bg-blue-100 text-blue-800"
                                  : obs.tipoObservacionId === 4
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              {obs.tipoObservacionId === 1 && "Contenido"}
                              {obs.tipoObservacionId === 2 && "Similitud"}
                              {obs.tipoObservacionId === 3 && "Citado"}
                              {obs.tipoObservacionId === 4 && "Inteligencia Artificial"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                obs.corregido
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-200 text-gray-700"
                              }
                            >
                              {obs.corregido ? "Resuelto" : "No resuelto"}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <h4 className="font-bold text-xs text-black">Comentario</h4>
                            <p className="text-xs text-black">{obs.comentario}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-black mt-2">Texto comentado</h4>
                            <p className="text-xs text-black">{obs.contenido}</p>
                          </div>
                        </div>
                        {/* Comentado por alineado con comentario */}
                        <div className="flex flex-col justify-center min-w-[170px] ml-4">
                          <h4 className="font-bold text-xs text-black">Comentado por</h4>
                          <p className="text-xs text-black">
                            {obs.nombres} {obs.primerApellido} {obs.segundoApellido}
                            {" "}
                            {getRolTextoRevisor(obs.roles)}
                          </p>
                        </div>
                      </div>
                      {/* SEPARADOR */}
                      <div className="border-l border-gray-300 mx-4" />
                      {/* DERECHA: botón marcar como corregido */}
                      <div className="flex flex-col items-center justify-center min-w-[100px]">
                        <span
                          className={
                            "text-[10px] mb-1 transition-colors " +
                            (obs.corregido
                              ? "text-muted-foreground hover:text-red-600"
                              : "text-muted-foreground hover:text-green-600")
                          }
                        >
                          {obs.corregido ? "Desmarcar" : "Marcar como corregido"}
                        </span>
                        <Button
                          size="icon"
                          variant={obs.corregido ? "outline" : "ghost"}
                          className={
                            (obs.corregido
                              ? "text-green-600 hover:text-red-600"
                              : "text-gray-400 hover:text-green-600") +
                            " transition-colors"
                          }
                          title={obs.corregido ? "Desmarcar" : "Marcar como corregido"}
                          onClick={() => marcarComoCorregido(obs.observacionId!, !obs.corregido)}
                        >
                          {obs.corregido ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
                {totalPagesRevisor > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            if (pageRevisor > 1) setPageRevisor((p) => p - 1);
                          }}
                          className={pageRevisor === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPagesRevisor }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={pageRevisor === i + 1}
                            onClick={() => setPageRevisor(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            if (pageRevisor < totalPagesRevisor) setPageRevisor((p) => p + 1);
                          }}
                          className={pageRevisor === totalPagesRevisor ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
        {/* ... copiar el bloque del TabsContent revisor ... */}
      </TabsContent>
    </Tabs>
  );
}