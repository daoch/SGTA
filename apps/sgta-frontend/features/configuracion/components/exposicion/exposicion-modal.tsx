"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Monitor, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Exposicion } from "../../types/exposicion";

interface ExposicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exposicion: Exposicion) => Promise<void>;
  exposicion?: Exposicion | null;
  mode: "create" | "edit";
}

export const ExposicionModal: React.FC<ExposicionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  exposicion,
  mode,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<Exposicion>({
    titulo: "",
    fechaInicio: "",
    fechaFin: "",
    fechas: "",
    descripcion: "",
    duracion: "",
    modalidad: "Virtual",
    jurados: "Sin jurados",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSingleDay, setIsSingleDay] = useState(false);

  // Cargar datos de la exposición cuando cambie (en modo edición)
  useEffect(() => {
    if (isEditMode && exposicion) {
      // Parsear las fechas del formato "DD/MM/YYYY - DD/MM/YYYY" o "DD/MM/YYYY"
      let fechaInicio = "";
      let fechaFin = "";

      if (exposicion.fechas.includes(" - ")) {
        const [inicio, fin] = exposicion.fechas.split(" - ");
        fechaInicio = formatDateForInput(inicio);
        fechaFin = formatDateForInput(fin);
        setIsSingleDay(false);
      } else {
        fechaInicio = formatDateForInput(exposicion.fechas);
        fechaFin = formatDateForInput(exposicion.fechas);
        setIsSingleDay(true);
      }

      setFormData({
        id: exposicion.id,
        titulo: exposicion.titulo,
        fechaInicio,
        fechaFin,
        fechas: exposicion.fechas,
        descripcion: exposicion.descripcion,
        duracion: exposicion.duracion,
        modalidad: exposicion.modalidad,
        jurados: exposicion.jurados,
      });
    } else {
      // Resetear el formulario en modo creación
      setFormData({
        titulo: "",
        fechaInicio: "",
        fechaFin: "",
        fechas: "",
        descripcion: "",
        duracion: "",
        modalidad: "Virtual",
        jurados: "Sin jurados",
      });
      setIsSingleDay(false);
    }
  }, [exposicion, isEditMode, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSingleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSingleDay(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        fechaFin: prev.fechaInicio,
      }));
    }
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fechaInicio = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fechaInicio,
      fechaFin: isSingleDay ? fechaInicio : prev.fechaFin,
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
        `Error al ${isEditMode ? "actualizar" : "crear"} la exposición:`,
        error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatear fecha para el input date (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";

    // Si la fecha está en formato DD/MM/YYYY
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return dateString;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Exposición" : "Nueva Exposición"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos de la exposición existente."
              : "Agregue una nueva exposición a la etapa. Las exposiciones son presentaciones que los estudiantes deben realizar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Nombre de la Exposición</Label>
              <Input
                id="txtNombreExposicion"
                name="titulo"
                placeholder="Ej: Exposición de Avance"
                value={formData.titulo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="fechaInicio">
                  Fecha{!isSingleDay ? " de inicio" : ""}
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chkSingleDay"
                    checked={isSingleDay}
                    onChange={handleSingleDayChange}
                    className="mr-1"
                  />
                  <Label
                    htmlFor="singleDay"
                    className="text-xs text-muted-foreground"
                  >
                    Un solo día
                  </Label>
                </div>
              </div>
              <Input
                id="dateFechaInicio"
                name="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={handleFechaInicioChange}
                required
              />
            </div>

            {!isSingleDay && (
              <div className="grid gap-2">
                <Label htmlFor="fechaFin">Fecha de fin</Label>
                <Input
                  id="dateFechaFin"
                  name="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  required
                  min={formData.fechaInicio}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="duracion">Duración</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="txtDuracion"
                  name="duracion"
                  placeholder="Ej: 20 min"
                  value={formData.duracion}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Modalidad</Label>
              <RadioGroup
                id="rdoModalidad"
                value={formData.modalidad}
                onValueChange={(value) => handleRadioChange("modalidad", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="rdoVirtual" value="Virtual" />
                  <Label htmlFor="virtual" className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" /> Virtual
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="rdoPresencial" value="Presencial" />
                  <Label
                    htmlFor="presencial"
                    className="flex items-center gap-1"
                  >
                    <Users className="h-4 w-4" /> Presencial
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Jurados</Label>
              <RadioGroup
                id="rdoJurados"
                value={formData.jurados}
                onValueChange={(value) => handleRadioChange("jurados", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="rdoConJurados" value="Con jurados" />
                  <Label htmlFor="con-jurados">Con jurados</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="rdoSinJurados" value="Sin jurados" />
                  <Label htmlFor="sin-jurados">Sin jurados</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="txtDescripcionExposicion"
                name="descripcion"
                placeholder="Descripción general de la exposición"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
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
                  : "Crear Exposición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
