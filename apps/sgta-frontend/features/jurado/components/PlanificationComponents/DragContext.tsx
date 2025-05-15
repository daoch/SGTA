// DragContext.tsx
import { createContext, useContext } from "react";

export const DragContext = createContext(false);
export const useIsDragging = () => useContext(DragContext);
