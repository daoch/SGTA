"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CheckCircle, Download, FileText } from "lucide-react";
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
                <h2 className="font-semibold text-gray-900">Documento</h2>
                <p className="text-sm text-muted-foreground">Información del documento bajo revisión</p>
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
                <span><strong>Fecha de Entrega:</strong>18/03/2025</span>
              </div>
              <div>
                <span><strong>Fecha Límite:</strong>22/03/2025</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-md p-4 space-y-3">
          <h3 className="font-semibold text-black">Observaciones</h3>
          <p className="text-sm text-muted-foreground">Lista de observaciones encontradas durante la revisión</p>
          <input className="w-full px-3 py-2 border rounded text-sm" placeholder="Filtrar observaciones..." />
          <div className="space-y-2">
            {observaciones.length === 0 ? (
              <div className="text-sm text-muted-foreground">No hay observaciones registradas.</div>
            ) : (
              observaciones.map((obs: ObservacionAlumnoDTO, idx: number) => (
                <div
                  key={obs.observacionId ?? idx}
                  className="bg-white border border-gray-200 rounded-md p-3 space-y-2"
                >
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
        </div>
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
              <progress value={1} className="h-2" />
              <span className="text-xs text-muted-foreground mt-1 block">Nivel aceptable de plagio</span>
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span>Formato válido:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span>Entrega a tiempo:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span>Citado correcto:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-sm mt-2">
              <strong>Observaciones:</strong> 3
              <div className="text-xs text-muted-foreground">3 resueltas / 0 pendientes</div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-md p-4">
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
      </div>
    </div>
  );
}
