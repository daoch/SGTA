"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { obtenerHistorialTema } from "../../types/temas/data";
import { Historial } from "../../types/temas/entidades";

interface PropsHistorialTema {
  idTema?: number;
}

export default function HistorialTemaCard({ idTema }: PropsHistorialTema) {
  const [loading, setLoading] = useState(false);
  const [historialTema, setHistorialTema] = useState<Historial[]>([]);
  useEffect(() => {
    const obtenerHistorial = async (temaId: number) => {
      try {
        setLoading(true);
        const historial = await obtenerHistorialTema(temaId);
        setHistorialTema(historial);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial del tema:", error);
      }
    };
    if (idTema) {
      obtenerHistorial(idTema);
    }
  }, [idTema]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Cambios</CardTitle>
        <CardDescription>
          Registro cronológico de modificaciones y aprobaciones del tema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <p className="text-gray-500">Cargando historial...</p>
          ) : historialTema.length === 0 ? (
            <p className="text-gray-500">
              {" "}
              No se encontraron cambios en el tema
            </p>
          ) : (
            historialTema.map((historial: Historial, index: number) => (
              <div key={historial.id} className="relative pl-6 pb-6">
                {/* Línea vertical */}
                {index < historialTema.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                {/* Punto */}
                <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full bg-[#0F1A3A] flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                </div>
                {/* Contenido del historial */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {new Date(historial.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{historial.descripcionCambio}</span>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md border text-sm">
                    <div className="space-y-1 ">
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">Titulo:</span>
                        <span className="text-muted-foreground">
                          {historial.titulo}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">
                          Objetivo:
                        </span>
                        <span className="text-muted-foreground">
                          {historial.objetivos}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">
                          Descripción:
                        </span>
                        <span className="text-muted-foreground">
                          {historial.resumen}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">
                          Subáreas:
                        </span>
                        <span className="text-muted-foreground">
                          {historial.subareasSnapshot
                            .split(";")
                            .map((p) => p.split("|")[1])
                            .join(", ")}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">
                          Asesores/Coasesores:
                        </span>
                        <span className="text-muted-foreground">
                          {historial.asesoresSnapshot
                            .split(";")
                            .map((p) => p.split("|")[1])
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
