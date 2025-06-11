"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import { CheckCircle, Download, FileText, XCircle } from "lucide-react";
import { Entregable } from "../types/entregables/entidades";
import { useAuthStore } from "@/features/auth";
import axiosInstance from "@/lib/axios/axios-instance";
import { Observacion } from "@/features/temas/types/temas/entidades";
// Add the correct import for ObservacionesRevisionDTO



const mockEntregablesData: Entregable[] = [
  {
    id: "E0",
    nombre: "Cronograma",
    fechaLimite: "22/03/2025",
    fechaEntrega: "18/03/2025",
    estado: "Revisado",
  },
  {
      id: "E1",
      nombre: "Revisión de Avances",
      fechaLimite: "29/03/2025",
      fechaEntrega: "28/03/2025",
      estado: "Revisado",
  },
  {
      id: "E2",
      nombre: "Implementación Completa",
      fechaLimite: "26/04/2025",
      fechaEntrega: "25/04/2025",
      estado: "En Revisión",
  },
  {
      id: "E3",
      nombre: "Validación",
      fechaLimite: "17/05/2025",
      fechaEntrega: "No entregado",
      estado: "Pendiente",
  },
  {
      id: "E4",
      nombre: "Informe Final",
      fechaLimite: "20/06/2025",
      fechaEntrega: "No entregado",
      estado: "Pendiente",
  },
  {
      id: "E5",
      nombre: "Informe Parcial",
      fechaLimite: "20/06/2025",
      fechaEntrega: "19/06/2025",
      estado: "Entregado",
  },
];

const mockObservaciones = [
  {
    pagina: 3,
    tipo: "Contenido",
    estado: "Resuelto",
    mensaje: "Excelente revisión de literatura. Muy completa y bien estructurada.",
  },
  {
    pagina: 7,
    tipo: "Citado",
    estado: "Resuelto",
    mensaje: "Referencias correctamente citadas según normas APA.",
  },
  {
    pagina: 10,
    tipo: "Contenido",
    estado: "Resuelto",
    mensaje: "Buena conexión entre conceptos teóricos y el problema de investigación.",
  },
];

