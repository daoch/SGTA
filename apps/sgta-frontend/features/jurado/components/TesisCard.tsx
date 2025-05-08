"use client";

import React from "react";
import { Tesis } from "@/features/jurado/types/juradoDetalle.types";
import { cn } from "@/lib/utils"; // Asegúrate de que esta importación es correcta

interface ListaTesisJuradoCardProps {
  data: Tesis[];
  onSelect?: (tesis: Tesis) => void; // Callback para manejar la selección de una tesis(para asignacion)
  selected?: Tesis | null;
  onCardClick?: (codigoTesis: string) => void; // Callback para manejar el clic en un card(para revision del detalle)
}

export const ListaTesisJuradoCard: React.FC<ListaTesisJuradoCardProps> = ({
  data,
  onSelect,
  selected,
  onCardClick,
}) => {
  const isSelected = (tesis: Tesis) => {
    return selected?.codigo === tesis.codigo;
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {data.map((tesis) => {
        const isCardSelected = isSelected(tesis);

        return (
          <div
            key={tesis.codigo}
            className={cn(
              "border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors",
              isCardSelected
                ? "border-primary bg-primary/5"
                : "border-gray-200",
            )}
            onClick={() => {
              if (onSelect) {
                onSelect(tesis);
              }
              if (onCardClick) {
                onCardClick(tesis.codigo);
              }
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-sm">
                  ({tesis.codigo}) {tesis.titulo}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {tesis.codEstudiante} - {tesis.estudiante}
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  isCardSelected
                    ? "bg-white text-[#042354]"
                    : "bg-[#001F66] text-white"
                }`}
              >
                {tesis.rol}
              </span>
            </div>

            <p className="text-sm text-justify">{tesis.resumen}</p>

            <div className="flex gap-2 flex-wrap mt-2">
              {tesis.especialidades.map((esp, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    isCardSelected
                      ? "bg-white text-[#042354]"
                      : "bg-[#E5F0FF] text-[#042354]"
                  }`}
                >
                  {esp}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
