import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AsesorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  advisorName: string;
  advisorEmail: string;
}

export function AsesorExportModal({
  isOpen,
  onClose,
  onExport,
  advisorName,
  advisorEmail,
}: AsesorExportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar información de tesistas</DialogTitle>
        </DialogHeader>
       <div className="mb-4 space-y-2">
          {/*<div>
            <span className="font-semibold">Asesor:</span> {advisorName}
          </div>
          <div>
            <span className="font-semibold">Correo:</span> {advisorEmail}
          </div>
          */}
          <div className="mt-4 text-gray-700">
            Se exportará la información detallada de todos los tesistas asignados a este asesor en formato Excel.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onExport}>
            Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}