// src/features/academic-staff-management/components/ProfessorHabilitationTable.tsx
import React, { useCallback } from 'react';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    User, Chip, Tooltip, Button, Pagination, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import { Profesor, SortConfig } from '../types';
import { Eye, AlertCircle, Check, X } from 'lucide-react';
import Link from 'next/link';

// Icono para dropdown
const MoreVerticalIcon = (props: any) => (
    <svg {...props} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M10.0002 11.0416C10.5752 11.0416 11.0418 10.575 11.0418 9.99996C11.0418 9.42496 10.5752 8.95829 10.0002 8.95829C9.42518 8.95829 8.95851 9.42496 8.95851 9.99996C8.95851 10.575 9.42518 11.0416 10.0002 11.0416Z" stroke="currentColor" strokeWidth="1.5"/>
       <path d="M10.0002 5.20829C10.5752 5.20829 11.0418 4.74163 11.0418 4.16663C11.0418 3.59163 10.5752 3.12496 10.0002 3.12496C9.42518 3.12496 8.95851 3.59163 8.95851 4.16663C8.95851 4.74163 9.42518 5.20829 10.0002 5.20829Z" stroke="currentColor" strokeWidth="1.5"/>
       <path d="M10.0002 16.875C10.5752 16.875 11.0418 16.4083 11.0418 15.8333C11.0418 15.2583 10.5752 14.7916 10.0002 14.7916C9.42518 14.7916 8.95851 15.2583 8.95851 15.8333C8.95851 16.4083 9.42518 16.875 10.0002 16.875Z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
);

interface ProfessorHabilitationTableProps {
  profesores: Profesor[];
  isLoading: boolean;
  actionLoading: { [key: string]: boolean };
  sortConfig: SortConfig;
  onSortChange: (key: keyof Profesor) => void;
  onToggleHabilitation: (profesorId: string, tipo: 'asesor' | 'jurado', newState: boolean) => void;
  onInitiateCessation: (profesor: Profesor) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // Props para selección
  selectedKeys?: "all" | Set<string | number>;
  onSelectionChange: (keys: "all" | Set<string | number>) => void;
}