export default function DetalleEntregableAlumnoPage() {
  const params = useParams();
  const id = params?.DetalleEntregable;
  const searchParams = useSearchParams();
  const temaId = searchParams.get("tema");
  const [observaciones, setObservaciones] = useState([]);
  const [obsTab, setObsTab] = useState<"asesor" | "revisor">("asesor");
  const [detalleEntregable, setDetalleEntregable] = useState<DetalleSimplificadoEntregable | null>(null);
  const [entregable, setEntregable] = useState<Entregable | null>(null);
  console.log("Tema ID:", temaId);
  useEffect(() => {
    console.log("ID del entregable:", id);
    const found = mockEntregablesData.find((e) => e.id === id);
    setEntregable(found || null);
  }, [id]);
  useEffect(() => {
    const fetchObservaciones = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        } 
        console.log("token:", idToken);
        if (!id || !temaId) {
          console.error("Faltan parámetros para la consulta de observaciones");
          return;
        }
        const response = await axiosInstance.get(
        `/revision/tema/${temaId}/entregable/${id}/observaciones`, // <-- corregido
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
        
        setObservaciones(response.data);
        console.log("Observaciones cargadas:", response.data);
      } catch (error) {
        console.error("Error al cargar las observaciones:", error);
      }
    };
    fetchObservaciones();
    
  }, [id, temaId]);
  useEffect(() => {
    const fetchDetalleEntregable = async () => {
      try {
        const { idToken } = useAuthStore.getState();
        if (!idToken) {
          console.error("No authentication token available");
          return;
        }
        if (!id || !temaId) {
          console.error("Faltan parámetros para la consulta del detalle del entregable");
          return;
        }
        const response = await axiosInstance.get(
          `/entregable/${id}/tema/${temaId}/detalle-simplificado`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json", // Nuevo header
            },
          }
        );
        setDetalleEntregable(response.data);
        console.log("Detalle simplificado cargado:", response.data);
      } catch (error) {
        console.error("Error al cargar el detalle simplificado:", error);
      }
    };
    fetchDetalleEntregable();
  }, [id, temaId]);
  const observacionesConRoles = observaciones.map((obs: ObservacionAlumnoDTO) => ({
  ...obs,
  roles: obs.rolesUsuario
    ? obs.rolesUsuario.split(",").map((r) => Number(r.trim()))
    : [],
}));
const obsAsesor = observacionesConRoles.filter(
  (obs) => obs.roles.length === 1 && obs.roles[0] === 1
);
const obsRevisor = observacionesConRoles.filter(
  (obs) => obs.roles.includes(4) || (obs.roles.length > 1 || (obs.roles.length === 1 && obs.roles[0] !== 1))
);
const detalle = Array.isArray(detalleEntregable) ? detalleEntregable[0] : detalleEntregable;
  /*if (!entregable && id) return <div className="p-6">No se encontró el entregable con ID: {id}</div>;
  if (!entregable) return <div className="p-6">{id}</div>;*/

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start p-6">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Detalles de Revisión</h1>
        </div>

        <div className="bg-white border rounded-md p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
            <div>
              {detalle && (
                <>
                  <h2 className="font-bold text-lg text-gray-900">{detalle.entregableDescripcion}</h2>
                  <p className="text-sm text-muted-foreground">Entrega:</p>
                  <div className="text-sm text-black">
                    <strong>{detalle.entregableNombre}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Descargar
            </Button>
          </div>

          <hr className="border-gray-200" />

          <div className="text-sm space-y-1">
            <h2 className="font-semibold text-gray-900">Cronograma</h2>
            <div className="flex gap-12 text-muted-foreground">
              <div>
                <span>
                  <strong>Fecha de Entrega:</strong>{" "}
                  {detalle?.entregableFechaEnvio
                    ? new Date(detalle.entregableFechaEnvio).toLocaleDateString()
                    : "No disponible"}
                </span>
              </div>
              <div>
                <span>
                  <strong>Fecha Límite:</strong>{" "}
                  {detalle?.entregableFechaFin
                    ? new Date(detalle.entregableFechaFin).toLocaleDateString()
                    : "No disponible"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={obsTab} onValueChange={(v) => setObsTab(v as "asesor" | "revisor")} className="w-full">
          <TabsList>
            <TabsTrigger value="asesor">Por Asesor</TabsTrigger>
            <TabsTrigger value="revisor">Por Revisor/Jurado</TabsTrigger>
          </TabsList>
          <TabsContent value="asesor">
            <Card>
              <CardHeader>
                <CardTitle>Observaciones por Asesor</CardTitle>
                <CardDescription>Observaciones realizadas solo por el asesor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {obsAsesor.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No hay observaciones registradas.</div>
                  ) : (
                    obsAsesor.map((obs, idx) => (
                      <div
                        key={obs.observacionId ?? idx}
                        className="bg-white border border-gray-200 rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between items-center">
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
                          </div>
                          <div className="text-xs text-black font-semibold text-right">
                            <div>Comentado por:</div>
                            <div>
                              {obs.nombres} {obs.primerApellido} {obs.segundoApellido} (Asesor)
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-black mt-2">Comentario</h4>
                          <p className="text-xs text-black">{obs.comentario}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-black mt-2">Texto comentado</h4>
                          <p className="text-xs text-black">{obs.contenido}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revisor">
            <Card>
              <CardHeader>
                <CardTitle>Observaciones por Revisor/Jurado</CardTitle>
                <CardDescription>Observaciones realizadas por revisores o jurados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {obsRevisor.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No hay observaciones registradas.</div>
                  ) : (
                    obsRevisor.map((obs, idx) => (
                      <div
                        key={obs.observacionId ?? idx}
                        className="bg-white border border-gray-200 rounded-md p-3 space-y-2"
                      >
                        <div className="flex justify-between items-center">
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
                          </div>
                          <div className="text-xs text-black font-semibold text-right">
                            <div>Comentado por:</div>
                            <div>
                              {obs.nombres} {obs.primerApellido} {obs.segundoApellido}{" "}
                              {obs.roles.includes(2)
                                ? "(Jurado)"
                                : obs.roles.includes(4)
                                ? "(Revisor)"
                                : obs.roles.length === 1 && obs.roles[0] === 1
                                ? "(Asesor)"
                                : ""}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-black mt-2">Comentario</h4>
                          <p className="text-xs text-black">{obs.comentario}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-black mt-2">Texto comentado</h4>
                          <p className="text-xs text-black">{obs.contenido}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>


      <div className="w-full md:w-80 space-y-6 mt-14">       
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-2">Estado de la Revisión</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Estado:</span>
              <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
            </div>
            <div>
              <span className="block mb-1">Detección de Plagio</span>
             {/*  <progress value={1} className="h-2" />
              <span className="text-xs text-muted-foreground mt-1 block">Nivel aceptable de plagio</span>
              */}
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span>Formato válido:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className={`flex items-center justify-between ${detalle?.entregableFechaEnvio && detalle?.entregableFechaFin && new Date(detalle.entregableFechaEnvio) > new Date(detalle.entregableFechaFin) ? "text-red-700" : "text-green-700"}`}>
              <span>
                Entrega a tiempo:
              </span>
              {detalle?.entregableFechaEnvio && detalle?.entregableFechaFin && new Date(detalle.entregableFechaEnvio) > new Date(detalle.entregableFechaFin) ? (
                <XCircle className="w-4 h-4 text-red-700" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-700" />
              )}
            </div>
            <div className="text-sm mt-2">
              <strong>Observaciones:</strong> {observaciones.length}
              <div className="text-xs text-muted-foreground"> 0 resueltas / {observaciones.length} pendientes</div>
            </div>
          </div>
        </div>

        {/*<div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-2">Historial de Revisión</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>Inicio de revisión</strong><br /> 5/4/2025 - Dr. Roberto Sánchez
            </li>
            <li>
              <strong>Detección de plagio completada</strong><br /> 6/4/2025 - Dr. Roberto Sánchez
            </li>
            <li>
              <strong>Revisión completada</strong><br /> 6/4/2025 - Dr. Roberto Sánchez
            </li>
            <li>
              <strong>Entregable aprobado</strong><br /> 6/4/2025 - Dr. Roberto Sánchez
            </li>
          </ul>
        </div>
         */}
      </div>
    </div>
  );
}
