"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AreaEspecialidad } from "@/features/jurado/types/jurado.types";
import TemaExposicionCard from "./topic-expo-card";
import Draggable from "./Draggable";
import SearchFilterTemas, { FilterForm } from "./search-filter-temas";
import { usePlanificationStore } from "../../store/use-planificacion-store";
import CardSuggestAlgorithm from "./CardSuggestAlgorithm";
import { Toaster } from "sonner";

interface Props {
  areasEspecialidad: AreaEspecialidad[];
}

const TemasList: React.FC<Props> = ({ areasEspecialidad }) => {
  const { temasSinAsignar } = usePlanificationStore();

  const methods = useForm<FilterForm>({
    defaultValues: { query: "", especialidad: "__all__" },
  });

  const { query, especialidad } = methods.watch();

  const temasFiltrados = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return temasSinAsignar
      .filter((tema) => {
        const matchCodigo = (tema.codigo ?? "").toLowerCase().includes(q);
        const matchJurado = (tema.usuarios ?? []).some(
          (u) =>
            (u.nombres ?? "").toLowerCase().includes(q) ||
            (u.apellidos ?? "").toLowerCase().includes(q),
        );
        const matchArea =
          especialidad === "__all__" ||
          (tema.areasConocimiento ?? []).some((a) => a.nombre === especialidad);
        return (matchCodigo || matchJurado) && matchArea;
      })
      .sort((a, b) => (a.codigo ?? "").localeCompare(b.codigo ?? ""));
  }, [temasSinAsignar, query, especialidad]);

  return (
    <section className="w-full h-full flex flex-col gap-4">
      <h1 className="font-semibold">Temas</h1>

      <FormProvider {...methods}>
        <SearchFilterTemas areasEspecialidad={areasEspecialidad} />
      </FormProvider>

      <CardSuggestAlgorithm />

      <div className="flex flex-col gap-4">
        {temasFiltrados.map((tema, idx) => {
          const key = tema.codigo ?? tema.id?.toString() ?? `tema-${idx}`;
          return (
            <Draggable key={key} id={key} isDraggeable>
              <TemaExposicionCard exposicion={tema} />
            </Draggable>
          );
        })}
      </div>
      <Toaster position="bottom-right" richColors />
    </section>
  );
};

export default TemasList;
