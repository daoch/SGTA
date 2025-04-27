// src/features/academic-cycle-settings/components/DeadlineTableRow.tsx
import React from 'react';
import { Input, Tooltip } from "@heroui/react"; // Asumiendo Date Picker es un Input type="date" o un componente específico
import { DeadlineItem } from '../types';
import { AlertCircle } from 'lucide-react'; // Para indicar fecha pasada

interface DeadlineTableRowProps {
  deadlineItem: DeadlineItem;
  columnKey: keyof DeadlineItem | 'fechaLimiteCol'; // Identificador de la celda a renderizar
  onDateChange: (hitoId: string, newDate: Date | null) => void;
  cycleStartDate?: Date;
  cycleEndDate?: Date;
  isCycleActive: boolean;
}

// Helper para formato YYYY-MM-DD necesario para input date
const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    // Asegurarse que la fecha se interpreta en la zona horaria local para evitar errores de un día
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().split('T')[0];
};

const DeadlineTableRow: React.FC<DeadlineTableRowProps> = ({
  deadlineItem, columnKey, onDateChange, cycleStartDate, cycleEndDate, isCycleActive
}) => {

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Convertir YYYY-MM-DD string a Date object (UTC medianoche) o null
      const newDate = value ? new Date(value + 'T00:00:00Z') : null; 
      onDateChange(deadlineItem.hitoId, newDate);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Comparar solo fechas, no horas

   // Verificar si la fecha límite actual ya pasó
  const hasPassed = deadlineItem.fechaLimiteActual ? deadlineItem.fechaLimiteActual < today : false;
  // Determinar si el input debe estar deshabilitado
  const isDisabled = isCycleActive && hasPassed; 

  switch (columnKey) {
    case 'nombreHito':
      return <span className="font-medium text-sm">{deadlineItem.nombreHito}</span>;
    case 'etapa':
       return <span className="text-sm text-gray-600">{deadlineItem.etapa || '-'}</span>;
    case 'fechaLimiteCol': // Usamos un key diferente para la columna del input
        const minDateStr = cycleStartDate ? formatDateForInput(cycleStartDate) : undefined;
        const maxDateStr = cycleEndDate ? formatDateForInput(cycleEndDate) : undefined;
        
      return (
         <div className="relative flex items-center">
           {/* Asumiendo que el Date Picker de HeroUI es un Input type="date" */}
           {/* Si es un componente, adapta los props */}
           <Input
             type="date"
             aria-label={`Fecha límite para ${deadlineItem.nombreHito}`}
             value={formatDateForInput(deadlineItem.fechaLimiteActual)}
             onChange={handleDateInputChange}
             min={minDateStr}
             max={maxDateStr}
             disabled={isDisabled} // Deshabilitar si ya pasó en ciclo activo
             variant="bordered"
             size="sm"
             className={`w-full ${isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
           />
           {isDisabled && (
              <Tooltip content="La fecha límite ya pasó o está fuera del rango del ciclo." placement="top">
                 <AlertCircle className="h-4 w-4 text-orange-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"/>
              </Tooltip>
           )}
         </div>
      );
    default:
      // Renderizar otros campos de DeadlineItem si se añadieran a las columnas
      return null; 
  }
};
export default DeadlineTableRow;