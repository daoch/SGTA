// src/features/advisor-dashboard/components/MyTesistasTable.tsx
import React, { useCallback, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  User as HeroUser, // Renombrar User de HeroUI para evitar conflicto con icono
  Chip, Button, Tooltip, Pagination, Checkbox, // Añadir Checkbox
  Spinner
} from "@heroui/react";
import { TesistaInfo } from '../types';
import { ArrowUpDown, Eye, AlertCircle, CheckCircle, UserMinus } from 'lucide-react'; // Icono para Cese
import Link from 'next/link';
import TesistaStatusChip from './TesistaStatusChip'; // Importar chip de estado
import { SortConfig } from '@/types';

interface MyTesistasTableProps {
  tesistas: TesistaInfo[];
  isLoading: boolean;
  selectedTesistas: Set<string>; // IDs de los seleccionados
  onSelectionChange: (newSelection: Set<string>) => void; // Para actualizar selección
  sortConfig: SortConfig<TesistaInfo>; // <--- Usar tipo genérico
  onSortChange: (key: keyof TesistaInfo) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // onInitiateCessation: (selectedIds: string[]) => void; // Ya no es necesario aquí
  // onNavigateToProject: (projectId: string) => void; // Mejor usar Link directo
}

const MyTesistasTable: React.FC<MyTesistasTableProps> = ({
    tesistas,
    isLoading,
    selectedTesistas, 
    onSelectionChange,
    sortConfig, 
    onSortChange,
    currentPage, 
    totalPages, 
    onPageChange
  }) => {

  const columns = [
    // Columna de Selección
    { key: "nombreEstudiante", label: "ESTUDIANTE", sortable: true },
    { key: "tituloProyecto", label: "TÍTULO PROYECTO", sortable: false }, // Ordenar por título puede ser mucho
    { key: "estadoProyecto", label: "ESTADO ACTUAL", sortable: true },
    { key: "proximoHito", label: "PRÓXIMO HITO", sortable: true },
    { key: "acciones", label: "ACCIONES", align: 'end' },
  ];

   // Formatear fecha
   const formatDate = (isoDate?: string | Date): string => {
     if (!isoDate) return '-';
     return new Date(isoDate).toLocaleDateString();
   };

  const renderCell = useCallback((tesista: TesistaInfo, columnKey: React.Key): React.ReactNode => {
     switch (columnKey) {
        case "nombreEstudiante":
             return <HeroUser avatarProps={{ src: tesista.avatarEstudiante, size: "sm" }} name={tesista.nombreEstudiante} description={tesista.codigoEstudiante} />;
        case "tituloProyecto":
            return <p className="text-sm truncate max-w-xs" title={tesista.tituloProyecto}>{tesista.tituloProyecto}</p>;
        case "estadoProyecto":
            return <TesistaStatusChip status={tesista.estadoProyecto} />;
        case "proximoHito":
            return (
                <div>
                   <p className="text-sm">{tesista.proximoHito || '-'}</p>
                   {tesista.fechaProximoHito && (
                       <p className={`text-xs ${tesista.alerta === 'proximo_vencimiento' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                           {formatDate(tesista.fechaProximoHito)}
                       </p>
                   )}
                   {tesista.alerta === 'sin_entregas_recientes' && <Chip size="sm" variant="light" color="warning" className="mt-1">Sin entregas</Chip>}
                </div>
            );
        case "acciones":
            return (
                 <div className="flex items-center justify-end gap-1">
                    {/* Botón Ver Detalles del Proyecto */}
                     <Tooltip content="Ver Detalles del Proyecto" placement="top">
                       <Link href={`/proyectos/${tesista.projectId}`}>
                           <Button isIconOnly size="sm" variant="light" color="primary">
                               <Eye size={16}/>
                           </Button>
                       </Link>
                    </Tooltip>
                    {/* Botón Iniciar Cese Individual (ya no se usa, se hace con selección) */}
                     {/* {tesista.puedeSolicitarCese && !tesista.ceseSolicitado && (
                         <Tooltip content="Solicitar Cese de Asesoría" placement="top">
                             <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onInitiateCessation([tesista.studentId])}>
                                 <UserMinus size={16}/>
                             </Button>
                         </Tooltip>
                     )} */}
                     {tesista.ceseSolicitado && (
                         <Tooltip content="Solicitud de Cese ya enviada" placement="top">
                             <span className="p-2"> <CheckCircle size={16} className="text-success"/></span>
                         </Tooltip>
                     )}
                </div>
            );
        default: return null;
     }
  }, [selectedTesistas, onSelectionChange]); // Dependencias


  return (
    <Table
      aria-label="Tabla de Tesistas Asignados"
      selectionMode="multiple" // Habilitar selección múltiple nativa si HeroUI lo soporta bien
      selectedKeys={selectedTesistas} // Controlar selección
      onSelectionChange={(keys) => onSelectionChange(keys as Set<string>)} // Manejar cambio de selección
      sortDescriptor={sortConfig.key ? { column: sortConfig.key, direction: sortConfig.direction === 'asc' ? 'ascending' : 'descending' } : undefined}
      onSortChange={({ column, direction }) => onSortChange(column as keyof TesistaInfo)}
      bottomContent={
        totalPages > 1 ? (
          <div className="flex w-full justify-center my-4">
            <Pagination isCompact showControls showShadow color="primary" page={currentPage} total={totalPages} onChange={onPageChange}/>
          </div>
        ) : null
      }
      classNames={{ wrapper: "min-h-[400px]" }} // Alto mínimo
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
             key={column.key} 
             align={column.align === 'end' ? 'end' : (column.key === 'select' || column.key === 'estadoProyecto' ? 'center' : 'start')} 
             allowsSorting={column.sortable}
             className={`${column.key === 'select' ? 'w-12' : ''} ${column.key === 'estadoProyecto' ? 'w-36' : ''} ${column.key === 'proximoHito' ? 'w-40' : ''} ${column.key === 'acciones' ? 'w-24' : ''}`} // Ajustar anchos
           >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
       <TableBody
          items={tesistas}
          isLoading={isLoading}
          loadingContent={<Spinner label="Cargando tesistas..." />}
          emptyContent={
            isLoading ? " " : // Evitar mostrar mensaje si está cargando
            "Aún no tienes tesistas asignados."
        }
       >
        {(item) => (
          <TableRow key={item.studentId}>
            {(columnKey) => <TableCell className="py-2 px-3">{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MyTesistasTable;