"use client";
import { useDraggable } from "@dnd-kit/core";
import React from "react";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  isDraggeable: boolean;
}

export default function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.id,
      disabled: !props.isDraggeable,
    });

  // Separamos la traslación y la escala para control independiente
  const translate = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined;

  // Estilo del contenedor raíz: movimiento y cursor
  const rootStyle = {
    transform: translate,
    //zIndex: isDragging ? 900 : undefined,
    cursor: props.isDraggeable ? (isDragging ? "grabbing" : "grab") : "default",
  } as React.CSSProperties;

  // Estilo interno: solo escala y transición en el shrink
  const innerStyle = {
    transform: `scale(${isDragging ? 0.6 : 1})`,
    transition: isDragging ? "transform 0.5s ease" : undefined,
  } as React.CSSProperties;

  return (
    <div
      suppressHydrationWarning
      ref={setNodeRef}
      style={rootStyle}
      {...listeners}
      {...attributes}
    >
      <div style={innerStyle}>{props.children}</div>
    </div>
  );
}
