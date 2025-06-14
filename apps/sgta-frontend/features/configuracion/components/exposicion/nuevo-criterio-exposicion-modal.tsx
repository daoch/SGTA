"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios/axios-instance";
import { CriterioExposicion } from "../../dtos/criterio-exposicion";


interface NuevoCriterioExposicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (criteriosSeleccionados: CriterioExposicion[]) => void;
  criteriosExistentes: CriterioExposicion[]; // Criterios ya agregados
}

export const NuevoCriterioExposicionModal: React.FC<NuevoCriterioExposicionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  criteriosExistentes, // Pasar los criterios ya agregados desde DetalleExposicionPage
}) => {
  const [criteriosPredefinidos, setCriteriosPredefinidos] = useState<CriterioExposicion[]>([]);
  const [criteriosSeleccionados, setCriteriosSeleccionados] = useState<CriterioExposicion[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la barra de búsqueda

  // Calcular la suma total de las notas máximas
  const sumaTotalNotas = criteriosExistentes.reduce(
    (acc, criterio) => acc + criterio.notaMaxima,
    0
  ) + criteriosSeleccionados.reduce((acc, criterio) => acc + criterio.notaMaxima, 0);

  // Cargar criterios predefinidos desde la base de datos
  useEffect(() => {
    const fetchCriteriosPredefinidos = async () => {
      try {
        const response = await axiosInstance.get("/criterio-exposicion-preset/getAll");
        setCriteriosPredefinidos(response.data);
      } catch (error) {
        console.error("Error al cargar los criterios predefinidos:", error);
      }
    };

    if (isOpen) {
      fetchCriteriosPredefinidos();
    }
  }, [isOpen]);

  // Limpiar el estado al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setCriteriosSeleccionados([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  // Manejar selección de criterios
  const handleCheckboxChange = (criterio: CriterioExposicion) => {
    setCriteriosSeleccionados((prev) => {
      const isSelected = prev.some((c) => c.id === criterio.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== criterio.id);
      } else {
        return [...prev, criterio];
      }
    });
  };

  // Manejar cambio de puntaje
  const handleNotaChange = (id: string, nuevaNota: number) => {
    setCriteriosSeleccionados((prev) =>
      prev.map((criterio) =>
        criterio.id === id ? { ...criterio, notaMaxima: nuevaNota } : criterio
      )
    );
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    onSubmit(criteriosSeleccionados);
    onClose();
  };

  // Filtrar criterios predefinidos según el texto de búsqueda y los criterios existentes
  const criteriosFiltrados = criteriosPredefinidos.filter(
    (criterio) =>
      !criteriosExistentes.some(
        (existente) => existente.nombre.toLowerCase() === criterio.nombre.toLowerCase()
      ) && criterio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Criterios de Calificación</DialogTitle>
          <DialogDescription>
            Seleccione los criterios de calificación que desea agregar a la exposición.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Barra de búsqueda */}
          <Input
            type="text"
            placeholder="Buscar criterios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el texto de búsqueda
            className="mb-2"
          />
          <p className="text-sm text-muted-foreground">
            Criterios disponibles: {criteriosFiltrados.length} Seleccionados:{" "}
            {criteriosSeleccionados.length}
          </p>
          {/* Mostrar suma total de criterios */}
          <p className="text-sm text-muted-foreground">
            Suma total de criterios: {sumaTotalNotas} puntos
          </p>
          {/* Mostrar advertencia si la suma supera 20 */}
          {sumaTotalNotas > 20 && (
            <p className="text-sm text-red-500">
              El puntaje no puede exceder 20 puntos.
            </p>
          )}
          {/* Contenedor scrolleable */}
          <div className="space-y-4 max-h-64 overflow-y-auto border rounded-lg p-2">
            {criteriosFiltrados.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No existen criterios para mostrar
              </p>
            ) : (
              criteriosFiltrados.map((criterio) => {
                const isSelected = criteriosSeleccionados.some((c) => c.id === criterio.id);
                const criterioSeleccionado = criteriosSeleccionados.find(
                  (c) => c.id === criterio.id
                );

                return (
                  <div
                    key={criterio.id}
                    className="border rounded-lg p-4 flex flex-col space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(criterio)}
                        />
                        <span className="font-medium">{criterio.nombre}</span>
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`nota-${criterio.id}`} className="text-sm">
                          Puntaje:
                        </Label>
                        <Input
                          id={`nota-${criterio.id}`}
                          type="number"
                          min="1"
                          max="20"
                          value={criterioSeleccionado?.notaMaxima ?? criterio.notaMaxima}
                          disabled={!isSelected} // Deshabilitar si no está seleccionado
                          onChange={(e) =>
                            handleNotaChange(criterio.id ?? "", parseFloat(e.target.value) || 0)
                          }
                          className="w-20"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{criterio.descripcion}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={criteriosSeleccionados.length === 0 || sumaTotalNotas > 20}
          >
            Agregar Seleccionados
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};