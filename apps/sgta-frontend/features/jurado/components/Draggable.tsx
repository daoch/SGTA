'use client'
import { useDraggable } from '@dnd-kit/core';

export default function Draggable(props:any) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <div 
     suppressHydrationWarning ref={setNodeRef} 
     style={style}
     {...listeners}
     {...attributes}>
     {props.children}
    </div>
  );
}