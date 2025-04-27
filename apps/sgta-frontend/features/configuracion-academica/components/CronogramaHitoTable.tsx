// src/features/configuracion-academica/components/CronogramaHitoTable.tsx
import React, { useCallback } from 'react';
import { 
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
    Chip, Button, Tooltip 
} from "@heroui/react";
import { Hito } from '../types';
import { EditIcon, DeleteIcon } from 'lucide-react'; // Asumiendo iconos de HeroUI
import { FileText, Presentation, UserCheck, Users, GripVertical, Plus } from 'lucide-react'; // Iconos de Lucide

interface CronogramaHitoTableProps {
    hitos: Hito[];
    esEditable: boolean;
    onEditHito: (hito: Hito) => void;
    onDeleteHito: (hito: Hito) => void;
    // onReorder?: (hitos: Hito[]) => void; // Para Drag & Drop si se implementa
    onAddHito: () => void;
}

// Definir columnas fuera para mejor rendimiento
const columnsEditable = [
    { key: "orderHandle", label: "" }, // Para Drag & Drop
    { key: "orden", label: "Orden" },
    { key: "tipo", label: "Tipo" },
    { key: "nombre", label: "Nombre Hito" },
    { key: "descripcion", label: "Descripción" },
    { key: "semana", label: "Semana" },
    { key: "requisitos", label: "Requisitos" },
    { key: "acciones", label: "Acciones" }
];
const columnsReadOnly = [
    // Sin Drag Handle ni Acciones
    { key: "orden", label: "Orden" },
    { key: "tipo", label: "Tipo" },
    { key: "nombre", label: "Nombre Hito" },
    { key: "descripcion", label: "Descripción" },
    { key: "semana", label: "Semana" },
    { key: "requisitos", label: "Requisitos" },
];


const CronogramaHitoTable: React.FC<CronogramaHitoTableProps> = ({
    hitos, esEditable, onEditHito, onDeleteHito, onAddHito //, onReorder 
}) => {

    const columnsToRender = esEditable ? columnsEditable : columnsReadOnly;

    const renderCell = useCallback((hito: Hito, columnKey: React.Key) => {
        switch (columnKey) {
             case "orderHandle":
                return <span className="cursor-grab text-gray-400"><GripVertical size={18} /></span>; // Icono para DND
            case "orden":
                return <span className="text-sm font-medium text-gray-700">{hito.orden}</span>;
            case "tipo":
                return (
                    <Chip 
                       size="sm" 
                       variant="flat"
                       color={hito.tipo === 'Entregable' ? "primary" : "secondary"} // Ajustar colores
                       startContent={
                           hito.tipo === 'Entregable' 
                           ? <FileText size={14} /> 
                           : <Presentation size={14} />
                       }
                       className="capitalize"
                    >
                        {hito.tipo}
                    </Chip>
                );
            case "nombre":
                return <span className="text-sm font-semibold text-gray-900">{hito.nombre}</span>;
            case "descripcion":
                return <span className="text-sm text-gray-500 max-w-xs truncate" title={hito.descripcion}>{hito.descripcion || "-"}</span>;
            case "semana":
                return <span className="text-sm text-gray-700">Semana {hito.semana}</span>;
            case "requisitos":
                return (
                    <div className="flex flex-col space-y-1 items-start">
                        {hito.requiereAsesor && <Chip size="sm" variant="bordered" color="success" startContent={<UserCheck size={14}/>}>Asesor</Chip>}
                        {hito.requiereJurado && <Chip size="sm" variant="bordered" color="warning" startContent={<Users size={14}/>}>Jurado</Chip>}
                        {!hito.requiereAsesor && !hito.requiereJurado && <span className="text-xs text-gray-400 italic">N/A</span>}
                    </div>
                );
            case "acciones":
                return (
                    <div className="relative flex items-center justify-center gap-2"> {/* Centrar acciones */}
                        <Tooltip content="Editar Hito">
                            <Button isIconOnly size="sm" variant="light" className="text-gray-600" onPress={() => onEditHito(hito)}>
                                <EditIcon className="w-4 h-4"/> 
                            </Button>
                        </Tooltip>
                        <Tooltip content="Eliminar Hito" color="danger">
                            <Button isIconOnly size="sm" variant="light" className="text-danger" onPress={() => onDeleteHito(hito)}>
                                <DeleteIcon className="w-4 h-4"/>
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return null;
        }
    }, [onEditHito, onDeleteHito]); // Incluir dependencias


    return (
         <div className="mt-6 border-t border-gray-300 pt-6">
            <Table 
               aria-label={`Tabla de hitos ${esEditable ? 'editables' : 'solo lectura'}`}
               // Aplicar clases para borde/sombra si es necesario
               // Implementar Drag & Drop aquí si se usa librería
             >
                <TableHeader columns={columnsToRender}>
                    {(column) => (
                        <TableColumn 
                            key={column.key}
                            // Ajustar alineación y ancho
                            align={column.key === 'acciones' || column.key === 'orderHandle' ? 'center' : 'start'}
                            className={
                                `text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 
                                ${column.key === 'orden' || column.key === 'semana' ? 'w-16' : ''}
                                ${column.key === 'tipo' ? 'w-32' : ''}
                                ${column.key === 'requisitos' ? 'w-28' : ''}
                                ${column.key === 'acciones' || column.key === 'orderHandle' ? 'w-20' : ''}`
                            }
                        >
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody 
                    items={hitos}
                    emptyContent={ esEditable ? "Aún no hay hitos. ¡Añade el primero!" : "No hay hitos definidos."}
                >
                    {(item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                            {(columnKey) => <TableCell className="py-3 px-4">{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {esEditable && (
              <Button
                 color="primary"
                 variant="ghost" // Botón más sutil para añadir
                 className="mt-4"
                 startContent={<Plus size={16}/>}
                 onPress={onAddHito} // Llama a la función para abrir el modal de creación
              >
                 Añadir Hito
              </Button>
             )}
         </div>
    );
};
export default CronogramaHitoTable;