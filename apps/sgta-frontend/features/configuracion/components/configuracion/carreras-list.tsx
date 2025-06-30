"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { carreraService, unidadAcademicaService, Carrera, UnidadAcademica } from "../../services/carrera-service";
import { toast } from "sonner";

export interface CarrerasListRef {
  refresh: () => void;
}

export const CarrerasList = forwardRef<CarrerasListRef>((props, ref) => {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [unidadesAcademicas, setUnidadesAcademicas] = useState<UnidadAcademica[]>([]);
  const [unidadAcademica, setUnidadAcademica] = useState("all"); // "all" para mostrar todas
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carreraToDelete, setCarreraToDelete] = useState<Carrera | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [carrerasData, unidadesData] = await Promise.all([
        carreraService.getAll(),
        unidadAcademicaService.getAll()
      ]);
      setCarreras(carrerasData);
      setUnidadesAcademicas(unidadesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function to parent component
  useImperativeHandle(ref, () => ({
    refresh: loadData
  }));

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteClick = (carrera: Carrera) => {
    setCarreraToDelete(carrera);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!carreraToDelete) return;

    try {
      setDeleting(true);
      await carreraService.delete(carreraToDelete.id);
      toast.success("Carrera eliminada exitosamente");
      setDeleteModalOpen(false);
      setCarreraToDelete(null);
      // Refresh the list
      await loadData();
    } catch (error) {
      console.error("Error al eliminar la carrera:", error);
      toast.error("Error al eliminar la carrera");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCarreraToDelete(null);
  };

  // Filtrar carreras por unidad académica seleccionada
  const carrerasFiltradas = unidadAcademica === "all" 
    ? carreras.filter(carrera => carrera.activo) // Solo mostrar carreras activas
    : carreras.filter(carrera => 
        carrera.activo && carrera.unidadAcademicaId?.toString() === unidadAcademica
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500">Cargando carreras...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="unidadAcademica" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Unidad Académica
        </label>
        <Select value={unidadAcademica} onValueChange={setUnidadAcademica}>
          <SelectTrigger id="unidadAcademica" className="w-full md:w-72">
            <SelectValue placeholder="Seleccionar unidad académica" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las unidades académicas</SelectItem>
            {unidadesAcademicas.map((unidad) => (
              <SelectItem key={unidad.id} value={unidad.id.toString()}>
                {unidad.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Código</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Nombre</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {carrerasFiltradas.length > 0 ? (
              carrerasFiltradas.map((carrera) => (
                <tr key={carrera.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{carrera.codigo}</td>
                  <td className="px-4 py-3 text-sm">{carrera.nombre}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={carrera.activo ? "default" : "secondary"}>
                      {carrera.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Link href={`/administrador/configuracion/carreras/${carrera.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Link href={`/administrador/configuracion/carreras/${carrera.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(carrera)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  {unidadAcademica === "all" 
                    ? "No hay carreras registradas" 
                    : "No hay carreras en esta unidad académica"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar la carrera{" "}
              <span className="font-semibold">{carreraToDelete?.nombre}</span>?
              <br />
              <span className="text-sm text-gray-500">
                Esta acción marcará la carrera como inactiva. Los datos se preservarán pero no será visible en el sistema.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleDeleteCancel}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
