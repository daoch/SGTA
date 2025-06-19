import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { inscribirTemaPrescrito } from "@/features/temas/types/inscripcion/data";
import { Coasesor } from "@/features/temas/types/inscripcion/entities";
import { Tipo } from "@/features/temas/types/inscripcion/enums";
import { Tema } from "@/features/temas/types/temas/entidades";
import { EstadoTemaNombre } from "@/features/temas/types/temas/enums";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";
interface TemaDetailsDialogProps {
  tema: Tema;
  asesor?: Coasesor;
  onTemaInscrito?: () => void;
}

/**
 * Muestra en un Dialog el detalle de un tema.
 * @param tema
 * @returns TemaDetailsDialog
 */
export const TemaDetailsDialog: React.FC<TemaDetailsDialogProps> = ({
  tema,
  asesor,
  onTemaInscrito,
}) => {
  const [temaSeleccionado, setTemaSeleccionado] = useState<Tema | null>(null);
  const router = useRouter();
  const coasesores = tema.coasesores
    ? tema.coasesores
        .filter((c) => c.id !== asesor?.id)
        .map((c) => {
          const apellidos = [c.primerApellido, c.segundoApellido]
            .filter(Boolean)
            .join(" ");
          return `${c.nombres} ${apellidos}`.trim();
        })
        .join(", ")
    : "";
  function handleVerInformacion(tema: Tema) {
    router.push(`/asesor/temas/informacion/${tema.id}`);
  }

  const handleInscribirTema = async () => {
    try {
      await inscribirTemaPrescrito(tema.id);
      if (onTemaInscrito) {
        onTemaInscrito();
      }
      toast.success("Tema inscrito correctamente.");
      setTemaSeleccionado(null);
    } catch {
      toast.error("Error al inscribir el tema.");
    }
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setTemaSeleccionado(tema);
            }}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver detalles</span>
          </Button>
        </DialogTrigger>
        {temaSeleccionado && (
          <DialogContent className="overflow-y-auto max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles del Tema</DialogTitle>
              <DialogDescription>
                Información completa sobre el tema propuesto
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Title */}
              <div>
                <p className="text-sm font-medium">Título</p>
                <p className="bg-muted p-2 rounded-md">{tema.titulo}</p>
              </div>

              {/* Area */}
              <div>
                <p className="text-sm font-medium">Área</p>
                <p className="bg-muted p-2 rounded-md">{tema.area[0].nombre}</p>
              </div>

              {/* Subáreas */}
              <div>
                <p className="text-sm font-medium">Subáreas</p>
                <p className="bg-muted p-2 rounded-md">
                  {tema.subareas
                    .map((subareas) => `${subareas.nombre}`)
                    .join("- ")}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium">Descripción</p>
                <p className="bg-muted p-2 rounded-md whitespace-pre-line">
                  {tema.resumen}
                </p>
              </div>

              {/* Asesor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Asesor</p>
                  <p className="bg-muted p-2 rounded-md">{`${asesor?.nombres} ${asesor?.primerApellido}`}</p>
                </div>

                {/* Estado */}
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <div className="bg-muted p-2 rounded-md">
                    <Badge variant="outline">
                      {tema.estadoTemaNombre ?? "No definido"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Coasesores */}
              <div>
                <p className="text-sm font-medium">Coasesores</p>
                {coasesores.length !== 0 ? (
                  <p className="bg-muted p-2 rounded-md">{coasesores}</p>
                ) : (
                  <p className="bg-muted p-2 rounded-md text-gray-400">
                    Sin coasesor(es)
                  </p>
                )}
              </div>

              {/* Students */}
              <div>
                <p className="text-sm font-medium">Estudiantes</p>
                {tema.tesistas && tema.tesistas.length > 0 ? (
                  <div className="space-y-2">
                    {tema.tesistas.map((tesista) => (
                      <div
                        key={tesista.id}
                        className="flex items-center justify-between bg-muted p-2 rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {tesista.nombres} {tesista.primerApellido}{" "}
                            {tesista.segundoApellido}
                          </p>
                          <p className="text-xs text-gray-400">
                            {tesista.codigoPucp}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver portafolio
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="bg-muted p-2 rounded-md text-gray-400 space-y-2">
                    Sin estudiantes asignados
                  </p>
                )}
              </div>

              {/* Objetivos */}
              {tema.objetivos && tema.objetivos.trim() !== "" && (
                <div>
                  <p className="text-sm font-medium">Objetivos</p>
                  <p className="bg-muted p-2 rounded-md whitespace-pre-line">
                    {tema.objetivos}
                  </p>
                </div>
              )}

              {/* Requisitos */}
              {tema.requisitos && tema.requisitos.trim() !== "" && (
                <div>
                  <p className="text-sm font-medium">Requisitos</p>
                  <p className="bg-muted p-2 rounded-md whitespace-pre-line">
                    {tema.requisitos}
                  </p>
                </div>
              )}

              {/* Fecha límite */}
              {tema.estadoTemaNombre === Tipo.LIBRE && (
                <div>
                  <p className="text-sm font-medium">Fecha Límite</p>
                  <p className="bg-muted p-2 rounded-md">
                    {formatDate(tema.fechaLimite)}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <DialogFooter className="pt-4 flex justify-between">
              {/* More Info Button */}
              <Button
                variant="outline"
                onClick={() => {
                  handleVerInformacion(tema);
                }}
              >
                Más información
              </Button>
              {/* Close Button */}
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
              {/* Inscribir Button */}
              {tema.estadoTemaNombre === EstadoTemaNombre.PREINSCRITO && (
                <Button
                  variant="default"
                  onClick={handleInscribirTema}
                  disabled={!(tema.tesistas && tema.tesistas.length > 0)}
                >
                  Inscribir Tema
                </Button>
              )}{" "}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

function formatDate(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const anio = fecha.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
}
