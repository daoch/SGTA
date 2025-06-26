// /components/features/asesores/AdministrarRolesModal.tsx

"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Profesor } from "@/features/asesores/types";

interface Props {
  profesor: Profesor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, newRoles: ("asesor" | "jurado")[]) => void;
}

export default function AdministrarRolesModal({ profesor, isOpen, onClose, onSave }: Props) {
  const [roles, setRoles] = useState<("asesor" | "jurado")[]>([]);
  const [alerta, setAlerta] = useState<string | null>(null);

  // Sincroniza el estado de los roles con el profesor seleccionado
  useEffect(() => {
    if (profesor) {
      setRoles(profesor.rolesAsignados);
    }
  }, [profesor]);

  // Limpia el estado del modal cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setRoles([]);
      setAlerta(null);
    }
  }, [isOpen]);

  const toggleRole = (rol: "asesor" | "jurado") => {
    setRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
    // Limpia la alerta si el usuario realiza un cambio, dándole la oportunidad de corregir.
    setAlerta(null);
  };

  const handleSave = () => {
    if (!profesor) return;

    // --- LÓGICA DE VALIDACIÓN MEJORADA ---
    const estaDesactivandoAsesor = profesor.rolesAsignados.includes("asesor") && !roles.includes("asesor");
    const estaDesactivandoJurado = profesor.rolesAsignados.includes("jurado") && !roles.includes("jurado");

    // Valida si se puede desactivar el rol de ASESOR
    if (estaDesactivandoAsesor && profesor.tesisAsesor > 0) {
      setAlerta("No se puede desactivar el rol de Asesor porque el profesor tiene tesis activas como asesor.");
      return;
    }

    // Valida si se puede desactivar el rol de JURADO
    if (estaDesactivandoJurado && profesor.tesisJurado > 0) {
      setAlerta("No se puede desactivar el rol de Jurado porque el profesor tiene tesis activas como jurado.");
      return;
    }

    // Si pasa las validaciones, guarda los cambios
    onSave(profesor.id, roles);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Administrar Roles de {profesor?.nombres}</DialogTitle>
        </DialogHeader>

        {alerta && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Acción no permitida</AlertTitle>
            <AlertDescription>{alerta}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="asesor" className="font-medium">
              Rol: Asesor
            </Label>
            <Switch
              id="asesor"
              checked={roles.includes("asesor")}
              onCheckedChange={() => toggleRole("asesor")}
              aria-label="Activar o desactivar rol de asesor"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="jurado" className="font-medium">
              Rol: Jurado
            </Label>
            <Switch
              id="jurado"
              checked={roles.includes("jurado")}
              onCheckedChange={() => toggleRole("jurado")}
              aria-label="Activar o desactivar rol de jurado"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}