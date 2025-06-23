"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMemo } from "react";
import { CheckCircle, Download, FileText, XCircle } from "lucide-react";
import { Entregable } from "../types/entregables/entidades";
import { useAuthStore } from "@/features/auth";
import axiosInstance from "@/lib/axios/axios-instance";
import { Observacion } from "@/features/temas/types/temas/entidades";
import TabsObservacionesAlumno from "@/features/revision/components/Tabs_observaciones_alumno";

// Add the correct import for ObservacionesRevisionDTO



export default function DetalleEntregableAlumnoPage() {
  const params = useParams();
  const id = params?.DetalleEntregable;
  const searchParams = useSearchParams();
  const temaId = searchParams.get("tema");
  const [observaciones, setObservaciones] = useState<ObservacionAlumnoDTO[]>([]);
  const [detalleEntregable, setDetalleEntregable] = useState<DetalleSimplificadoEntregable | null>(null);
  console.log("Tema ID:", temaId);
  const [orden, setOrden] = useState("pagina");
  const [busqueda, setBusqueda] = useState("");
  const [filtroCorregido, setFiltroCorregido] = useState<"todos" | "corregidos" | "sin_corregir">("todos");
  const getTipoObs = (tipo: number) =>
    tipo === 1
      ? "Contenido"
      : tipo === 2
      ? "Similitud"
      : tipo === 3
      ? "Citado"
      : tipo === 4
      ? "Inteligencia Artificial"
      : "";

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
const totalObservaciones = observaciones.length;
const totalResueltas = observaciones.filter((obs) => obs.corregido).length;
const totalPendientes = totalObservaciones - totalResueltas;
const detalle = Array.isArray(detalleEntregable) ? detalleEntregable[0] : detalleEntregable;
console.log("Detalle del entregable:", detalle);
const observacionesFiltradas = useMemo(() => {
    let arr = [...observacionesConRoles];

    // Filtrado por corregido
    if (filtroCorregido === "corregidos") {
      arr = arr.filter((obs) => obs.corregido);
    } else if (filtroCorregido === "sin_corregir") {
      arr = arr.filter((obs) => !obs.corregido);
    }

    // Filtrado por búsqueda
    if (busqueda.trim() !== "") {
      arr = arr.filter((obs) => {
        const paginaInicio = obs.numeroPaginaInicio?.toString() || "";
        const paginaFin = obs.numeroPaginaFin?.toString() || "";
        const busq = busqueda.toLowerCase();

        return (
          obs.comentario?.toLowerCase().includes(busq) ||
          obs.contenido?.toLowerCase().includes(busq) ||
          getTipoObs(obs.tipoObservacionId).toLowerCase().includes(busq) ||
          paginaInicio.includes(busq) ||
          paginaFin.includes(busq) ||
          `pagina ${paginaInicio}`.includes(busq) ||
          `página ${paginaInicio}`.includes(busq) ||
          `pagina ${paginaFin}`.includes(busq) ||
          `página ${paginaFin}`.includes(busq)
        );
      });
    }

    // Ordenamiento
    switch (orden) {
      case "tipo":
        arr.sort((a, b) => a.tipoObservacionId - b.tipoObservacionId);
        break;
      case "usuario":
        arr.sort((a, b) => a.usuarioCreacionId - b.usuarioCreacionId);
        break;
      case "fecha":
        arr.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        break;
      case "pagina":
        arr.sort((a, b) => a.numeroPaginaInicio - b.numeroPaginaInicio);
        break;
      default:
        break;
    }
    return arr;
  }, [observacionesConRoles, orden, busqueda, filtroCorregido]);
  
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
        
        <TabsObservacionesAlumno
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          detalle={detalle}
          orden={orden}
          setOrden={setOrden}
          filtroCorregido={filtroCorregido}
          setFiltroCorregido={setFiltroCorregido}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />
      </div>


      <div className="w-full md:w-80 space-y-6 mt-14">       
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-2">Estado de la Revisión</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Estado:</span>
              <Badge
                className={
                  detalle?.entregableEstado === "aprobado"
                    ? "bg-blue-100 text-blue-800"
                    : detalle?.entregableEstado === "rechazado"
                    ? "bg-red-100 text-red-800"
                    : detalle?.entregableEstado === "revisado"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {detalle?.entregableEstado
                  ? detalle.entregableEstado.charAt(0).toUpperCase() + detalle.entregableEstado.slice(1)
                  : "Sin estado"}
              </Badge>
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
            <strong>Observaciones:</strong> {totalObservaciones}
            <div className="text-xs text-muted-foreground">
              {totalResueltas} resueltas / {totalPendientes} pendientes
            </div>
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
