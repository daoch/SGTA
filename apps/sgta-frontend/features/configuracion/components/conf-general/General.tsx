import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBackStore } from "../../store/configuracion-store";

//Nombres de los parámetros de configuración según la tabla parametro_configuracion en bdd
const PARAM_MODALIDAD_DELIMITACION_TEMA = "modalidad_delimitacion_tema";
const PARAM_FECHA_LIMITE_ASESOR = "fecha_limite_asesor";

export default function GeneralConfCards() {
  const { parametros, actualizarParametro, cargando } = useBackStore();
  const [fechaLimite, setFechaLimite] = useState<string>("");

  // Buscar los parámetros por nombre
  const modalidadDelimitacionParam = parametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_MODALIDAD_DELIMITACION_TEMA,
  );
  const fechaLimiteParam = parametros.find(
    (p) => p.parametroConfiguracion.nombre === PARAM_FECHA_LIMITE_ASESOR,
  );

  // Actualizar el estado local cuando cambia el parámetro
  useEffect(() => {
    if (fechaLimiteParam?.valor) {
      const fechaFormateada = (fechaLimiteParam.valor as string).split("T")[0];
      setFechaLimite(fechaFormateada);
    }
  }, [fechaLimiteParam]);

  // Handler para cambiar la modalidad de delimitación
  const handleModalidadDelimitacionChange = (value: string) => {
    if (modalidadDelimitacionParam) {
      actualizarParametro(modalidadDelimitacionParam.id, value);
    }
  };

  // Handler para cambiar la fecha límite
  const handleFechaLimiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFechaLimite(newDate); // Actualizar estado local

    if (fechaLimiteParam) {
      const formattedDate = `${newDate}T00:00:00Z`;
      actualizarParametro(fechaLimiteParam.id, formattedDate);
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Áreas/Sub Áreas de investigación</CardTitle>
          <CardDescription>
            Configure las áreas y sub-áreas de investigación disponibles para
            los proyectos de tesis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/*<div className="flex items-center justify-between space-x-2">
            <Label htmlFor="habilitar-subareas">
              Habilitar definición de sub-áreas
            </Label>
            <Switch id="habilitar-subareas" />
          </div>*/}

          <Link href="/coordinador/configuracion/areas">
            <Button>Administrar áreas y sub-áreas</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modo de delimitación de tema</CardTitle>
          <CardDescription>
            Defina cómo se delimitarán los temas de tesis en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={(modalidadDelimitacionParam?.valor as string) || "propuesta"}
            onValueChange={handleModalidadDelimitacionChange}
            disabled={cargando}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un modo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="propuesta">
                Propuesta de tema tentativo por alumnos
              </SelectItem>
              <SelectItem value="asesores">Definidos por asesores</SelectItem>
              <SelectItem value="ambos">Ambos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fecha límite solicitud cambio de asesor</CardTitle>
          <CardDescription>
            Establezca la fecha máxima para solicitar cambios de asesor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fecha-limite">Fecha límite</Label>
            <Input
              type="date"
              id="fecha-limite"
              value={fechaLimite}
              onChange={handleFechaLimiteChange}
              disabled={cargando}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
