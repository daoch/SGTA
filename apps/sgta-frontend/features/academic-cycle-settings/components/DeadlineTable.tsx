// src/features/academic-cycle-settings/components/DeadlineTable.tsx
import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@heroui/react"; // Asumiendo Spinner de HeroUI
import { Info } from 'lucide-react';
import { DeadlineItem, CicloAcademico } from '../types';
import DeadlineTableRow from './DeadlineTableRow'; 

interface DeadlineTableProps {
  deadlines: DeadlineItem[];
  onDateChange: (hitoId: string, newDate: Date | null) => void;
  cycleDetails: CicloAcademico | null; 
  isLoading: boolean;
}

const DeadlineTable: React.FC<DeadlineTableProps> = ({
  deadlines, onDateChange, cycleDetails, isLoading
}) => {

  // --- Definición de Columnas ---
  const tableColumns = [
    { key: "nombreHito", label: "HITO / ENTREGABLE" },
    { key: "etapa", label: "ETAPA" },
    // *** ASEGÚRATE QUE ESTA KEY COINCIDA CON EL CASE EN DeadlineTableRow ***
    { key: "fechaLimite", label: "FECHA LÍMITE" }, 
    // { key: "notas", label: "NOTAS" }, // Opcional
  ];

  if (isLoading) {
      return <div className="text-center py-10"><Spinner label="Cargando fechas..." color="primary"/></div>; 
  }
  if (!cycleDetails) {
      return <p className="text-center text-gray-500 py-6 px-4">Seleccione un ciclo académico para ver o definir sus fechas límite.</p>;
  }
  // No mostrar tabla si no hay hitos definidos, incluso si no está cargando
  if (deadlines.length === 0) {
      return <p className="text-center text-gray-500 py-6 px-4">No se han definido hitos para configurar fechas en este ciclo.</p>;
  }


  return (
    // Contenedor con borde y overflow
    <div className="border rounded-lg overflow-hidden shadow-sm bg-card"> 
      <Table 
        aria-label="Tabla de fechas límite del ciclo"
        // Remover bottomContent si no usas paginación aquí
      >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn 
               key={column.key} 
               // Ajustar alineación y ancho según necesidad
               className={`${column.key === 'fechaLimite' ? 'w-48' : ''} ${column.key === 'etapa' ? 'w-24 text-center' : ''}`}
               align={column.key === 'etapa' ? 'center' : 'start'}
            >
               <div className={`flex items-center ${column.key === 'etapa' ? 'justify-center' : ''}`}>
                   {column.label}
                   {/* Tooltips opcionales */}
                   {/* {column.key === 'fechaLimite' && <Tooltip...><Info.../></Tooltip>} */}
               </div>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          items={deadlines} 
          // No necesitas emptyContent aquí si ya lo manejas arriba
        >
          {(item) => (
            <TableRow key={item.hitoId}>
              {(columnKey) => ( // Asegúrate que columnKey se pasa correctamente
                <TableCell className={columnKey === 'etapa' ? 'text-center' : ''}> 
                   <DeadlineTableRow 
                      deadlineItem={item} 
                      // Pasar la key correcta a DeadlineTableRow
                      columnKey={columnKey === 'fechaLimite' ? 'fechaLimiteCol' : (columnKey as keyof DeadlineItem)} 
                      onDateChange={onDateChange}
                      cycleStartDate={cycleDetails?.fechaInicio ? new Date(cycleDetails.fechaInicio) : undefined}
                      cycleEndDate={cycleDetails?.fechaFin ? new Date(cycleDetails.fechaFin) : undefined}
                      isCycleActive={cycleDetails?.estado === 'activo'}
                   />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default DeadlineTable;