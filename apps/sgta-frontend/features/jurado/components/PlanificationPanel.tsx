"use client";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import React, { useState } from "react";

import BreadCrumbPlanificacion from "./BreadcrumbPlanification";
import SelectorFecha from "./DateSelector";
import Droppable from "./Droppable";
import { Dispo, Espacio, Exposicion } from "@/features/jurado/types/jurado.types";
import RoomSlot from "./RoomSlot";



interface TimeSlot{
  key : string;
  range : string;
  expo ?: Exposicion;
}

interface Props {
  roomAvailList : Dispo[];
  assignedExpos: Record<string,Exposicion>;
  removeExpo: (expo: Exposicion) => void; 
}  
const PlanificationPanel: React.FC<Props> = ({roomAvailList,assignedExpos,removeExpo}) => {

   const expoDuration = 20;
   const timeSlots:TimeSlot[] = [];

   const [selectedCode, setSelectedCode] = useState<number>(roomAvailList[0]?.code ?? 0)
  

    if(roomAvailList){
      roomAvailList.forEach(dispo => {
        const rangos = generarRangos(dispo.startTime,dispo.endTime,expoDuration);
  
        rangos.forEach(range => {
            dispo.spaces.forEach(space => {
              const key =   dispo.date.toISOString().split("T")[0] + "|" + range.split('-')[0].trim() + "|" + space.code;
              timeSlots.push({
                key : key,
                range: range
              })
            })
        })
     })
  
    }
     
   

   function generarRangos(horaInicio :string, horaFin:string, duracion:number) {
    const rangos = [];
    let horaActual = new Date(`2023-01-01T${horaInicio}:00`); 
    
    const horaFinDate = new Date(`2023-01-01T${horaFin}:00`);
    
    while (horaActual < horaFinDate) {
      const horaFinal = new Date(horaActual.getTime() + duracion * 60000); // duracion en minutos
      const rango = `${horaActual.getHours()}:${horaActual.getMinutes().toString().padStart(2, '0')} - ${horaFinal.getHours()}:${horaFinal.getMinutes().toString().padStart(2, '0')}`;
      rangos.push(rango);
      horaActual = horaFinal;
    }
    
    return rangos;
  }

  const selectedRoom = roomAvailList.find(room => room.code === selectedCode);
  const selectedDateStr = selectedRoom?.date.toISOString().split("T")[0];
  const filteredTimeSlots = timeSlots.filter(slot =>
    slot.key.startsWith(selectedDateStr + "|")
  );
  const uniqueTimeSlots = Array.from(
    new Map(filteredTimeSlots.map(slot => [slot.range, slot])).values()
  );

 
    
    return(
     <section className="h-full w-full flex flex-col gap-6">
        
        <BreadCrumbPlanificacion></BreadCrumbPlanificacion>
        <div className="flex flex-row gap-4">
            {roomAvailList.map(room => (
                <SelectorFecha
                  key={room.code }
                  room ={room} 
                  isSelected={room.code === selectedCode}
                  onSelect={() => setSelectedCode(room.code)}
                >
                </SelectorFecha>
            ))}
            
            <div className="ml-auto">
              <Button
                className="w-full xl:w-auto"
                style={{ background: "#042354" }}
              >
                Siguiente fase
              </Button>
            </div>            
        </div>       

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uniqueTimeSlots.map((timeSlot) => (
          <TimeSlotCard 
            key={timeSlot.key}
            time={timeSlot.range}
            filteredRooms={filteredTimeSlots.filter(e => e.range === timeSlot.range)}
            assignedExpos = {assignedExpos}  
            removeExpo = {removeExpo}
          />
        ))}
      </div>
     </section>
    );

}

function TimeSlotCard({ time ,filteredRooms,assignedExpos, removeExpo}: { time: string, spaces ?: Espacio[], 
  filteredRooms :TimeSlot[] ,assignedExpos: Record<string,Exposicion>, removeExpo : (expo: Exposicion) => void}) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <span className="font-bold text-lg">{time} hrs</span>
          <span className="ml-auto text-gray-500">3 disponibles</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
        {filteredRooms?.map((room) => (
          <Droppable key={room.key} id={room.key} >
            <RoomSlot 
              code={room.key}
              assignedExpos={assignedExpos}
              room={room}
              removeExpo={removeExpo}
            />
          </Droppable>
        ))}
        </div> 
        
      </div>
    )
  }

export default PlanificationPanel;

