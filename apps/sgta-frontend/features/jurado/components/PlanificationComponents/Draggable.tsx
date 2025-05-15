"use client";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  isDraggeable :boolean;
}
export default function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    disabled:! props.isDraggeable,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      suppressHydrationWarning
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
}
