import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useBackStore } from "../../store/configuracion-store";
import {
  getAllAreasByCarreraId,
  createArea,
  deleteAreaById,
  createSubArea,
  deleteSubAreaById,
  getAllSubAreasByAreaId,
} from "../../services/configuracion-service";
import { AreaResponse, AreaType, SubAreaType } from "../../types/Area.type";
import Link from "next/link";

//Nombres de los parámetros de configuración según la tabla parametro_configuracion en bdd
const PARAM_MODALIDAD_DELIMITACION_TEMA = "modalidad_delimitacion_tema";
const PARAM_FECHA_LIMITE_ASESOR = "fecha_limite_asesor";



export default function GeneralConfCards() {
  const { parametros, actualizarParametro, cargando } = useBackStore();
  const [areasDialogOpen, setAreasDialogOpen] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [newAreaDescripcion, setNewAreaDescripcion] = useState("");
  const [newSubArea, setNewSubArea] = useState("");
  const [showSubAreaInput, setShowSubAreaInput] = useState<number | null>(null);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [fechaLimite, setFechaLimite] = useState<string>("");
  const [loadingOperation, setLoadingOperation] = useState<{
    type:
    | "addArea"
    | "addSubArea"
    | "deleteArea"
    | "deleteSubArea"
    | "save"
    | null;
    id?: number;
  }>({ type: null });

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

  // Cargar áreas cuando se abre el modal
  useEffect(() => {
    if (areasDialogOpen) {
      loadAreas();
    }
  }, [areasDialogOpen]);

  const loadAreas = async () => {
    try {
      setLoadingOperation({ type: "save" });
      const areasData = await getAllAreasByCarreraId(1); // TODO: Reemplazar con el ID de carrera real

      // Para cada área, cargar sus subáreas
      const areasWithSubareas = await Promise.all(
        areasData.map(async (area: AreaResponse) => {
          const subareas = await getAllSubAreasByAreaId(area.id);
          return {
            id: area.id,
            nombre: area.nombre,
            descripcion: area.descripcion || "",
            subAreas: subareas.map((sub: SubAreaType) => ({
              id: sub.id,
              nombre: sub.nombre,
            })),
            idCarrera: area.idCarrera,
          };
        }),
      );

      setAreas(areasWithSubareas);
    } catch (error) {
      console.error("Error al cargar áreas:", error);
    } finally {
      setLoadingOperation({ type: null });
    }
  };

  const handleAddArea = async () => {
    if (newArea.trim()) {
      try {
        setLoadingOperation({ type: "addArea" });
        const response = await createArea({
          nombre: newArea,
          activo: true,
          descripcion: newAreaDescripcion,
          subAreas: [],
          idCarrera: 1, // TODO: Reemplazar con el ID de carrera real
        });

        const newAreaWithSubareas = {
          id: response.id,
          nombre: response.nombre,
          descripcion: response.descripcion,
          subAreas: [],
          idCarrera: response.idCarrera,
        };

        setAreas((prev) => [...prev, newAreaWithSubareas]);
        setNewArea("");
        setNewAreaDescripcion("");
      } catch (error) {
        console.error("Error al agregar el área:", error);
      } finally {
        setLoadingOperation({ type: null });
      }
    }
  };

  const handleDeleteArea = async (id: number) => {
    try {
      setLoadingOperation({ type: "deleteArea", id });
      await deleteAreaById(id);
      setAreas((prev) => prev.filter((area) => area.id !== id));
    } catch (error) {
      console.error("Error al eliminar el área:", error);
    } finally {
      setLoadingOperation({ type: null });
    }
  };

  const handleAddSubArea = async (areaId: number) => {
    if (newSubArea.trim()) {
      try {
        setLoadingOperation({ type: "addSubArea", id: areaId });
        const response = await createSubArea({
          nombre: newSubArea,
          idAreaConocimiento: areaId,
        });

        setAreas((prev) =>
          prev.map((area) =>
            area.id === areaId
              ? {
                ...area,
                subAreas: [
                  ...area.subAreas,
                  {
                    id: response.id,
                    nombre: response.nombre,
                  },
                ],
              }
              : area,
          ),
        );

        setNewSubArea("");
        setShowSubAreaInput(null);
      } catch (error) {
        console.error("Error al agregar la subárea:", error);
      } finally {
        setLoadingOperation({ type: null });
      }
    }
  };

  const handleDeleteSubArea = async (areaId: number, subAreaId: number) => {
    try {
      setLoadingOperation({ type: "deleteSubArea", id: areaId });
      await deleteSubAreaById(subAreaId);
      setAreas((prev) =>
        prev.map((area) =>
          area.id === areaId
            ? {
              ...area,
              subAreas: area.subAreas.filter((sub) => sub.id !== subAreaId),
            }
            : area,
        ),
      );
    } catch (error) {
      console.error("Error al eliminar la subárea:", error);
    } finally {
      setLoadingOperation({ type: null });
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
