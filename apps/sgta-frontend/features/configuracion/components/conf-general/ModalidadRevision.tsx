"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
//import { updateCarreraXParametroConfiguracion } from "../../services/configuracion-service";

export default function ModalidadRevisionCard() {
  // const [turnitinEnabled, setTurnitinEnabled] = useState(true);
  // const [antiplagioEnabled, setAntiplagioEnabled] = useState(true);

  // const handleToggle = async (parametro: string, value: boolean) => {
  //   try {
  //     await updateCarreraXParametroConfiguracion({
  //       id: parametro === "turnitin" ? 1 : 2, 
  //       valor: value.toString(),
  //       carreraId: 1, 
  //       parametroConfiguracionId: parametro === "turnitin" ? 1 : 2, 
  //     });
  //     if (parametro === "turnitin") {
  //       setTurnitinEnabled(value);
  //     } else {
  //       setAntiplagioEnabled(value);
  //     }
  //   } catch (error) {
  //     console.error("Error al actualizar el parámetro:", error);
  //   }
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modalidad de revisión</CardTitle>
        <CardDescription>
          Configure las opciones de revisión y detección de plagio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="habilitar-turnitin">
            Habilitar subida de informes Turnitin
          </Label>
          <Switch id="habilitar-turnitin" />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="integracion-antiplagio">
            Activar integración con sistemas antiplagio
          </Label>
          <Switch id="integracion-antiplagio"
          />
        </div>
      </CardContent>
    </Card>
  );
}
