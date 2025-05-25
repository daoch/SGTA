"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface CriterioExposicionFormData {
  id?: string;
  nombre: string;
  descripcion: string;
  notaMaxima: number;
}

interface CriterioExposicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contenido: CriterioExposicionFormData) => Promise<void>;
  criterio?: CriterioExposicionFormData | null;
  mode: "create" | "edit";
  criteriosExistentes: CriterioExposicionFormData[]; // Criterios ya agregados
}

export const CriterioExposicionModal: React.FC<
  CriterioExposicionModalProps
> = ({
  isOpen,
  onClose,
  onSubmit,
  criterio,
  mode,
  criteriosExistentes, // Pasar los criterios ya definidos en la exposición
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<CriterioExposicionFormData>({
    nombre: "",
    descripcion: "",
    notaMaxima: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del contenido cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && criterio) {
      setFormData({
        id: criterio.id,
        nombre: criterio.nombre,
        descripcion: criterio.descripcion,
        notaMaxima: criterio.notaMaxima,
      });
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        id: "",
        nombre: "",
        descripcion: "",
        notaMaxima: 0,
      });
    }
  }, [criterio, isEditMode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "notaMaxima" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el contenido:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar el criterio que está siendo editado
  const criteriosFiltrados = criteriosExistentes.filter(
    (c) => c.id !== criterio?.id,
  );

  // Calcular la suma total de los puntajes
  const sumaTotalNotas =
    criteriosFiltrados.reduce(
      (acc, criterioExistente) => acc + criterioExistente.notaMaxima,
      0,
    ) + formData.notaMaxima;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Editar Criterio de Calificación"
              : "Nuevo Criterio de Calificación"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del criterio de calificación."
              : "Agregue un nuevo criterio de calificación."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Nombre del Criterio</Label>
              <Input
                id="txtNombreCriterio"
                name="nombre"
                placeholder="Ej: Originalidad"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="txtDescripcionCriterio"
                name="descripcion"
                placeholder="Descripción detallada del criterio"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="puntos">Peso en la Calificación (puntos)</Label>
              <Input
                id="txtPuntosCriterio"
                name="notaMaxima"
                type="number"
                min="0.5"
                max="20"
                step="0.1"
                placeholder="Ej: 5"
                value={formData.notaMaxima || ""}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                El total de puntos entre todos los criterios debe sumar 20.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Suma total de criterios: {sumaTotalNotas} puntos
          </p>
          {sumaTotalNotas > 20 && (
            <p className="text-sm text-red-500">
              La suma de los criterios no puede exceder 20 puntos.
            </p>
          )}
          <DialogFooter>
            <Button
              id="btnCancel"
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              id="btnSave"
              type="submit"
              className="bg-black hover:bg-gray-800"
              disabled={isSubmitting || sumaTotalNotas > 20} // Deshabilitar si la suma excede 20
            >
              {isSubmitting
                ? isEditMode
                  ? "Guardando..."
                  : "Creando..."
                : isEditMode
                  ? "Guardar Cambios"
                  : "Crear Criterio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
