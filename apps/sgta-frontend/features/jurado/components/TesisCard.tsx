"use client";

import React from "react";
import { JuradoTemasDetalle } from "@/features/jurado/types/juradoDetalle.types";
import { cn } from "@/lib/utils";

interface ListaTesisJuradoCardProps {
  data: JuradoTemasDetalle[];
  onSelect?: (tesis: JuradoTemasDetalle) => void;
  selected?: JuradoTemasDetalle | null;
  onCardClick?: (id: number) => void;
}

export const ListaTesisJuradoCard: React.FC<ListaTesisJuradoCardProps> = ({
  data,
  onSelect,
  selected,
  onCardClick,
}) => {
  const isSelected = (tesis: JuradoTemasDetalle) => {
    return selected?.codigo === tesis.codigo;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
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
                onCardClick(tesis.id);
              }
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-sm">
                  {tesis.codigo} - {tesis.titulo}
                </h2>
                <div className="text-sm text-muted-foreground mt-1 pt-1">
                  {tesis.estudiantes.map((est) => est.nombre).join(", ")}
                </div>
              </div>
              <span
                className="text-sm font-medium px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor:
                    tesis.rol === "Asesor" ? "#F9D534" : "#d2a5fd",
                  color: tesis.rol === "Asesor" ? "#000000" : "#ffffff",
                }}
              >
                {tesis.rol}
              </span>
            </div>

            <p className="text-sm text-justify pt-2">{tesis.resumen}</p>

            <div className="flex gap-2 flex-wrap mt-2 pt-2">
              {tesis.sub_areas_conocimiento.map((esp, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-2.5 rounded-full"
                >
                  {esp.nombre}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

