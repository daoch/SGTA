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
        <CardTitle>
          ¿Deseas automatizar la distribución de exposiciones?
        </CardTitle>
        <CardDescription>
          Esta planificación toma en cuenta diversos factores como el tipo de
          dedicación del miembro de docente, área de especialidad, entre otros
          factores.
        </CardDescription>
        <div className="flex justify-end">
          <Button className="w-fit">
            <Bot />
            Generar Distribución
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CardSugerenciaDistribucion;
