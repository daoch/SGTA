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
  onSave: (id: string, newRoles: ("asesor" | "jurado")[]) => void;
}

export default function AdministrarRolesModal({ profesor, isOpen, onClose, onSave }: Props) {
  const [roles, setRoles] = useState<("asesor" | "jurado")[]>([]);

  useEffect(() => {
    if (profesor) setRoles(profesor.rolesAsignados);
  }, [profesor]);

  const toggleRole = (rol: "asesor" | "jurado") => {
    setRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  const handleSave = () => {
    if (!profesor) return;

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
