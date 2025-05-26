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

//Parametros de configuración según la tabla parametro_configuracion en bdd
const PARAM_ACTLIMASESOR = "ActivarLimiteAsesor";
const PARAM_LIM_POR_ASESOR = "LimXasesor";
const PARAM_TIEMPO_LIMITE_REVISAR = "TiempoLimiteRevisar";


export default function AsesoresCards() {
  const { parametros, actualizarParametro, cargando } = useBackStore();
  const [localParametros, setLocalParametros] = useState<CarreraXParametroConfiguracion[]>([]);
  const [limiteHabilitado, setLimiteHabilitado] = useState<boolean>(false);
  
  // Estado para el parámetro "Limite por Asesor"
  const [limitePorAsesor, setLimitePorAsesor] = useState<number>(0); //este si
  // Estado para el parámetro "Tiempo limite revisar"
  const [tiempoLimiteRevisar, setTiempoLimiteRevisar] = useState<number>(0);

  useEffect(() => {
    setLocalParametros(parametros);
  }, [parametros]);

  // Buscar los parámetros por nombre
  const activarLimiteTesistas = parametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_ACTLIMASESOR,
  );
  const limitePorAsesores = parametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_LIM_POR_ASESOR,
  );
  const limiteDiasRevisar = parametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_TIEMPO_LIMITE_REVISAR,
  );

  // Actualizar el estado local cuando cambia el parámetro
  useEffect(() => {
    if (limitePorAsesores?.valor) {
      const limiteTesistasAsesores = (limitePorAsesores.valor) as number;
      setLimitePorAsesor(limiteTesistasAsesores);
    }
  }, [limitePorAsesores]);
  
  useEffect(() => {
    if (activarLimiteTesistas) {
      setLimiteHabilitado(Boolean(activarLimiteTesistas.valor));
    }
  }, [activarLimiteTesistas]);

  useEffect(() => {
    if (limiteDiasRevisar?.valor) {
      const limiteDias = (limiteDiasRevisar.valor) as number;
      setTiempoLimiteRevisar(limiteDias);
    }
  }, [limiteDiasRevisar]);


  //Handler para cambiar el valor del limite de asesores
  const handleLimitePorAsesorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = Number(e.target.value);
    setLimitePorAsesor(nuevoValor);
    //setCambiosPendientes(nuevoValor !== limiteOriginal);
    if (limitePorAsesores) {
      actualizarParametro(limitePorAsesores.id, nuevoValor);
    }
  };

  // Handler para activar/desactivar el límite de asesores
  const handleActivarLimAsesorChange = (checked: boolean) => {
    setLimiteHabilitado(checked);
    if (activarLimiteTesistas) {
      // Actualizar el parámetro local primero
      setLocalParametros((prev) =>
        prev.map((p) =>
          p.id === activarLimiteTesistas.id
            ? { ...p, valor: checked }
            : p
        )
      );
      // Luego actualizar el store
      actualizarParametro(activarLimiteTesistas.id, checked);
    }
  };

  //Handler para cambiar el tiempo límite de revisión
  const handleTiempoLimiteRevisarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tiempito = Number(e.target.value);
    setTiempoLimiteRevisar(tiempito);
    if (limiteDiasRevisar) {
      actualizarParametro(limiteDiasRevisar.id, tiempito);
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

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="limite-por-asesor">Límite por asesor</Label>
            <Input
              type="number"
              id="limite-por-asesor"
              placeholder="Ej: 5"
              value={limitePorAsesor}
              defaultValue="3"
              onChangeCapture={handleLimitePorAsesorChange}
              disabled={!limiteHabilitado || cargando}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="habilitar-limites">
              Habilitar límites por asesor
            </Label>
            <Switch 
              id="habilitar-limites"
              checked={limiteHabilitado}
              disabled={cargando}
              onCheckedChange={handleActivarLimAsesorChange}
            />
          </div>
        </CardContent>
      </Card>

      {/*Ocultando el tiempo límite para revisar*/}
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
              value={tiempoLimiteRevisar}
              defaultValue={"7"}
              onChange={handleTiempoLimiteRevisarChange}
              disabled={cargando}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
