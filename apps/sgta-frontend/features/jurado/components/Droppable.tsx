"use client";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
    id: string; // El id único de cada contenedor
    children: React.ReactNode; // Los elementos hijos (el Container en este caso)
};

export default function Droppable({ id, children }: Props) {
    const { isOver, setNodeRef } = useDroppable({
        id: id, // El id único del contenedor
    });

    return (
        <div  
            suppressHydrationWarning ref={setNodeRef} 
            className={`border-0 ${isOver ? "border-blue-500" : "border-gray-300"}`}>
            {children}
        </div>
    );
}