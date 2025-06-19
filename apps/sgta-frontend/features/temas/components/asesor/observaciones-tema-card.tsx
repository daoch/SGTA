"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Observacion } from "@/features/temas/types/temas/entidades";
import { AlertCircle } from "lucide-react";

interface ObservacionesCardProps {
  observaciones: Observacion[];
}

export function ObservacionesCard({ observaciones }: ObservacionesCardProps) {
  return (
    <Card className="mt-4 border border-gray-300 shadow-sm rounded-xl">
      <CardHeader className="flex flex-row gap-2 items-start">
        <AlertCircle className="text-red-500 mt-1" />
        <div className="w-full">
          <CardTitle className="text-red-700 text-lg">
            Observaciones del Coordinador
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            El tema tiene observaciones que se deben subsanar para continuar con
            el proceso
          </CardDescription>
          <CardContent className="px-0 max-w-full mt-2 space-y-4">
            {observaciones.map((obs) => (
              <div
                key={obs.solicitud_id}
                className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
              >
                <div className="font-semibold text-sm text-red-700 mb-1">
                  {obs.tipo_solicitud}
                </div>
                <div className="text-sm mb-2">{obs.descripcion}</div>
                <div className="italic text-xs text-gray-500">
                  {obs.usuarios.map((r, index) => (
                    <div key={index}>
                      {r.nombres} {r.primer_apellido}{" "}
                    </div>
                  ))}
                  {new Date(obs.fecha_creacion).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </CardHeader>
    </Card>
  );
}
