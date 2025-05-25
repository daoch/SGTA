"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useBackStore } from "../../store/configuracion-store";
import { CarreraXParametroConfiguracion } from "../../types/CarreraXParametroConfiguracion.type";

const PARAM_ACTLIMASESOR = "ActivarLimiteAsesor";
const PARAM_LIM_POR_ASESOR = "LimXasesor";

export default function AsesoresCards() {
  const { parametros, actualizarParametro, cargando } = useBackStore();
  const [localParametros, setLocalParametros] = useState<
    CarreraXParametroConfiguracion[]
  >([]);
  const [limiteHabilitado, setLimiteHabilitado] = useState<boolean>(false);
  // Estados para el parámetro "Límite por Asesor"
  const [limitePorAsesor, setLimitePorAsesor] = useState<number>(0);
  const [limiteOriginal, setLimiteOriginal] = useState<number>(0);
  const [cambiosPendientes, setCambiosPendientes] = useState<boolean>(false);

  // Cargar los parámetros al inicio
  useEffect(() => {
    setLocalParametros(parametros);

    const param = parametros.find(
      (p) => p.parametroConfiguracion.nombre === PARAM_ACTLIMASESOR,
    );
    if (param && typeof param.valor === "boolean") {
      setLimiteHabilitado(param.valor);
    }
    ///const paramLimitePorAsesor = parametros.find(p => p.parametroConfiguracion.nombre === PARAM_LIM_POR_ASESOR);
    //if (paramLimitePorAsesor) {
    //  const valor = Number(paramLimitePorAsesor.valor);
    //  setLimitePorAsesor(valor);
    //  setLimiteOriginal(valor);
    //}

    //const limitePorAsesorParam = localParametros.find(
    //  (p) => p.parametroConfiguracion.nombre === PARAM_LIM_POR_ASESOR
    //);

    const param2 = parametros.find(
      (p) => p.parametroConfiguracion.nombre === PARAM_LIM_POR_ASESOR,
    );
    if (param2 && typeof param2.valor === "number") {
      setLimitePorAsesor(param2.valor);
    }
  }, [parametros]);

  // Actualizar los parámetros locales cuando cambian en el store
  useEffect(() => {
    setLocalParametros(parametros);
  }, [parametros]);

  //  const getParametro = (nombre: string) =>
  //    localParametros.find(p => p.parametroConfiguracion.nombre === nombre);

  // Buscar los parámetros por nombre
  const activarLimAsesorParam = localParametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_ACTLIMASESOR,
  );
  const limitePorAsesorParam = localParametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_LIM_POR_ASESOR,
  );

  // Handlers para cambiar el valor
  const handleActivarLimAsesorChange = async (checked: boolean) => {
    setLimiteHabilitado(checked);

    if (activarLimAsesorParam) {
      // Actualizar el parámetro local primero
      setLocalParametros((prev) =>
        prev.map((p) =>
          p.id === activarLimAsesorParam.id ? { ...p, valor: checked } : p,
        ),
      );
      // Luego actualizar el store
      actualizarParametro(activarLimAsesorParam.id, checked);
    }
  };

  // Handler para el cambio del límite por asesor
  /*
  const handleLimitePorAsesorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = Number(e.target.value);
    setLimitePorAsesor(nuevoValor);
    setCambiosPendientes(nuevoValor !== limiteOriginal);
  };

  const handleGuardarLimitePorAsesor = () => {
    if (!limitePorAsesorParam) return;

    setLocalParametros(prev =>
      prev.map(p =>
        p.id === limitePorAsesorParam.id
          ? { ...p, valor: limitePorAsesor }
          : p
      )
    );

    actualizarParametro(limitePorAsesorParam.id, limitePorAsesor);
    setLimiteOriginal(limitePorAsesor);
    setCambiosPendientes(false);
  };
  */

  // Handler para el cambio del límite por asesor
  const handleLimitePorAsesorChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nuevoValor = Number(event.target.value);
    setLimitePorAsesor(nuevoValor);

    if (limitePorAsesorParam) {
      // Actualizar el parámetro local primero
      setLocalParametros((prev) =>
        prev.map((p) =>
          p.id === limitePorAsesorParam.id ? { ...p, valor: nuevoValor } : p,
        ),
      );
      // Luego actualizar el store
      actualizarParametro(limitePorAsesorParam.id, nuevoValor);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Límite de tesistas del asesor</CardTitle>
          <CardDescription>
            Configure los límites de tesistas que puede tener un asesor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ocultando Límite total de asesores */}
          {/*
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="limite-total">Límite total de asesores</Label>
            <Input
              type="number"
              id="limite-total"
              placeholder="Ej: 20"
              defaultValue="20"
              //value={limitePorAsesor}
              //onChange={handleLimitePorAsesorChange}
              //disabled={!limiteHabilitado || cargando}
              />
          </div>
          */}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="limite-por-asesor">Límite por asesor</Label>
            <Input
              type="number"
              id="limite-por-asesor"
              placeholder="Ej: 5"
              defaultValue="5"
              checked={!!limitePorAsesorParam?.valor}
              onChange={(e) => handleLimitePorAsesorChange(e)}
              //onChange={handleLimitePorAsesorChange}
              //value={getParametro("Limite por Asesor")?.valor || ""}
              //onChange={(e) => handleChange("Limite por Asesor", parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="habilitar-limites">
              Habilitar límites por asesor
            </Label>
            <Switch
              id="habilitar-limites"
              checked={!!activarLimAsesorParam?.valor}
              disabled={cargando}
              onCheckedChange={handleActivarLimAsesorChange}
            />
          </div>
        </CardContent>
      </Card>

      {/*Ocultando el tiempo límite para revisar*/}
      {/*
      <Card>
        <CardHeader>
          <CardTitle>Tiempo límite para revisar</CardTitle>
          <CardDescription>
            Configure el tiempo máximo que tiene un asesor para revisar un
            trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tiempo-asesor">
              Tiempo límite del asesor (días)
            </Label>
            <Input
              type="number"
              id="tiempo-asesor"
              placeholder="Ej: 7"
              defaultValue="7"
              //disabled={cargando}
              //value={getParametro("Tiempo Limite de Revisar al Asesor")?.valor || ""}
              //onChange={(e) => handleChange("Tiempo Limite de Revisar al Asesor", parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>
      */}
    </>
  );
}
