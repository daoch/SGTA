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
        <div>
          <CardTitle className="text-red-700 text-lg">
            Observaciones del Coordinador
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            El tema tiene observaciones que se deben subsanar para continuar con
            el proceso
          </CardDescription>
          <CardContent className="space-y-4">
            {observaciones.map((obs) => (
              <Card
                key={obs.campo}
                className="border border-gray-300 bg-white rounded-md"
              >
                <CardContent className="space-y-2 pt-0">
                  <p className="text-sm font-semibold text-red-700">
                    Observación sobre el {obs.campo}
                  </p>
                  <p className="text-sm">{obs.detalle}</p>
                  <p className="text-xs text-muted-foreground italic">
                    {obs.autor} - {obs.fecha}
                  </p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </div>
      </CardHeader>
    </Card>
  );
}
