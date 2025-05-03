import { Card } from "@/components/ui/card";
import { AlertCircle, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PropuestaPendiente {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: "general" | "directa";
  descripcion: string;
  objetivos: string;
  asesor?: string;
  estado?: "propuesta" | "cotesista_pendiente";
}

interface Props {
  propuestasPendientes: PropuestaPendiente[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PendientesCotesistasCard({ propuestasPendientes, onView, onDelete }: Props) {
  if (propuestasPendientes.length === 0) return null;

  return (
    <Card className="bg-[#f9fafb] border border-gray-200 rounded-xl shadow-sm px-4 py-3 space-y-3">
      <div className="flex items-center gap-2 text-[20px] font-semibold text-[#042354] mb-[1px]">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        Propuestas con cotesistas pendientes de aceptación
      </div>

      {propuestasPendientes.map((propuesta) => (
        <div
          key={propuesta.id}
          className="flex items-center justify-between bg-white border rounded-md px-4 py-3"
        >
          <div>
            <p className="font-medium">{propuesta.titulo}</p>
            <p className="text-sm text-muted-foreground">
              Cotesistas: <span className="text-[#042354]">{propuesta.estudiantes.join(", ")}</span> – Estado:{" "}
              <span className="text-yellow-600 font-medium">Pendiente de aceptación</span>
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onView(propuesta.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(propuesta.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
