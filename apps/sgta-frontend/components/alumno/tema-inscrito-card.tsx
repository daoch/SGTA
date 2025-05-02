import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Eye, Edit, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tesisData = {
  id: "1",
  titulo: "Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real",
  descripcion:
    "Este proyecto busca desarrollar un sistema de detección de objetos en tiempo real utilizando técnicas de aprendizaje profundo, específicamente redes neuronales convolucionales. Se implementarán algoritmos como YOLO y SSD para comparar su rendimiento en diferentes escenarios.",
  estudiantes: [
    { codigo: "20190123", nombre: "Carlos Mendoza" },
    { codigo: "20190456", nombre: "Pedro López" },
  ],
  fechaCreacion: "2023-10-15",
  fechaAprobacion: "2023-10-20",
  estado: "en_desarrollo",
  area: "Inteligencia Artificial",
  tipo: "inscrito",
  ciclo: "2023-2",
  asesor: "Dr. Roberto Sánchez",
  coasesores: ["Dra. Carmen Vega"],
}

const areasData = [
  "Inteligencia Artificial",
  "Desarrollo Web",
  "Ciencia de Datos",
  "Internet de las Cosas",
  "Seguridad Informática",
  "Bases de Datos",
  "Computación Gráfica",
  "Redes y Comunicaciones",
  "Procesamiento de Lenguaje Natural",
  "Realidad Virtual y Aumentada",
]

const profesoresData = [
  { id: "1", nombre: "Dr. Roberto Sánchez" },
  { id: "2", nombre: "Dra. Carmen Vega" },
  { id: "3", nombre: "Dr. Miguel Torres" },
  { id: "4", nombre: "Dra. Laura Mendoza" },
  { id: "5", nombre: "Dr. Javier Pérez" },
]

export function TemaCard() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    titulo: tesisData.titulo,
    area: tesisData.area,
    descripcion: tesisData.descripcion,
    asesor: tesisData.asesor,
    coasesores: tesisData.coasesores,
  })
  const [nuevoCoasesor, setNuevoCoasesor] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCoasesor = () => {
    if (nuevoCoasesor && !formData.coasesores.includes(nuevoCoasesor)) {
      setFormData((prev) => ({
        ...prev,
        coasesores: [...prev.coasesores, nuevoCoasesor],
      }))
      setNuevoCoasesor("")
    }
  }

  const handleRemoveCoasesor = (coasesor: string) => {
    setFormData((prev) => ({
      ...prev,
      coasesores: prev.coasesores.filter((c) => c !== coasesor),
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Tesis actualizada:", formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error al actualizar tesis:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tesisData) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No tienes una tesis inscrita</h3>
        <p className="text-muted-foreground mb-6">Puedes postular a temas libres o proponer un nuevo tema de tesis</p>
        <div className="flex justify-center gap-4">
          <Link href="/temas-libres">
            <Button variant="outline">Ver temas libres</Button>
          </Link>
          <Link href="/temas/nueva-propuesta">
            <Button className="bg-pucp-blue hover:bg-pucp-light">Proponer tema</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-2 border-pucp-blue/20 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-pucp-blue">{tesisData.titulo}</CardTitle>
            <CardDescription className="mt-1">{tesisData.area}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            En desarrollo
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Descripción</h3>
          <p className="text-sm text-muted-foreground">{tesisData.descripcion}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" /> <span>Asesor</span>
            </h3>
            <p className="text-sm">{tesisData.asesor}</p>
            {tesisData.coasesores.length > 0 && (
              <div className="mt-1">
                <h4 className="text-xs text-muted-foreground">Coasesores:</h4>
                <p className="text-sm">{tesisData.coasesores.join(", ")}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" /> <span>Tesistas</span>
            </h3>
            <ul className="space-y-1">
              {tesisData.estudiantes.map((estudiante) => (
                <li key={estudiante.codigo} className="text-sm flex justify-between">
                  <span>{estudiante.nombre}</span>
                  <span className="text-muted-foreground">{estudiante.codigo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/temas/${tesisData.id}`}>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" /> Ver detalle completo
          </Button>
        </Link>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button className="bg-pucp-blue hover:bg-pucp-light">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Editar Tesis</DialogTitle>
              <DialogDescription>Modifica la información de tu tesis</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Tema</Label>
                <Input id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área de Investigación</Label>
                <Select value={formData.area} onValueChange={(value) => handleSelectChange("area", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasData.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asesor">Asesor Principal</Label>
                <Select value={formData.asesor} onValueChange={(value) => handleSelectChange("asesor", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un asesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {profesoresData.map((profesor) => (
                      <SelectItem key={profesor.id} value={profesor.nombre}>
                        {profesor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Coasesores (Opcional)</Label>
                <div className="flex gap-2">
                  <Select onValueChange={setNuevoCoasesor} value={nuevoCoasesor}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccione un coasesor" />
                    </SelectTrigger>
                    <SelectContent>
                      {profesoresData
                        .filter((p) => p.nombre !== formData.asesor && !formData.coasesores.includes(p.nombre))
                        .map((profesor) => (
                          <SelectItem key={profesor.id} value={profesor.nombre}>
                            {profesor.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddCoasesor} variant="outline">
                    Agregar
                  </Button>
                </div>

                {formData.coasesores.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.coasesores.map((coasesor) => (
                      <Badge key={coasesor} variant="secondary" className="flex items-center gap-1">
                        {coasesor}
                        <button
                          type="button"
                          onClick={() => handleRemoveCoasesor(coasesor)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-1"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-pucp-blue hover:bg-pucp-light" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}