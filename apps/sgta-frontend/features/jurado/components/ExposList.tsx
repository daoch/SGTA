"use client";

import CardSugerenciaDistribucion from "@/features/jurado/components/CardSuggestAlgorithm";


import CardTemaExposicion from "./CardTopicExpo";
import Draggable from "./Draggable";
import { AreaEspecialidad, Exposicion } from "@/features/jurado/types/jurado.types";
import SearchFilter from "./SearchFilter";


interface Props {
    freeExpos: Exposicion[];
    topics : AreaEspecialidad[];
}  
const ExposList: React.FC<Props> = ({ freeExpos,topics }) => {
    
    return(
        <section className="w-full h-full flex flex-col  gap-4">
        
        <div className=" pr-6 pt-6 pl-6 flex flex-col gap-4">
          <div className="text-right w-full">
            <p className="bg-white font-semibold text-left">Área de Especialidad</p>
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
          {freeExpos.map((freeExpo: Exposicion) => (
            <Draggable id={freeExpo.code} key={freeExpo.code}>
              <CardTemaExposicion exposicion={freeExpo} />
            </Draggable>
          ))}
          </div>
        </div>
      </section>
    );

};

export default ExposList;


     
        
          
        