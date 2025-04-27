// src/features/configuracion-academica/components/AreaTematicaTable.tsx
import React, { useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Tooltip, Chip, Spinner } from "@heroui/react";
import { AreaTematica } from '../types';
import { EditIcon, DeleteIcon } from 'lucide-react'; // Asumiendo iconos definidos
import { BookCopy, Users } from 'lucide-react'; // O iconos relevantes

interface AreaTematicaTableProps {
  areas: AreaTematica[];
  isLoading: boolean; // Loading general
  onEdit: (area: AreaTematica) => void;
  onDelete: (area: AreaTematica) => void; // Pasa el objeto completo para el modal
}

const AreaTematicaTable: React.FC<AreaTematicaTableProps> = ({ areas, isLoading, onEdit, onDelete }) => {

  const columns = [
    { key: "nombre", label: "NOMBRE ÁREA TEMÁTICA" },
    { key: "descripcion", label: "DESCRIPCIÓN" },
    { key: "uso", label: "USO ACTUAL" },
    { key: "fechaModificacion", label: "ÚLT. MODIFICACIÓN" },
    { key: "acciones", label: "ACCIONES" },
  ];

  // Formatear fecha
  const formatDate = (isoDate?: string | Date): string => {
    if (!isoDate) return '-';
    return new Date(isoDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCell = useCallback((area: AreaTematica, columnKey: React.Key): React.ReactNode => {
    switch (columnKey) {
      case "nombre":
        return <span className="font-semibold text-sm">{area.nombre}</span>;
      case "descripcion":
        return <p className="text-sm text-gray-600 max-w-md truncate" title={area.descripcion}>{area.descripcion || '-'}</p>;
      case "uso":
        return (
          <div className="flex items-center gap-3 text-xs">
            <Chip size="sm" variant="flat" startContent={<BookCopy size={14}/>}>{area.proyectosAsociados ?? 0} Proy.</Chip>
            <Chip size="sm" variant="flat" startContent={<Users size={14}/>}>{area.asesoresAsociados ?? 0} Ases.</Chip>
          </div>
        );
       case "fechaModificacion":
          return <span className="text-sm text-gray-500">{formatDate(area.fechaModificacion)}</span>;
      case "acciones":
        // Validar si se puede eliminar (simulado aquí, idealmente vendría del backend)
        const canDelete = (area.proyectosAsociados ?? 0) === 0 && (area.asesoresAsociados ?? 0) === 0;
        return (
          <div className="relative flex items-center justify-end gap-1">
            <Tooltip content="Editar Área">
              <Button isIconOnly size="sm" variant="light" className="text-gray-600 hover:text-primary" onPress={() => onEdit(area)}>
                <EditIcon className="w-4 h-4"/>
              </Button>
            </Tooltip>
            <Tooltip content={canDelete ? "Eliminar Área" : "No se puede eliminar (en uso)"} color={canDelete ? "danger" : "default"}>
              {/* El span wrapper es necesario para que el Tooltip funcione en botones deshabilitados */}
              <span className={`${!canDelete ? 'cursor-not-allowed' : ''}`}>
                <Button
                  isIconOnly size="sm" variant="light" className="text-danger hover:text-danger-600"
                  onPress={() => canDelete ? onDelete(area) : null}
                  isDisabled={!canDelete} // Deshabilitar si no se puede eliminar
                >
                  <DeleteIcon className="w-4 h-4"/>
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      default: return null;
    }
  }, [onEdit, onDelete]);

  return (
     <Table aria-label="Tabla de Áreas Temáticas">
        <TableHeader columns={columns}>
            {(column) => (
                <TableColumn key={column.key} align={column.key === 'acciones' ? 'end' : 'start'}>
                    {column.label}
                </TableColumn>
            )}
        </TableHeader>
        <TableBody
            items={areas}
            isLoading={isLoading}
            loadingContent={<Spinner label="Cargando áreas..." />}
            emptyContent={"No se encontraron áreas temáticas. ¡Crea la primera!"}
        >
            {(item) => (
                <TableRow key={item.id}>
                    {(columnKey) => <TableCell className="py-3 px-4">{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
            )}
        </TableBody>
    </Table>
  );
};
export default AreaTematicaTable;