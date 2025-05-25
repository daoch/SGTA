"use client";

import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrearCicloDto } from "@/features/administrador/types/ciclo.type";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface NuevoCicloModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrar: (formData: CrearCicloDto) => Promise<CrearCicloDto>;
}

export function NuevoCicloModal({
  isOpen,
  onClose,
  onRegistrar,
}: NuevoCicloModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    semestre: "",
    anio: new Date().getFullYear(),
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
  });

  // Limpiar el formulario al cerrar el modal
  const handleClose = () => {
    setFormData(formData);
    setShowConfirm(false);
    setAlert(null);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "anio") {
      const numValue = Number.parseInt(value);
      if (!isNaN(numValue)) {
        setFormData((prev) => {
          const newData = { ...prev, [name]: numValue };
          newData.nombre = `${numValue}-${prev.semestre}`;
          return newData;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSemestreChange = (value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, semestre: value };
      newData.nombre = `${prev.anio}-${value}`;
      return newData;
    });
  };

  // Mostrar confirmación personalizada
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // Si el usuario confirma, guardar
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    try {
      await onRegistrar(formData);
      setAlert({
        type: "success",
        message: "El ciclo se guardó correctamente.",
      });
      setFormData({
        semestre: "",
        anio: new Date().getFullYear(),
        nombre: "",
        fechaInicio: "",
        fechaFin: "",
      });
    } catch {
      setAlert({
        type: "error",
        message: "No se pudo guardar el ciclo.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Ciclo</DialogTitle>
          <DialogDescription>
            Complete los campos para registrar un nuevo ciclo académico.
          </DialogDescription>
        </DialogHeader>
        {alert && (
          <Alert
            variant={alert.type === "success" ? "default" : "destructive"}
            className="mb-4"
          >
            {alert.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <AlertTitle>
              {alert.type === "success" ? "¡Éxito!" : "Error"}
            </AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre</Label>
                <Select
                  value={formData.semestre}
                  onValueChange={handleSemestreChange}
                >
                  <SelectTrigger id="semestre">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="anio">Año</Label>
                <Input
                  id="anio"
                  name="anio"
                  type="number"
                  value={formData.anio}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="2025-1"
                value={formData.nombre}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                El nombre se genera automáticamente a partir del año y semestre.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin</Label>
                <Input
                  id="fechaFin"
                  name="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
        {/* Confirmación personalizada */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar registro</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Desea guardar los datos registrados?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSave}>
                Guardar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
