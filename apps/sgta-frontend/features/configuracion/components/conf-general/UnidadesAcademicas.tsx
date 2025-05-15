"use client"

import {
    Edit,
    MoreVertical,
    Plus,
    Trash2
} from "lucide-react"
import { useState } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

// Tipos de datos
interface Carrera {
  id: number
  nombre: string
  codigo: string
  correoEncargado: string
  activa: boolean
}

interface UnidadAcademica {
  id: number
  nombre: string
  descripcion: string
  carreras: Carrera[]
}

export default function UnidadesAcademicas() {
  // Estado para las unidades académicas
  const [unidadesAcademicas, setUnidadesAcademicas] = useState<UnidadAcademica[]>([
    {
      id: 1,
      nombre: "Facultad de Ingeniería",
      descripcion: "Facultad dedicada a las carreras de ingeniería y tecnología",
      carreras: [
        {
          id: 101,
          nombre: "Ingeniería de Software",
          codigo: "ISW",
          correoEncargado: "director.isw@universidad.edu",
          activa: true,
        },
        {
          id: 102,
          nombre: "Ingeniería Civil",
          codigo: "ICV",
          correoEncargado: "director.icv@universidad.edu",
          activa: true,
        },
        {
          id: 103,
          nombre: "Ingeniería Industrial",
          codigo: "IND",
          correoEncargado: "director.ind@universidad.edu",
          activa: false,
        },
      ],
    },
    {
      id: 2,
      nombre: "Facultad de Ciencias",
      descripcion: "Facultad dedicada a las ciencias básicas y aplicadas",
      carreras: [
        {
          id: 201,
          nombre: "Licenciatura en Matemáticas",
          codigo: "MAT",
          correoEncargado: "director.mat@universidad.edu",
          activa: true,
        },
        {
          id: 202,
          nombre: "Licenciatura en Física",
          codigo: "FIS",
          correoEncargado: "director.fis@universidad.edu",
          activa: true,
        },
      ],
    },
  ])

  // Estado para diálogos
  const [unidadDialogOpen, setUnidadDialogOpen] = useState(false)
  const [carreraDialogOpen, setCarreraDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteCarreraDialogOpen, setDeleteCarreraDialogOpen] = useState(false)

  // Estado para edición
  const [editingUnidad, setEditingUnidad] = useState<UnidadAcademica | null>(null)
  const [editingCarrera, setEditingCarrera] = useState<Carrera | null>(null)
  const [selectedUnidadId, setSelectedUnidadId] = useState<number | null>(null)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [carreraToDelete, setCarreraToDelete] = useState<{ unidadId: number; carreraId: number } | null>(null)

  // Estado para formularios
  const [formUnidad, setFormUnidad] = useState({
    nombre: "",
    descripcion: "",
  })

  const [formCarrera, setFormCarrera] = useState({
    nombre: "",
    codigo: "",
    correoEncargado: "",
    activa: true,
  })

  // Manejadores para unidades académicas
  const handleOpenUnidadDialog = (unidad?: UnidadAcademica) => {
    if (unidad) {
      setEditingUnidad(unidad)
      setFormUnidad({
        nombre: unidad.nombre,
        descripcion: unidad.descripcion,
      })
    } else {
      setEditingUnidad(null)
      setFormUnidad({
        nombre: "",
        descripcion: "",
      })
    }
    setUnidadDialogOpen(true)
  }

  const handleSaveUnidad = () => {
    if (editingUnidad) {
      // Editar unidad existente
      setUnidadesAcademicas(
        unidadesAcademicas.map((unidad) =>
          unidad.id === editingUnidad.id
            ? { ...unidad, nombre: formUnidad.nombre, descripcion: formUnidad.descripcion }
            : unidad,
        ),
      )
    } else {
      // Crear nueva unidad
      const newUnidad: UnidadAcademica = {
        id: Date.now(),
        nombre: formUnidad.nombre,
        descripcion: formUnidad.descripcion,
        carreras: [],
      }
      setUnidadesAcademicas([...unidadesAcademicas, newUnidad])
    }
    setUnidadDialogOpen(false)
  }

  const handleDeleteUnidad = (id: number) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUnidad = () => {
    if (itemToDelete) {
      setUnidadesAcademicas(unidadesAcademicas.filter((unidad) => unidad.id !== itemToDelete))
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Manejadores para carreras
  const handleOpenCarreraDialog = (unidadId: number, carrera?: Carrera) => {
    setSelectedUnidadId(unidadId)
    if (carrera) {
      setEditingCarrera(carrera)
      setFormCarrera({
        nombre: carrera.nombre,
        codigo: carrera.codigo,
        correoEncargado: carrera.correoEncargado,
        activa: carrera.activa,
      })
    } else {
      setEditingCarrera(null)
      setFormCarrera({
        nombre: "",
        codigo: "",
        correoEncargado: "",
        activa: true,
      })
    }
    setCarreraDialogOpen(true)
  }

  const handleSaveCarrera = () => {
    if (!selectedUnidadId) return

    if (editingCarrera) {
      // Editar carrera existente
      setUnidadesAcademicas(
        unidadesAcademicas.map((unidad) =>
          unidad.id === selectedUnidadId
            ? {
                ...unidad,
                carreras: unidad.carreras.map((carrera) =>
                  carrera.id === editingCarrera.id
                    ? {
                        ...carrera,
                        nombre: formCarrera.nombre,
                        codigo: formCarrera.codigo,
                        correoEncargado: formCarrera.correoEncargado,
                        activa: formCarrera.activa,
                      }
                    : carrera,
                ),
              }
            : unidad,
        ),
      )
    } else {
      // Crear nueva carrera
      const newCarrera: Carrera = {
        id: Date.now(),
        nombre: formCarrera.nombre,
        codigo: formCarrera.codigo,
        correoEncargado: formCarrera.correoEncargado,
        activa: formCarrera.activa,
      }

      setUnidadesAcademicas(
        unidadesAcademicas.map((unidad) =>
          unidad.id === selectedUnidadId ? { ...unidad, carreras: [...unidad.carreras, newCarrera] } : unidad,
        ),
      )
    }
    setCarreraDialogOpen(false)
  }

  const handleDeleteCarrera = (unidadId: number, carreraId: number) => {
    setCarreraToDelete({ unidadId, carreraId })
    setDeleteCarreraDialogOpen(true)
  }

  const confirmDeleteCarrera = () => {
    if (carreraToDelete) {
      setUnidadesAcademicas(
        unidadesAcademicas.map((unidad) =>
          unidad.id === carreraToDelete.unidadId
            ? {
                ...unidad,
                carreras: unidad.carreras.filter((carrera) => carrera.id !== carreraToDelete.carreraId),
              }
            : unidad,
        ),
      )
      setDeleteCarreraDialogOpen(false)
      setCarreraToDelete(null)
    }
  }

  const toggleCarreraStatus = (unidadId: number, carreraId: number) => {
    setUnidadesAcademicas(
      unidadesAcademicas.map((unidad) =>
        unidad.id === unidadId
          ? {
              ...unidad,
              carreras: unidad.carreras.map((carrera) =>
                carrera.id === carreraId ? { ...carrera, activa: !carrera.activa } : carrera,
              ),
            }
          : unidad,
      ),
    )
  }

  return (
    <div className="grid min-h-screen w-full ">
        <div className="flex-1 overflow-auto p-6">
          {unidadesAcademicas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="mb-4 text-center text-muted-foreground">No hay unidades académicas registradas</p>
                <Button onClick={() => handleOpenUnidadDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Crear Unidad Académica
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {unidadesAcademicas.map((unidad) => (
                <Card key={unidad.id} className="overflow-hidden">
                  <CardHeader className="bg-slate-50 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{unidad.nombre}</CardTitle>
                        <CardDescription>{unidad.descripcion}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenUnidadDialog(unidad)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUnidad(unidad.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-medium">Carreras ({unidad.carreras.length})</h3>
                      <Button size="sm" variant="outline" onClick={() => handleOpenCarreraDialog(unidad.id)}>
                        <Plus className="mr-2 h-3 w-3" /> Agregar Carrera
                      </Button>
                    </div>
                    {unidad.carreras.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        No hay carreras registradas para esta unidad académica
                      </div>
                    ) : (
                      <div className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Código</TableHead>
                              <TableHead>Correo Encargado</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unidad.carreras.map((carrera) => (
                              <TableRow key={carrera.id}>
                                <TableCell className="font-medium">{carrera.nombre}</TableCell>
                                <TableCell>{carrera.codigo}</TableCell>
                                <TableCell>{carrera.correoEncargado}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={carrera.activa ? "default" : "outline"}
                                    className={
                                      carrera.activa
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                    }
                                  >
                                    {carrera.activa ? "Activa" : "Inactiva"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => toggleCarreraStatus(unidad.id, carrera.id)}
                                      title={carrera.activa ? "Desactivar" : "Activar"}
                                    >
                                      <Switch checked={carrera.activa} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleOpenCarreraDialog(unidad.id, carrera)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-600"
                                      onClick={() => handleDeleteCarrera(unidad.id, carrera.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Diálogo para crear/editar unidad académica */}
          <Dialog open={unidadDialogOpen} onOpenChange={setUnidadDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUnidad ? "Editar Unidad Académica" : "Nueva Unidad Académica"}</DialogTitle>
                <DialogDescription>
                  {editingUnidad
                    ? "Modifique los datos de la unidad académica"
                    : "Complete los datos para crear una nueva unidad académica"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre-unidad">Nombre</Label>
                  <Input
                    id="nombre-unidad"
                    value={formUnidad.nombre}
                    onChange={(e) => setFormUnidad({ ...formUnidad, nombre: e.target.value })}
                    placeholder="Ej: Facultad de Ingeniería"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion-unidad">Descripción</Label>
                  <Textarea
                    id="descripcion-unidad"
                    value={formUnidad.descripcion}
                    onChange={(e) => setFormUnidad({ ...formUnidad, descripcion: e.target.value })}
                    placeholder="Breve descripción de la unidad académica"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUnidadDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveUnidad}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Diálogo para crear/editar carrera */}
          <Dialog open={carreraDialogOpen} onOpenChange={setCarreraDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCarrera ? "Editar Carrera" : "Nueva Carrera"}</DialogTitle>
                <DialogDescription>
                  {editingCarrera
                    ? "Modifique los datos de la carrera"
                    : "Complete los datos para crear una nueva carrera"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre-carrera">Nombre</Label>
                  <Input
                    id="nombre-carrera"
                    value={formCarrera.nombre}
                    onChange={(e) => setFormCarrera({ ...formCarrera, nombre: e.target.value })}
                    placeholder="Ej: Ingeniería de Software"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="codigo-carrera">Código (3 letras)</Label>
                  <Input
                    id="codigo-carrera"
                    value={formCarrera.codigo}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().slice(0, 3)
                      setFormCarrera({ ...formCarrera, codigo: value })
                    }}
                    placeholder="Ej: ISW"
                    maxLength={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="correo-encargado">Correo del Encargado</Label>
                  <Input
                    id="correo-encargado"
                    type="email"
                    value={formCarrera.correoEncargado}
                    onChange={(e) => setFormCarrera({ ...formCarrera, correoEncargado: e.target.value })}
                    placeholder="Ej: director.isw@universidad.edu"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="carrera-activa"
                    checked={formCarrera.activa}
                    onCheckedChange={(checked) => setFormCarrera({ ...formCarrera, activa: checked })}
                  />
                  <Label htmlFor="carrera-activa">Carrera Activa</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCarreraDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCarrera}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Diálogo de confirmación para eliminar unidad académica */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro de eliminar esta unidad académica?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminarán también todas las carreras asociadas a esta unidad
                  académica.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteUnidad} className="bg-red-600 hover:bg-red-700">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Diálogo de confirmación para eliminar carrera */}
          <AlertDialog open={deleteCarreraDialogOpen} onOpenChange={setDeleteCarreraDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro de eliminar esta carrera?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará la carrera permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteCarrera} className="bg-red-600 hover:bg-red-700">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      
    </div>
  )
}
