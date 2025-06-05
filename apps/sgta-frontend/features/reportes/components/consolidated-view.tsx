"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getEntregablesConCriterios } from "../services/report-services";
import { EntregableCriteriosDetalle } from "../types/Entregable.type";

const formatEstadoEntrega = (estado: string): { text: string; color: string } => {
  const estados = {
    enviado_a_tiempo: {
      text: "Enviado a tiempo",
      color: "bg-green-100 text-green-800",
    },
    enviado_tarde: {
      text: "Enviado tarde",
      color: "bg-yellow-100 text-yellow-800",
    },
    no_enviado: {
      text: "No enviado",
      color: "bg-red-100 text-red-800",
    },
    en_revision: {
      text: "En revisión",
      color: "bg-blue-100 text-blue-800",
    },
    calificado: {
      text: "Calificado",
      color: "bg-purple-100 text-purple-800",
    },
  };

  return estados[estado as keyof typeof estados] || {
    text: estado.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    color: "bg-gray-100 text-gray-800",
  };
};

interface ConsolidatedViewProps {
  studentId: number;
}

export function ConsolidatedView({ studentId }: ConsolidatedViewProps) {
  const [deliverables, setDeliverables] = useState<EntregableCriteriosDetalle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliverables = async () => {
      if (!studentId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getEntregablesConCriterios(studentId);
        setDeliverables(data);
      } catch (err) {
        console.error("Error fetching deliverables:", err);
        setError("Error al cargar los entregables");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverables();
  }, [studentId]);

  if (loading) {
    return <div className="text-center py-8">Cargando entregables...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!deliverables.length) {
    return <div className="text-center py-8 text-gray-500">No hay entregables disponibles</div>;
  }

  return (
    <div className="space-y-6">
      {deliverables.map((deliverable) => {
        const estadoFormat = formatEstadoEntrega(deliverable.estadoEntrega);
        
        return (
          <Card key={deliverable.entregableId} className="border-l-4 border-l-primary">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium">{deliverable.entregableNombre}</h3>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${estadoFormat.color}`}
                >
                  {estadoFormat.text}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Fecha de entrega: {deliverable.fechaEnvio ? new Date(deliverable.fechaEnvio).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'No enviado'}
              </p>
              
              <div className="space-y-4">
                {/* Criterios de evaluación */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Criterios de evaluación:</h4>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7">
                        <Eye className="h-4 w-4 mr-1" /> Ver criterios
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {deliverable.entregableNombre} - Criterios de evaluación
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        {deliverable.criterios.map((criterio) => (
                          <div key={criterio.criterioId} className="border-b pb-3">
                            <h5 className="text-sm font-medium">{criterio.criterioNombre}</h5>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-600">Nota máxima: {criterio.notaMaxima}</span>
                              {criterio.notaCriterio !== null && (
                                <span className="text-sm font-medium">
                                  Nota obtenida: {criterio.notaCriterio}
                                </span>
                              )}
                            </div>
                            {criterio.notaCriterio !== null && (
                              <div className="mt-2">
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                  <div
                                    className={`h-2 rounded-full ${
                                      (criterio.notaCriterio / criterio.notaMaxima) < 0.55
                                        ? "bg-red-500"
                                        : (criterio.notaCriterio / criterio.notaMaxima) < 0.7
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }`}
                                    style={{ width: `${(criterio.notaCriterio / criterio.notaMaxima) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Nota global */}
                {deliverable.notaGlobal !== null && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Calificación Global:</h4>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full max-w-[200px] rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            deliverable.notaGlobal < 11
                              ? "bg-red-500"
                              : deliverable.notaGlobal < 14
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(deliverable.notaGlobal / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{deliverable.notaGlobal}/20</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 