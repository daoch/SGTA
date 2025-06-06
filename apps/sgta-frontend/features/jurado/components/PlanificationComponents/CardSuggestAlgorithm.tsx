"use client";

import { Button } from "@/components/ui/button";
import { Bot, FolderSync } from "lucide-react";
import React from "react";
import { usePlanificationStore } from "../../store/use-planificacion-store";
import { toast } from "sonner";
import ButtonAlertDialog from "../button-alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CardSugerenciaDistribucion: React.FC = () => {
  const {
    desasignarTodosLosTemas,
    temasAsignados,
    temasSinAsignar,
    generarDistribucionAutomatica,
  } = usePlanificationStore();
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-1 rounded-sm px-4"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Panel de acciones rápidas</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <div className="flex justify-between">
            <ButtonAlertDialog
              message="¿Estás seguro de que deseas regresar todos los temas asignados a la lista de temas sin asignar? Esta acción no se puede deshacer."
              trigger={
                <Button
                  className="w-fit"
                  disabled={Object.keys(temasAsignados).length === 0}
                  variant="destructive"
                >
                  <FolderSync />
                  Regresar Temas
                </Button>
              }
              onConfirm={() => {
                desasignarTodosLosTemas();
                toast.success(
                  "Todos los temas han sido regresados correctamente.",
                );
              }}
            />
            <Button
              className="w-fit"
              disabled={temasSinAsignar.length === 0}
              variant="default"
              onClick={async () => {
                try {
                  await generarDistribucionAutomatica();
                  toast.success(
                    "Distribución automática generada correctamente.",
                  );
                  console.log(
                    "Distribución automática generada correctamente.",
                  );
                } catch (error) {
                  toast.error("Error al generar la distribución automática.");
                  console.error(
                    "Error al generar la distribución automática:",
                    error,
                  );
                }
              }}
            >
              <Bot />
              Generar Distribución
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default React.memo(CardSugerenciaDistribucion);
