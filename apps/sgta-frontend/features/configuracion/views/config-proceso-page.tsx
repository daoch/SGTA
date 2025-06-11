"use client";
import { NuevaEtapaModal } from "@/features/configuracion/components/configuracion/nueva-etapa-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ChevronRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { etapaFormativaCicloService } from "@/features/configuracion/services/etapa-formativa-ciclo";
import { EtapaFormativaCiclo } from "../types/etapa-formativa-ciclo";
import { toast } from "sonner";
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

import { SquarePen } from "lucide-react";
import { EditarEtapaModal } from "@/features/configuracion/components/configuracion/editar-etapa-modal";

export default function ConfiguracionProcesoPage() {
  const [etapas, setEtapas] = useState<EtapaFormativaCiclo[]>([]);
  const [etapaToDelete, setEtapaToDelete] = useState<EtapaFormativaCiclo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchEtapas = async () => {
    try {
      const response = await etapaFormativaCicloService.getAllByIdCarrera();
      if (response) {
        setEtapas(response);
      }
    } catch (error) {
      console.error("Error al cargar las etapas:", error);
      toast.error("Error al cargar las etapas");
    }
  };

  useEffect(() => {
    fetchEtapas();
  }, []);

  const handleDelete = async () => {
    if (!etapaToDelete) return;

    setIsDeleting(true);
    try {
      await etapaFormativaCicloService.delete(etapaToDelete.id);
      toast.success("Etapa eliminada exitosamente");
      await fetchEtapas(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar la etapa:", error);
      toast.error("Error al eliminar la etapa");
    } finally {
      setIsDeleting(false);
      setEtapaToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-5 mb-4">
        <Link
          href="/coordinador/configuracion"
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={11} />
        </Link>
        <h1 className="text-2xl font-bold text-[#042354]">
          Configuración de Proceso
        </h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Etapas del Proceso</h2>
        </div>
        <NuevaEtapaModal onSuccess={fetchEtapas} />
      </div>

      <div className="space-y-4">
        {etapas.map((etapa) => (
          <Card key={etapa.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{etapa.nombreEtapaFormativa}</h3>
                      <div className="text-sm mb-2">
                        <strong>Ciclo:</strong> {etapa.nombreCiclo}
                      </div>
                      <div className="text-sm">
                        <strong>Creditaje:</strong> {etapa.creditajePorTema}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/*<Button variant="outline" size="icon">
                      <Edit size={16} />
                    </Button>*/}

                    {/* Botón de Editar con SquarePen */}
                    <EditarEtapaModal
                      etapa={etapa}
                      onSuccess={fetchEtapas}
                    />
                    

                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500"
                      onClick={() => setEtapaToDelete(etapa)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 border-t flex items-center justify-between">
                <div className="flex gap-6">
                  <div className="text-sm">
                    <span className="text-gray-500">Entregables:</span> {etapa.cantidadEntregables}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Exposiciones:</span> {etapa.cantidadExposiciones}
                  </div>
                  
                </div>

                <Link 
                  href={{
                    pathname: `/coordinador/configuracion/proceso/etapa/${etapa.id}`,
                    query: {
                      nombreEtapa: etapa.nombreEtapaFormativa,
                      ciclo: etapa.nombreCiclo
                    }
                  }}
                >
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <span>Ver detalles</span>
                    <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!etapaToDelete} onOpenChange={() => setEtapaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la etapa {etapaToDelete?.nombreEtapaFormativa} y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
