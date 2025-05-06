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
import {
  getAllAreasByCarreraId,
  createArea,
  deleteAreaById,
  createSubArea,
  deleteSubAreaById,
  getAllSubAreasByAreaId
} from "../../services/configuracion-service";

interface SubAreaType {
  id: number;
  nombre: string;
}

interface AreaType {
  id: number;
  nombre: string;
  descripcion: string;
  subAreas: SubAreaType[];
  idCarrera?: number;
}

export default function GeneralConfCards() {
  const [areasDialogOpen, setAreasDialogOpen] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [newAreaDescripcion, setNewAreaDescripcion] = useState("");
  const [newSubArea, setNewSubArea] = useState("");
  const [showSubAreaInput, setShowSubAreaInput] = useState<number | null>(null);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [loadingOperation, setLoadingOperation] = useState<{
    type: 'addArea' | 'addSubArea' | 'deleteArea' | 'deleteSubArea' | 'save' | null;
    id?: number;
  }>({ type: null });
  const [error, setError] = useState<string | null>(null);

  // Cargar áreas cuando se abre el modal
  useEffect(() => {
    if (areasDialogOpen) {
      loadAreas();
    }
  }, [areasDialogOpen]);

  const loadAreas = async () => {
    try {
      setLoadingOperation({ type: 'save' });
      const areasData = await getAllAreasByCarreraId(1); // TODO: Reemplazar con el ID de carrera real

      // Para cada área, cargar sus subáreas
      const areasWithSubareas = await Promise.all(
        areasData.map(async (area: any) => {
          const subareas = await getAllSubAreasByAreaId(area.id);
          return {
            id: area.id,
            nombre: area.nombre,
            descripcion: area.descripcion || '',
            subAreas: subareas.map((sub: any) => ({
              id: sub.id,
              nombre: sub.nombre
            })),
            idCarrera: area.idCarrera
          };
        })
      );

      setAreas(areasWithSubareas);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      console.error("Error al cargar áreas:", error);
    } finally {
      setLoadingOperation({ type: null });
    }
  };

  const handleAddArea = async () => {
    if (newArea.trim()) {
      try {
        setLoadingOperation({ type: 'addArea' });
        const response = await createArea({
          nombre: newArea,
          descripcion: newAreaDescripcion,
          subAreas: [],
          idCarrera: 1 // TODO: Reemplazar con el ID de carrera real
        });

        const newAreaWithSubareas = {
          id: response.id,
          nombre: response.nombre,
          descripcion: response.descripcion,
          subAreas: [],
          idCarrera: response.idCarrera
        };

        setAreas(prev => [...prev, newAreaWithSubareas]);
        setNewArea("");
        setNewAreaDescripcion("");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        console.error("Error al agregar el área:", error);
      } finally {
        setLoadingOperation({ type: null });
      }
    }
  };

  const handleDeleteArea = async (id: number) => {
    try {
      setLoadingOperation({ type: 'deleteArea', id });
      await deleteAreaById(id);
      setAreas(prev => prev.filter(area => area.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      console.error("Error al eliminar el área:", error);
    } finally {
      setLoadingOperation({ type: null });
    }
  };

  const handleAddSubArea = async (areaId: number) => {
    if (newSubArea.trim()) {
      try {
        setLoadingOperation({ type: 'addSubArea', id: areaId });
        const response = await createSubArea({
          nombre: newSubArea,
          idAreaConocimiento: areaId
        });

        setAreas(prev => prev.map(area =>
          area.id === areaId
            ? {
              ...area,
              subAreas: [...area.subAreas, {
                id: response.id,
                nombre: response.nombre
              }]
            }
            : area
        ));

        setNewSubArea("");
        setShowSubAreaInput(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        console.error("Error al agregar la subárea:", error);
      } finally {
        setLoadingOperation({ type: null });
      }
    }
  };

  const handleDeleteSubArea = async (areaId: number, subAreaId: number) => {
    try {
      setLoadingOperation({ type: 'deleteSubArea', id: areaId });
      await deleteSubAreaById(subAreaId);
      setAreas(prev => prev.map(area =>
        area.id === areaId
          ? {
            ...area,
            subAreas: area.subAreas.filter(sub => sub.id !== subAreaId)
          }
          : area
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
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
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="habilitar-subareas">
              Habilitar definición de sub-áreas
            </Label>
            <Switch id="habilitar-subareas" />
          </div>

          <Dialog open={areasDialogOpen} onOpenChange={setAreasDialogOpen}>
            <DialogTrigger asChild>
              <Button>Administrar áreas y sub-áreas</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Administrar áreas y sub-áreas</DialogTitle>
                <DialogDescription>
                  Agregue, edite o elimine áreas y sub-áreas de investigación
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <Input
                      placeholder="Nueva área de investigación"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddArea();
                        }
                      }}
                    />
                    <Button
                      onClick={handleAddArea}
                      disabled={loadingOperation.type === 'addArea' || !newArea.trim()}
                    >
                      {loadingOperation.type === 'addArea' ? "Agregando..." : "Agregar"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 items-center gap-2">
                    <Input
                      placeholder="Descripción del área"
                      value={newAreaDescripcion}
                      onChange={(e) => setNewAreaDescripcion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddArea();
                        }
                      }}
                    />
                  </div>
                </div>

                <Separator />

                <ScrollArea className="h-[300px] pr-4">
                  {areas && areas.length > 0 ? (
                    areas.map((area: AreaType) => (
                      <div key={`area-${area.id}`} className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{area.nombre}</h4>
                            {area.descripcion && (
                              <p className="text-sm text-gray-500">{area.descripcion}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowSubAreaInput(area.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Agregar Subárea
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteArea(area.id)}
                              disabled={loadingOperation.type === 'deleteArea' && loadingOperation.id === area.id}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-2 pl-4">
                          {showSubAreaInput === area.id && (
                            <div className="flex items-center gap-2 mb-2">
                              <Input
                                placeholder="Nueva subárea"
                                value={newSubArea}
                                onChange={(e) => setNewSubArea(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddSubArea(area.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddSubArea(area.id)}
                                disabled={loadingOperation.type === 'addSubArea' && loadingOperation.id === area.id || !newSubArea.trim()}
                              >
                                {loadingOperation.type === 'addSubArea' && loadingOperation.id === area.id ? "Agregando..." : "Agregar"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setShowSubAreaInput(null);
                                  setNewSubArea("");
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          )}
                          {area.subAreas && area.subAreas.length > 0 ? (
                            area.subAreas.map((subArea) => (
                              <div
                                key={`subarea-${area.id}-${subArea.id}`}
                                className="flex items-center justify-between py-1"
                              >
                                <span className="text-sm">{subArea.nombre}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSubArea(area.id, subArea.id)}
                                  disabled={loadingOperation.type === 'deleteSubArea' && loadingOperation.id === area.id}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              No hay subáreas definidas
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div key="no-areas" className="text-center py-8">
                      <p className="text-gray-500 italic">
                        No hay áreas de investigación definidas
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAreasDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          <Select defaultValue="propuesta">
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
            <Input type="date" id="fecha-limite" defaultValue="2024-06-30" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
