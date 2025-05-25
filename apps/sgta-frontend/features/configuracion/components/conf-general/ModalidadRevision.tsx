"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBackStore } from "../../store/configuracion-store";
import { useEffect, useState } from "react";
import { CarreraXParametroConfiguracion } from "../../types/CarreraXParametroConfiguracion.type";

const PARAM_TURNITIN = "turnitin";
const PARAM_ANTIPLAGIO = "antiplagio";

export default function ModalidadRevisionCard() {
  const { parametros, actualizarParametro, cargando } = useBackStore();
  const [localParametros, setLocalParametros] = useState<
    CarreraXParametroConfiguracion[]
  >([]);

  useEffect(() => {
    setLocalParametros(parametros);
  }, [parametros]);

  // Buscar los parámetros por nombre
  const turnitinParam = localParametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_TURNITIN,
  );
  const antiplagioParam = localParametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_ANTIPLAGIO,
  );

  // Handlers para cambiar el valor
  const handleTurnitinChange = async (checked: boolean) => {
    if (turnitinParam) {
      // Actualizar el parámetro local primero
      setLocalParametros((prev) =>
        prev.map((p) =>
          p.id === turnitinParam.id ? { ...p, valor: checked } : p,
        ),
      );
      // Luego actualizar el store
      actualizarParametro(turnitinParam.id, checked);
    }
  };

  const handleAntiplagioChange = async (checked: boolean) => {
    if (antiplagioParam) {
      // Actualizar el parámetro local primero
      setLocalParametros((prev) =>
        prev.map((p) =>
          p.id === antiplagioParam.id ? { ...p, valor: checked } : p,
        ),
      );
      // Luego actualizar el store
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
