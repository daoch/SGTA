"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { CheckCircle, Download, FileText } from "lucide-react";
import { Entregable } from "../types/entregables/entidades";


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
  const id = params?.id as string;

  const [entregable, setEntregable] = useState<Entregable | null>(null);

  useEffect(() => {
    console.log("ID del entregable:", id);
    const found = mockEntregablesData.find((e) => e.id === id);
    setEntregable(found || null);
  }, [id]);

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
          <h3 className="font-semibold">Observaciones</h3>
          <p className="text-sm text-muted-foreground">Lista de observaciones encontradas durante la revisión</p>
          <input className="w-full px-3 py-2 border rounded text-sm" placeholder="Filtrar observaciones..." />
          <div className="space-y-2">
            {mockObservaciones.map((obs, idx) => (
              <div key={idx} className="bg-green-50 border border-green-200 rounded-md p-3 space-y-1">
                <div className="flex gap-2 text-sm">
                  <p className="text-sm font-bold">Página {obs.pagina}</p>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">{obs.tipo}</Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800">{obs.estado}</Badge>
                </div>
                <p className="text-sm text-gray-800">{obs.mensaje}</p>
              </div>
            ))}
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
              <progress value={5} className="h-2" />
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
