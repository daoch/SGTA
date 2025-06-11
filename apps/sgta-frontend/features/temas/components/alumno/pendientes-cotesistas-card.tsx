import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Eye } from "lucide-react";

export interface PropuestaPendiente {
  id: string;
  titulo: string;
  area: string;
  estudiantes: string[];
  codigos: string[];
  postulaciones: number;
  fechaLimite: string;
  tipo: string;
  descripcion: string;
  objetivos: string;
  asesor?: string;
  estado?: string;
  tesistas?: {
    nombres: string;
    primerApellido: string;
    creador: boolean
  }[];
}

interface Props {
  propuestasPendientes: PropuestaPendiente[];
  onView: (id: string) => void;
  onDelete: (tipo: number, id:string) => void;
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
              Te ha inivitado: {" "}
              <span className="text-[#042354] font-normal">
                {
                  (propuesta as any).tesistas
                    ? (propuesta as any).tesistas.find((t: any) => t.creador === true)?.nombres +
                      " " +
                      (propuesta as any).tesistas.find((t: any) => t.creador === true)?.primerApellido
                    : propuesta.estudiantes[0]
                }
              </span>
              {" · Estado: "}
              <span className="text-yellow-700 font-medium">Pendiente de aceptación</span>
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onView(propuesta.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600"
              onClick={() => onDelete(0, propuesta.id)}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600"
              onClick={() => onDelete(1, propuesta.id)}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
