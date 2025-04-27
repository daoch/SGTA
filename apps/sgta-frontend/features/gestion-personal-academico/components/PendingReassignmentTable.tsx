// src/features/academic-staff-management/components/PendingReassignmentTable.tsx
import React, { useCallback } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Avatar, Button, Tooltip, Pagination
} from "@heroui/react";
import { Eye, RefreshCw } from 'lucide-react'; // Asumiendo RefreshCw para reasignar
import { ProyectoReasignacion } from '../types';

interface PendingReassignmentTableProps {
  proyectos: ProyectoReasignacion[];
  onReassignClick: (proyecto: ProyectoReasignacion) => void;
  onViewDetailsClick?: (proyecto: ProyectoReasignacion) => void; // Opcional
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PendingReassignmentTable: React.FC<PendingReassignmentTableProps> = ({
  proyectos, onReassignClick, onViewDetailsClick,
  currentPage, totalPages, onPageChange
}) => {
  
  const tableColumns = [
    { key: "estudiante", label: "ESTUDIANTE" },
    { key: "titulo", label: "TÍTULO DEL PROYECTO" },
    { key: "asesor_original", label: "ASESOR ORIGINAL" },
    { key: "acciones", label: "ACCIONES" },
  ];

  const renderCell = useCallback((proyecto: ProyectoReasignacion, columnKey: React.Key): React.ReactNode => {
    switch (columnKey) {
      case "estudiante":
        return (
          <div className="max-w-[200px]">
            <p className="text-sm font-medium text-gray-900 truncate">{proyecto.tesista.nombre}</p>
            <p className="text-xs text-gray-500">Código: {proyecto.tesista.codigo}</p>
          </div>
        );
      case "titulo":
        return (
          <p className="text-sm truncate max-w-xs">{proyecto.titulo}</p>
        );
      case "asesor_original":
        return (
          <div className="flex items-center">
            <Avatar src={proyecto.asesorOriginal.avatar} className="mr-2 flex-shrink-0" size="sm" />
            <div>
              <p className="text-sm truncate max-w-[150px]">{proyecto.asesorOriginal.nombre}</p>
            </div>
          </div>
        );
      case "acciones":
        return (
          <div className="flex items-center justify-end gap-1 sm:gap-2"> {/* Ajustar gap y justificación */}
            {onViewDetailsClick && ( // Mostrar solo si se pasa la función
              <Tooltip content="Ver Detalles del Proyecto" delay={300}>
                <Button isIconOnly size="sm" variant="light" className="text-gray-500" onPress={() => onViewDetailsClick(proyecto)}>
                  <Eye size={18} />
                </Button>
              </Tooltip>
            )}
            <Button size="sm" color="primary" variant="solid" onPress={() => onReassignClick(proyecto)}>
               <RefreshCw size={14} className="mr-1 hidden sm:inline"/> Reasignar
            </Button>
          </div>
        );
      default: return null;
    }
  }, [onReassignClick, onViewDetailsClick]); // Dependencias

  return (
    <Table
      aria-label="Tabla de proyectos pendientes de reasignación"
      bottomContent={
        totalPages > 1 ? (
          <div className="flex w-full justify-center my-4">
            <Pagination isCompact showControls showShadow color="primary" page={currentPage} total={totalPages} onChange={onPageChange}/>
          </div>
        ) : null
      }
      classNames={{ wrapper: "min-h-[222px]" }} // Mantener un alto mínimo
    >
      <TableHeader columns={tableColumns}>
        {(column) => (
          <TableColumn key={column.key} align={column.key === "acciones" ? "end" : "start"}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={proyectos}
        emptyContent={
          <div className="p-12 text-center">
            <p className="text-lg text-gray-500 mb-2">No hay proyectos pendientes</p>
            <p className="text-sm text-gray-400">Todos los proyectos tienen un asesor asignado actualmente.</p>
          </div>
        }
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
export default PendingReassignmentTable;