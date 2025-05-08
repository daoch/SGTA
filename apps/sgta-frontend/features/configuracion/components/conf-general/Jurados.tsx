"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBackStore } from "../../store/configuracion-store";

export default function JuradosCards() {
  const { parametros, actualizarParametro, cargando } = useBackStore();

  // Buscar los parámetros por nombre
  const cantidadJuradosParam = parametros.find(
    p => p.parametroConfiguracion.nombre === "Cantidad Jurados"
  );

  const tiempoLimiteParam = parametros.find(
    p => p.parametroConfiguracion.nombre === "Tiempo Limite Jurado"
  );


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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cantidad de jurados</CardTitle>
          <CardDescription>
            Establezca el número fijo de jurados para cada proyecto de tesis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cantidad-jurados">Número de jurados</Label>
            <Input
              type="number"
              id="cantidad-jurados"
              placeholder="Ej: 3"
              defaultValue="3"
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
              defaultValue="10"
              value={tiempoLimiteParam?.valor.toString() || "10"}
              onChange={handleTiempoChange}
              disabled={cargando}
              min="1"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
