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
import { useBackStore } from "../../store/configuracion-store";

//import { updateCarreraXParametroConfiguracion } from "../../services/configuracion-service";

export default function ModalidadRevisionCard() {
  const { parametros, actualizarParametro, cargando } = useBackStore();
   console.log("parametros", parametros);
  // Buscar los parámetros por nombre
  const turnitinParam = parametros.find(
    (p) => p.parametroConfiguracion.nombre === "Turnitin"
  );
  const antiplagioParam = parametros.find(
    (p) => p.parametroConfiguracion.nombre === "Modalidad de Revision"
  );

  // Handlers para cambiar el valor
  const handleTurnitinChange = async (checked: boolean) => {
    if (turnitinParam) {
      //await actualizarParametroBackend(turnitinParam.id, checked);
      actualizarParametro(turnitinParam.id, checked);
    }
  };

  const handleAntiplagioChange = async (checked: boolean) => {
    if (antiplagioParam) {
      //await actualizarParametroBackend(antiplagioParam.id, checked);
      actualizarParametro(antiplagioParam.id, checked);
    }
  };

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
          <Switch
            id="habilitar-turnitin"
            checked={!!turnitinParam?.valor}
            disabled={cargando}
            onCheckedChange={handleTurnitinChange}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="integracion-antiplagio">
            Activar integración con sistemas antiplagio
          </Label>
          <Switch
            id="integracion-antiplagio"
            checked={!!antiplagioParam?.valor}
            disabled={cargando}
            onCheckedChange={handleAntiplagioChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
