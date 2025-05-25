"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profesor } from "@/features/asesores/types";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
  profesor: Profesor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, newRoles: ("asesor" | "jurado")[]) => void;
  onShowAlert: (msg: string) => void;
}

export default function AdministrarRolesModal({ profesor, isOpen, onClose, onSave, onShowAlert }: Props) {
  const [roles, setRoles] = useState<("asesor" | "jurado")[]>([]);

  useEffect(() => {
    if (profesor) setRoles(profesor.rolesAsignados);
  }, [profesor]);

  useEffect(() => {
    if (!isOpen) {
      setRoles([]);
    }
  }, [isOpen]);

  const toggleRole = (rol: "asesor" | "jurado") => {
    setRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  const handleSave = () => {
    if (!profesor) return;
    // Validar si se intenta desactivar un rol con tesis activas
    const desactivandoRol =
      (profesor.rolesAsignados.includes("asesor") && !roles.includes("asesor")) ||
      (profesor.rolesAsignados.includes("jurado") && !roles.includes("jurado"));

    if (desactivandoRol && profesor.tesisActivas > 0) {
      onClose(); // Cierra el modal principal antes de mostrar la alerta
      onShowAlert("No puedes desactivar el rol porque el profesor tiene tesis activas.");
      return;
    }

    setTimeout(() => {
      onSave(profesor.id, roles);
      onClose();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Administrar Roles</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="asesor">Asesor</Label>
            <Switch
              id="asesor"
              checked={roles.includes("asesor")}
              onCheckedChange={() => toggleRole("asesor")}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="jurado">Jurado</Label>
            <Switch
              id="jurado"
              checked={roles.includes("jurado")}
              onCheckedChange={() => toggleRole("jurado")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}