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

export interface CriterioEntregableFormData {
  id?: string;
  nombre: string;
  descripcion: string;
  notaMaxima: number;
}

interface CriterioEntregableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contenido: CriterioEntregableFormData) => Promise<void>;
  criterio?: CriterioEntregableFormData | null;
  mode: "create" | "edit";
}

export const CriterioEntregableModal: React.FC<
CriterioEntregableModalProps
> = ({ isOpen, onClose, onSubmit, criterio, mode }) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<CriterioEntregableFormData>({
    id: "",
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
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // No limpiamos el formulario aquí, ya que useEffect se encargará de eso
    } catch (error) {
      console.error(
        `Error al ${isEditMode ? "actualizar" : "crear"} el contenido:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Editar Contenido Esperado"
              : "Nuevo Contenido Esperado"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del contenido esperado para el entregable."
              : "Agregue un nuevo contenido esperado para el entregable."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Nombre del Contenido</Label>
              <Input
                id="txtNombreContenido"
                name="nombre"
                placeholder="Ej: Introducción"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción Detallada</Label>
              <Textarea
                id="txtDescripcionContenido"
                name="descripcion"
                placeholder="Descripción detallada del contenido esperado"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notaMaxima">Peso en la Calificación (puntos)</Label>
              <Input
                id="txtNotaMaximaContenido"
                name="notaMaxima"
                type="number"
                min="1"
                max="20"
                placeholder="Ej: 5"
                value={formData.notaMaxima || ""}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                El total de puntos entre todos los contenidos debe sumar 20.
              </p>
            </div>
          </div>
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
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Guardando..."
                  : "Creando..."
                : isEditMode
                  ? "Guardar Cambios"
                  : "Crear Contenido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
