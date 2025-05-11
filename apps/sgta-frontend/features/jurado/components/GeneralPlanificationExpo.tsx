"use client";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState, useTransition } from "react";
import { JornadaExposicionDTO } from "../dtos/JornadExposicionDTO";
import { AreaEspecialidad, Tema, TimeSlot } from "../types/jurado.types";
import ExposList from "./ExposList";
import PlanificationPanel from "./PlanificationPanel";
import { updateBloquesListFirstTime } from "../actions/actions";


interface Props {
  expos: Tema[];
  topics: AreaEspecialidad[];
  roomAvailList: JornadaExposicionDTO[];
  bloquesList: TimeSlot[];
  exposicionId: number;
}

const GeneralPlanificationExpo: React.FC<Props> = ({
  expos,
  topics,
  bloquesList,
  roomAvailList,
  exposicionId,
}: Props) => {
  const [freeExpos, setFreeExpos] = useState<Tema[]>(expos);
  const [assignedExpos, setAssignedExpos] = useState<Record<string, Tema>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const assigned: Record<string, Tema> = {};
    const assignedTemaIds = new Set<string>();
  
    for (const bloque of bloquesList) {
      const temaAsignado = expos.find((tema) => tema.codigo === bloque.expo?.codigo); // O ajusta el campo según sea necesario
      if (temaAsignado) {
        assigned[bloque.key] = temaAsignado;
        assignedTemaIds.add(temaAsignado.codigo);
      }
    }
  
    const free = expos.filter((tema) => !assignedTemaIds.has(tema.codigo));
  
    setAssignedExpos(assigned);
    setFreeExpos(free);
  }, [bloquesList, expos]);

  console.log({assignedExpos});
  console.log({freeExpos});
  /*Handles the drag and drop event for the expositions*/
  function handleDragEnd(event: DragEndEvent) {

    const { active, over } = event;

    /*validates that the drop occurs in a valid and different location from the original one.*/
    if (!over || active.id === over.id) return;

    const expoId = active.id;
    const spaceId = over.id;
    /*checks if the item being dragged is in the list of unassigned expositions.*/
    const chosenExpo = freeExpos.find((e) => e.codigo === expoId);

    if (chosenExpo) {
      /*If it's in the unassigned list, it's removed from there and added to the assigned list*/
      if (spaceId in assignedExpos) {
        return;
      }

      const newAssignment = {
        [spaceId]: chosenExpo,
      };
      setAssignedExpos((prevAssignment) => ({
        ...prevAssignment,
        ...newAssignment,
      }));

      setFreeExpos((prev) => prev.filter((e) => e.codigo !== expoId));
    } else {
      /*If it's not in the unassigned list, it means it was already assigned,
           so we remove it from its previous assignment and reassign it to the new location.*/
      const chosenExpo = Object.values(assignedExpos).find(
        (a) => a.codigo === expoId,
      );
      if (chosenExpo) {
        const newAssignment = {
          [spaceId]: chosenExpo,
        };
        const updatedAssignment = Object.keys(assignedExpos)
          .filter((key) => assignedExpos[key].codigo !== chosenExpo.codigo)
          .reduce((acc: Record<string, Tema>, key) => {
            acc[key] = assignedExpos[key];
            return acc;
          }, {});

        setAssignedExpos(() => ({
          ...updatedAssignment,
          ...newAssignment,
        }));
      }
    }
  }

  const removeExpo = (expo: Tema) => {
    //find the click expo
    const clickedExpo = Object.values(assignedExpos).find(
      (a) => a.id === expo.id,
    );

    if (clickedExpo) {
      //if we find it , add to free expos
      setFreeExpos((prev) => [...prev, clickedExpo]);
      //and remove from assigned expos
      setAssignedExpos((prev) => {
        const updatedAssignment = { ...prev };
        Object.keys(updatedAssignment).forEach((key) => {
          if (updatedAssignment[key].id === expo.id) {
            delete updatedAssignment[key];
          }
        });
        return updatedAssignment;
      });
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 20,
    },
  });

  const onSiguienteFaseClick = ()=>{

    if(freeExpos.length > 0 ){
      console.log("No puede dejar temas sin asignar");
      return;
    }

    const bloquesListToInsert: TimeSlot[] = bloquesList.map((bloque) => {
      const temaAsignado = assignedExpos[bloque.key];
      return {
        ...bloque,
        expo: temaAsignado ? temaAsignado : undefined,
        idExposicion: exposicionId,

      };
    });

    startTransition(async () => {
       await updateBloquesListFirstTime(bloquesListToInsert); 
    });

    
    /*PARA EXPOSICION TEMA NECESITAMOS  EXPO ID , TEMA ID
    /*PARA EL BLOQUE EXPOSICION SOLO NECESITAMOS EL ID Y SI TIENE UN ID ASIGNADO  EN TEMA*/

    
    console.log("Lista final de bloques con expos asignadas:", bloquesListToInsert);
    

  }

  const sensors = useSensors(mouseSensor);

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col md:flex-row gap-2  flex-1 min-h-0">
        <div className="w-full md:w-1/4  h-full">
          <ExposList freeExpos={freeExpos} topics={topics} />
        </div>

        <div className="bg-gray-300 w-full h-px md:w-px md:h-auto"></div>
        <div className="flex flex-col w-full md:w-3/4 overflow-y-auto gap-4">
          <PlanificationPanel
            roomAvailList={roomAvailList}
            assignedExpos={assignedExpos}
            removeExpo={removeExpo}
            onSiguienteFaseClick ={onSiguienteFaseClick}
            bloquesList={bloquesList}
          />
        </div>
      </div>
    </DndContext>
  );
};

export default GeneralPlanificationExpo;
