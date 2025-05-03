"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import CardSugerenciaDistribucion from "@/features/jurado/components/CardSuggestAlgorithm";
import React, { useState } from "react";

import CardTemaExposicion from "./CardTopicExpo";
import Draggable from "./Draggable";
import { AreaEspecialidad, Exposicion } from "@/features/jurado/types/jurado.types"


interface Props {
    freeExpos: Exposicion[];
    topics : AreaEspecialidad[];
}  
const ExposList: React.FC<Props> = ({ freeExpos,topics }) => {
    const [selectedEspecialidad, setSelectedEspecialidad] = useState('Todos');
    return(
        <section className="w-full h-full flex flex-col  gap-4">
        
        <div className=" pr-6 pt-6 pl-6 flex flex-col gap-4">
          <div className="text-right w-full">
            <p className="bg-white font-semibold text-left">Área de Especialidad</p>
          </div>
          <div className="flex flex-row gap-6 text-right">
            <Input
              type="nombre-docente"
              placeholder="Ingrese el nombre del docente"
              className="rounded-lg w-1/2 border-gray-300 border-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="w-1/2 border-gray-300 border-2 rounded-lg text-left p-1">
                {selectedEspecialidad}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {topics.map((top: AreaEspecialidad) => (
                    <DropdownMenuItem key={top.name}>{top.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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

}

export default ExposList;


     
        
          
        