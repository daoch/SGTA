"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, FolderSync } from "lucide-react";
import React from "react";
import { usePlanificationStore } from "../../store/use-planificacion-store";
import { toast } from "sonner";

const CardSugerenciaDistribucion: React.FC = () => {
  const {
    desasignarTodosLosTemas,
    temasAsignados,
    temasSinAsignar,
    generarDistribucionAutomatica,
  } = usePlanificationStore();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs">
          ¿Deseas automatizar la distribución de exposiciones?
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Esta planificación toma en cuenta diversos factores como el tipo de
          dedicación del miembro de docente, área de especialidad, entre otros
          factores.
        </CardDescription>
        <div className="flex justify-between">
          <Button
            className="w-fit"
            disabled={Object.keys(temasAsignados).length === 0}
            variant="destructive"
            onClick={() => desasignarTodosLosTemas()}
          >
            <FolderSync />
            Regresar Temas
          </Button>
          <Button
            className="w-fit"
            disabled={temasSinAsignar.length === 0}
            variant="default"
            onClick={async () => {
              try {
                await generarDistribucionAutomatica();
                toast.success(
                  "Distribución automática generada correctamente.",
                );
                console.log("Distribución automática generada correctamente.");
              } catch (error) {
                toast.error("Error al generar la distribución automática.");
                console.error(
                  "Error al generar la distribución automática:",
                  error,
                );
              }
            }}
          >
            <Bot />
            Generar Distribución
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default React.memo(CardSugerenciaDistribucion);