const ProfessorHabilitationTable: React.FC<ProfessorHabilitationTableProps> = ({
  profesores, 
  isLoading, 
  actionLoading, 
  sortConfig, 
  onSortChange,
  onToggleHabilitation, 
  onInitiateCessation,
  currentPage, 
  totalPages, 
  onPageChange,
  selectedKeys,
  onSelectionChange
}) => {

  const columns = [
    { name: "NOMBRE", uid: "nombre", sortable: true },
    { name: "CÓDIGO PUCP", uid: "codigoPucp", sortable: true },
    { name: "ROL ACADÉMICO", uid: "rolAcademico", sortable: true },
    { name: "HABILITACIONES", uid: "habilitaciones" }, 
    { name: "Nº TESIS (Asesor)", uid: "numTesis", sortable: true },
    { name: "ACCIONES", uid: "acciones", align: "end" }
  ];

  // Determinar qué filas se pueden seleccionar
  const disabledKeys = profesores
    .filter(p => p.academicStatus === 'cessation_in_progress')
    .map(p => p.id);

  const renderCell = useCallback((profesor: Profesor, columnKey: React.Key): React.ReactNode => {
    const cellValue = profesor[columnKey as keyof Profesor];
    const isAsesorActionLoading = actionLoading[`${profesor.id}-asesor`];
    const isJuradoActionLoading = actionLoading[`${profesor.id}-jurado`];
    const isRowLoading = isAsesorActionLoading || isJuradoActionLoading;

    switch (columnKey) {
      case "nombre":
         return <User 
                  avatarProps={{ 
                    src: profesor.avatar || `https://i.pravatar.cc/150?u=${profesor.id}`, 
                    size: "sm" 
                  }} 
                  description={profesor.email} 
                  name={profesor.nombre}
                >
                  {profesor.email}
                </User>;
      
      case "codigoPucp": 
         return <div className="font-medium text-sm">{profesor.codigoPucp ?? '-'}</div>;
      
      case "rolAcademico": 
         return <div className="text-sm text-gray-700">{profesor.rolAcademico ?? '-'}</div>;
      
      case "habilitaciones":
        return (
          <div className="flex items-center gap-2 justify-start relative">
            <Chip 
              className="capitalize cursor-default"
              color={profesor.habilitadoAsesor ? "success" : "default"} 
              size="sm" 
              variant="flat"
            >
              Asesor
            </Chip>
            {profesor.academicStatus === 'cessation_in_progress' && (
              <Tooltip content="Proceso de cese iniciado. Reasignar tesis.">
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </Tooltip>
            )}
            <Chip 
              className="capitalize cursor-default" 
              color={profesor.habilitadoJurado ? "primary" : "default"} 
              size="sm" 
              variant="flat"
            >
              Jurado
            </Chip>
          </div>
        );
      
      case "numTesis":
         return (
           <div className="text-center">
             <Chip 
               size="sm" 
               variant={profesor.numTesis > 0 ? "flat" : "bordered"} 
               color={profesor.numTesis > 0 ? "warning" : "default"} 
               className="w-10 justify-center"
             >
               {profesor.numTesis}
             </Chip>
           </div>
         );
      
      case "acciones":
        return (
          <div className="relative flex items-center justify-end gap-0">
            <Tooltip content="Ver perfil detallado" placement="top">
              <Link href={`/personal-academico/perfil/${profesor.id}`}>
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  className="text-blue-600" 
                  aria-label="Ver perfil"
                >
                  <Eye size={18} />
                </Button>
              </Link>
            </Tooltip>
            
            {/* Dropdown para acciones de habilitación */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  className="text-gray-600" 
                  aria-label="Acciones de Habilitación"
                >
                  <MoreVerticalIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label={`Acciones para ${profesor.nombre}`}
                variant="flat"
                // Deshabilitar acciones si hay una acción en curso o si está en proceso de cese
                disabledKeys={
                  isRowLoading 
                    ? ["toggle_asesor", "toggle_jurado"] 
                    : (profesor.academicStatus === 'cessation_in_progress' 
                        ? ["toggle_asesor"] 
                        : []
                      )
                }
                onAction={(key) => {
                  if (key === "toggle_asesor") {
                    // Si es asesor habilitado con tesis, llamamos a initiateCessation para mostrar el modal
                    if (profesor.habilitadoAsesor && profesor.numTesis > 0) {
                      onInitiateCessation(profesor);
                    } else {
                      // Si no tiene tesis o no está habilitado, hacemos el toggle directo
                      onToggleHabilitation(profesor.id, 'asesor', !profesor.habilitadoAsesor);
                    }
                  }
                  if (key === "toggle_jurado") {
                    onToggleHabilitation(profesor.id, 'jurado', !profesor.habilitadoJurado);
                  }
                }}
              >
                <DropdownItem
                  key="toggle_asesor"
                  startContent={
                    isAsesorActionLoading 
                      ? <Spinner size="sm"/> 
                      : (profesor.habilitadoAsesor 
                          ? <X className="w-4 h-4 text-danger-500" /> 
                          : <Check className="w-4 h-4 text-success-500" />
                        )
                  }
                  className={profesor.habilitadoAsesor ? "text-danger" : "text-success"}
                  color={profesor.habilitadoAsesor ? "danger" : "success"}
                  description={
                    profesor.academicStatus === 'cessation_in_progress' 
                      ? "Cese en proceso" 
                      : (profesor.habilitadoAsesor && profesor.numTesis > 0 
                          ? `${profesor.numTesis} tesis activas` 
                          : undefined
                        )
                  }
                >
                  {isAsesorActionLoading 
                    ? 'Actualizando...' 
                    : (profesor.habilitadoAsesor 
                        ? 'Deshabilitar Asesor' 
                        : 'Habilitar Asesor'
                      )
                  }
                </DropdownItem>
                
                <DropdownItem
                  key="toggle_jurado"
                  startContent={
                    isJuradoActionLoading 
                      ? <Spinner size="sm"/> 
                      : (profesor.habilitadoJurado 
                          ? <X className="w-4 h-4 text-danger-500" /> 
                          : <Check className="w-4 h-4 text-primary-500" />
                        )
                  }
                  className={profesor.habilitadoJurado ? "text-danger" : "text-primary"}
                  color={profesor.habilitadoJurado ? "danger" : "primary"}
                >
                   {isJuradoActionLoading 
                     ? 'Actualizando...' 
                     : (profesor.habilitadoJurado 
                         ? 'Deshabilitar Jurado' 
                         : 'Habilitar Jurado'
                       )
                   }
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      
      default: 
        return cellValue?.toString() ?? "-";
    }
  }, [actionLoading, onToggleHabilitation, onInitiateCessation]);

  return (
     <Table
        aria-label="Tabla de habilitación académica de profesores activos"
        // --- Props de Ordenamiento ---
        sortDescriptor={sortConfig.key ? { column: sortConfig.key, direction: sortConfig.direction === 'asc' ? 'ascending' : 'descending' } : undefined}
        onSortChange={({ column, direction }) => onSortChange(column as keyof Profesor)}
        // --- Props de Paginación ---
        bottomContent={
          totalPages > 1 ? (
            <div className="flex w-full justify-center my-4">
              <Pagination isCompact showControls showShadow color="primary" page={currentPage} total={totalPages} onChange={onPageChange}/>
            </div>
          ) : null
        }
        // --- Props de Selección ---
        selectionMode="multiple"
        selectionBehavior="toggle"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        disabledKeys={disabledKeys}
        classNames={{ 
          wrapper: "min-h-[400px]",
          tr: "transition-colors",
          td: "py-2 px-3"
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn 
              key={column.uid} 
              align={column.uid === "acciones" ? "end" : (column.uid === "numTesis" ? "center" : "start")} 
              allowsSorting={column.sortable}
              className={column.uid === "numTesis" ? "text-center" : ""}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
         <TableBody
            items={profesores}
            isLoading={isLoading}
            loadingContent={<Spinner label="Cargando profesores..." color="primary"/>}
            emptyContent={
                isLoading ? " " : // Evitar mostrar "No hay" mientras carga inicialmente
                "No se encontraron profesores activos que coincidan con los filtros."
            }
         >
          {(item) => (
            <TableRow 
              key={item.id} 
              className={item.academicStatus === 'cessation_in_progress' ? 'opacity-70 bg-orange-50/30' : ''}
            >
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>} 
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
};

export default ProfessorHabilitationTable;