import { useDndMonitor } from "@dnd-kit/core";

export function DragMonitor({
  setIsDragging,
}: {
  setIsDragging: (val: boolean) => void;
}) {
  useDndMonitor({
    onDragStart() {
      setIsDragging(true);
    },
    onDragEnd() {
      setIsDragging(false);
    },
    onDragCancel() {
      setIsDragging(false);
    },
  });

  return null; // no renderiza nada
}
