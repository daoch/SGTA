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

  useEffect(() => {
    if (profesor) setRoles(profesor.rolesAsignados);
  }, [profesor]);

  useEffect(() => {
    if (!isOpen) {
      setRoles([]);
      setAlerta(null); // Limpia la alerta al cerrar el modal
    }
  }, [isOpen]);

  const toggleRole = (rol: "asesor" | "jurado") => {
    setRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
    setAlerta(null); // Limpia la alerta si el usuario cambia algo
  };

  const handleSave = () => {
    if (!profesor) return;
    const desactivandoRol =
      (profesor.rolesAsignados.includes("asesor") && !roles.includes("asesor")) ||
      (profesor.rolesAsignados.includes("jurado") && !roles.includes("jurado"));

    if (desactivandoRol && profesor.tesisActivas > 0) {
      setAlerta("No puedes desactivar el rol porque el profesor tiene tesis activas.");
      return; // Bloquea el guardado
    }

    onSave(profesor.id, roles);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Administrar Roles</DialogTitle>
        </DialogHeader>

        {alerta && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Acción no permitida</AlertTitle>
            <AlertDescription>{alerta}</AlertDescription>
          </Alert>
        )}

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