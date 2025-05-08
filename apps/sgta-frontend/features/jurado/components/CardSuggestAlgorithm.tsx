"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
const CardSugerenciaDistribucion: React.FC = () => {
  return (
    <Card className="border-2 border-gray-300">
      <CardHeader>
        <CardTitle>
          ¿Deseas automatizar la distribución de exposiciones?
        </CardTitle>
        <div className="flex flex-col xl:flex-row justify-between">
          <CardDescription className="w-full xl:w-2/3 ">
            Esta planificación toma en cuenta diversos factores como el tipo de
            dedicación del miembro de docente, área de especialidad, entre otros
            factores.
          </CardDescription>
          <Button
            className="w-full xl:w-auto"
            style={{ background: "#042354" }}
          >
            Generar Distribución
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CardSugerenciaDistribucion;
