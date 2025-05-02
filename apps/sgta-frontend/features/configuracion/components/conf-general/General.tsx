
import { useState } from "react"
import {
    PresentationIcon as PresentationScreen,
    X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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

export default function GeneralConfCards() {

    const [areasDialogOpen, setAreasDialogOpen] = useState(false)
    const [areas, setAreas] = useState([
        {
            id: 1,
            nombre: "Inteligencia Artificial",
            subAreas: ["Machine Learning", "Visión Computacional", "Procesamiento de Lenguaje Natural"],
        },
        {
            id: 2,
            nombre: "Desarrollo de Software",
            subAreas: ["Metodologías Ágiles", "Arquitectura de Software", "Pruebas de Software"],
        },
        {
            id: 3,
            nombre: "Redes y Seguridad",
            subAreas: ["Ciberseguridad", "Redes Inalámbricas", "Seguridad de la Información"],
        },
    ])
    const [newArea, setNewArea] = useState("")
    const [newSubArea, setNewSubArea] = useState("")
    const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null)

    const handleAddArea = () => {
        if (newArea.trim()) {
            setAreas([...areas, { id: Date.now(), nombre: newArea, subAreas: [] }])
            setNewArea("")
        }
    }

    const handleAddSubArea = () => {
        if (newSubArea.trim() && selectedAreaId) {
            setAreas(
                areas.map((area) =>
                    area.id === selectedAreaId ? { ...area, subAreas: [...area.subAreas, newSubArea] } : area,
                ),
            )
            setNewSubArea("")
        }
    }

    const handleDeleteArea = (id: number) => {
        setAreas(areas.filter((area) => area.id !== id))
    }

    const handleDeleteSubArea = (areaId: number, subAreaIndex: number) => {
        setAreas(
            areas.map((area) =>
                area.id === areaId ? { ...area, subAreas: area.subAreas.filter((_, index) => index !== subAreaIndex) } : area,
            ),
        )
    }

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
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <Input
                    placeholder="Nueva área de investigación"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                  <Button onClick={handleAddArea}>Agregar</Button>
                </div>

                <Separator />

                <ScrollArea className="h-[300px] pr-4">
                  {areas.map((area) => (
                    <div key={area.id} className="mb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{area.nombre}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteArea(area.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-2 pl-4">
                        <div className="grid grid-cols-[1fr_auto] items-center gap-2 mb-2">
                          <Input
                            placeholder="Nueva sub-área"
                            value={selectedAreaId === area.id ? newSubArea : ""}
                            onChange={(e) => {
                              setSelectedAreaId(area.id);
                              setNewSubArea(e.target.value);
                            }}
                            onFocus={() => setSelectedAreaId(area.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddSubArea}
                          >
                            Agregar
                          </Button>
                        </div>

                        {area.subAreas.map((subArea, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-1"
                          >
                            <span className="text-sm">{subArea}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                handleDeleteSubArea(area.id, index)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <DialogFooter>
                <Button onClick={() => setAreasDialogOpen(false)}>
                  Guardar cambios
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
