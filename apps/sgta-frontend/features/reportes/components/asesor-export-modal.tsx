import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface AsesorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: AsesorExportOptions) => void;
  advisorName: string;
  advisorEmail: string;
}

export interface AsesorExportOptions {
  includeStudents: boolean;
  includeProgress: boolean;
  includeContact: boolean;
}

export function AsesorExportModal({
  isOpen,
  onClose,
  onExport,
  advisorName,
  advisorEmail,
}: AsesorExportModalProps) {
  const [options, setOptions] = useState<AsesorExportOptions>({
    includeStudents: true,
    includeProgress: true,
    includeContact: false,
  });

  const handleChange = (field: keyof AsesorExportOptions) => {
    setOptions((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleExport = () => {
    onExport(options);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Reporte del Asesor</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <div className="mb-2">
            <span className="font-semibold">Asesor:</span> {advisorName}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Correo:</span> {advisorEmail}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeStudents}
                onChange={() => handleChange("includeStudents")}
              />
              Incluir lista de tesistas
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeProgress}
                onChange={() => handleChange("includeProgress")}
              />
              Incluir progreso de tesistas
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeContact}
                onChange={() => handleChange("includeContact")}
              />
              Incluir datos de contacto
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>Exportar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}