"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot } from "lucide-react";
import React from "react";
const CardSugerenciaDistribucion: React.FC = () => {
  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle className="text-xs">
          ¿Deseas automatizar la distribución de exposiciones?
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Esta planificación toma en cuenta diversos factores como el tipo de
          dedicación del miembro de docente, área de especialidad, entre otros
          factores.
        </CardDescription>
        <div className="flex justify-end">
          <Button className="w-fit" disabled={true}>
            <Bot />
            Generar Distribución
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CardSugerenciaDistribucion;
