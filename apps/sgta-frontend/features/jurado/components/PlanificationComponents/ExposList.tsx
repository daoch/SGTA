"use client";



import {
  AreaEspecialidad,
  Tema,
} from "@/features/jurado/types/jurado.types";


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
    <section className="w-full h-full flex flex-col  gap-4">
      <div className=" pr-6 pt-6 pl-6 flex flex-col gap-4">
        <div className="text-right w-full">
          <p className="bg-white font-semibold text-left">
            Área de Especialidad
          </p>
        </div>
        <div className="flex flex-row gap-6 text-right">
          <SearchFilter topics={topics}></SearchFilter>
        </div>
      </div>

      <div className=" px-6">
        <CardSugerenciaDistribucion />
      </div>

      <div className=" px-6 ">
        <div className="space-y-4 flex flex-col">
          {freeExpos.map((freeExpo: Tema) => (
            <Draggable id={freeExpo.codigo} key={freeExpo.codigo} isDraggeable={true}>
              <CardTemaExposicion exposicion={freeExpo} />
            </Draggable>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExposList;
