"use client";

import { AreaEspecialidad, Tema } from "@/features/jurado/types/jurado.types";
import CardSugerenciaDistribucion from "./CardSuggestAlgorithm";
import CardTemaExposicion from "./CardTopicExpo";
import Draggable from "./Draggable";
import SearchFilter from "./SearchFilter";

interface Props {
  freeExpos: Tema[];
  topics: AreaEspecialidad[];
}

const ExposList: React.FC<Props> = ({ freeExpos, topics }) => {
  return (
    <section className="w-full h-full flex flex-col gap-4">
      <h1 className="font-semibold">Temas</h1>
      <SearchFilter topics={topics}></SearchFilter>

      <CardSugerenciaDistribucion />

      <div className="flex flex-col gap-4">
        {freeExpos.map((freeExpo: Tema) => (
          <Draggable
            id={freeExpo.codigo}
            key={freeExpo.codigo}
            isDraggeable={true}
          >
            <CardTemaExposicion exposicion={freeExpo} />
          </Draggable>
        ))}
      </div>
    </section>
  );
};

export default ExposList;
