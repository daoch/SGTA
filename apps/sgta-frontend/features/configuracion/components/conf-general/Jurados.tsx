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
import { useEffect, useState } from "react";
import { useBackStore } from "../../store/configuracion-store";

const PARAM_CANT_TESIS_X_JURADO = "CantidadTesisXJurado";

export default function JuradosCards() {
  const { parametros, actualizarParametro, cargando } = useBackStore();

  // Buscar los parámetros por nombre
  const cantidadJuradosParam = parametros.find(
    (p) => p.parametroConfiguracion.nombre === "Cantidad Jurados",
  );

  const tiempoLimiteParam = parametros.find(
    (p) => p.parametroConfiguracion.nombre === "Tiempo Limite Jurado",
  );

  // Estado para el parámetro "Cantidad limite de tesis ppor jurado"
  const [cantLimiteTesisJurado, setCantLimiteTesisJurado] = useState<number>(0);
  const cantidadLimiteTesisJurado = parametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_CANT_TESIS_X_JURADO,
  );

  useEffect(() => {
    if (cantidadLimiteTesisJurado?.valor) {
      const limiteTesis = (cantidadLimiteTesisJurado.valor) as number;
      setCantLimiteTesisJurado(limiteTesis);
    }
  }, [cantidadLimiteTesisJurado]);


  // Handlers para cambios
  const handleCantidadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //Convierte valor ingresado a numero
    const value = parseInt(e.target.value);
    //valida que tengamos valor obtenido en la busqueda del parametro cantidad juraods
    if (cantidadJuradosParam) {
      //Actualiza el store
      await actualizarParametro(cantidadJuradosParam.id, value);
    }
  };

  const handleTiempoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (tiempoLimiteParam) {
      await actualizarParametro(tiempoLimiteParam.id, value);
    }
  };


  //Handler para cambiar cantidad de tesis por jurado
  const handleCantidadTesisJuradoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limTesis = Number(e.target.value);
    setCantLimiteTesisJurado(limTesis);
    if (cantidadLimiteTesisJurado) {
      actualizarParametro(cantidadLimiteTesisJurado.id, limTesis);
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cantidad de jurados por Tesis</CardTitle>
          <CardDescription>
            Establezca el número fijo de jurados que debe tener cada presentación de tesis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cantidad-jurados">Número de jurados</Label>
            <Input
              type="number"
              id="cantidad-jurados"
              placeholder="Ej: 3"
              //defaultValue="3"
              //cantidadJuradosParam?.valor: Accede al valor del parámetro del store
              //|| "3": Fallback seguro si el valor es null/undefined
              value={cantidadJuradosParam?.valor.toString() || "3"}
              //Cuando se ingresa un nuevo numero se actualiza el store
              onChange={handleCantidadChange}
              //Deshabilita el input durante operaciones asíncronas
              disabled={cargando}
              //No permite números menores a 1
              min="1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tiempo límite para revisar</CardTitle>
          <CardDescription>
            Configure el tiempo máximo que tiene un jurado para revisar un
            trabajo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tiempo-jurado">
              Tiempo límite del jurado (días)
            </Label>
            <Input
              type="number"
              id="tiempo-jurado"
              placeholder="Ej: 10"
              //defaultValue="10"
              value={tiempoLimiteParam?.valor.toString() || "10"}
              onChange={handleTiempoChange}
              disabled={cargando}
              min="1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cantidad de trabajos por Jurado</CardTitle>
          <CardDescription>
            Configure el número máximo de tesis que puede tener asignadas un jurado de forma simultánea
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="tiempo-jurado">
              Número máximo de trabajos por jurado
            </Label>
            <Input
              type="number"
              id="tiempo-jurado"
              placeholder="Ej: 10"
              value={cantLimiteTesisJurado}
              onChange={handleCantidadTesisJuradoChange}
              disabled={cargando}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
