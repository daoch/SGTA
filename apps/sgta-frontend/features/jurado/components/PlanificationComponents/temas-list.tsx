"use client";

import { AreaEspecialidad, Tema } from "@/features/jurado/types/jurado.types";
import CardSugerenciaDistribucion from "./CardSuggestAlgorithm";
import TemaExposicionCard from "./topic-expo-card";
import Draggable from "./Draggable";
import SearchFilter from "./search-filter-temas";
import { usePlanificationStore } from "../../store/use-planificacion-store";

interface Props {
  areasEspecialidad: AreaEspecialidad[];
}

const TemasList: React.FC<Props> = ({ areasEspecialidad }) => {
  const { temasSinAsignar: temas } = usePlanificationStore();

  return (
    <section className="w-full h-full flex flex-col gap-4">
      <h1 className="font-semibold">Temas</h1>
      <SearchFilter topics={areasEspecialidad} />

      <CardSugerenciaDistribucion />

      <div className="flex flex-col gap-4">
        {temas.map((tema: Tema, index: number) => (
          <Draggable
            id={tema.codigo ?? tema.id?.toString() ?? `tema-${index}`}
            key={tema.codigo ?? tema.id?.toString() ?? `tema-${index}`}
            isDraggeable={true}
          >
            <TemaExposicionCard exposicion={tema} />
          </Draggable>
        ))}
      </div>
    </section>
  );
};

export default TemasList;
