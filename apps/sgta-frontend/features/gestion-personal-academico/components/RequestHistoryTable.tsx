// src/features/academic-staff-management/components/RequestHistoryTable.tsx
import React from 'react';
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Chip, Avatar, Button 
} from "@heroui/react";
import { SolicitudCese } from '../types';

interface RequestHistoryTableProps {
  requests: SolicitudCese[];
  onViewDetails: (solicitud: SolicitudCese) => void; 
}

const RequestHistoryTable: React.FC<RequestHistoryTableProps> = ({ requests, onViewDetails }) => {
   // Columnas de la tabla
  const columns = [
    { name: "PROFESOR", uid: "profesor", sortable: true },
    { name: "FECHA SOLICITUD", uid: "fechaSolicitud", sortable: true },
    { name: "TESIS AFECTADAS", uid: "tesistas", align: "center" },
    { name: "ESTADO", uid: "estado" },
    { name: "FECHA DECISIÓN", uid: "fechaDecision", sortable: true },
    { name: "ACCIONES", uid: "acciones", align: "end" }
  ];

  // --- Función formatearFecha (puedes moverla a lib/utils) ---
   const formatearFecha = (fechaIso?: string | Date) => {
     if (!fechaIso) return '-';
     const fecha = new Date(fechaIso);
     return fecha.toLocaleDateString('es-ES', { 
       day: '2-digit', 
       month: '2-digit', 
       year: 'numeric'
     });
   };
   
  // Renderizar celdas
  const renderCell = (solicitud: SolicitudCese, columnKey: React.Key) => {
    const cellValue = solicitud[columnKey as keyof SolicitudCese];

    switch (columnKey) {
      case "profesor":
        return (
          <div className="flex items-center gap-2">
            <Avatar src={solicitud.profesorAvatar} name={solicitud.profesorNombre} size="sm" />
            <div>
              <p className="text-sm font-medium">{solicitud.profesorNombre}</p>
              <p className="text-xs text-gray-500">{solicitud.profesorEmail}</p>
            </div>
          </div>
        );
      case "fechaSolicitud":
         return <span className="text-sm">{formatearFecha(solicitud.fechaSolicitud)}</span>;
      case "tesistas":
         return <Chip color="warning" variant="flat" size="sm">{solicitud.tesistasAfectados.length}</Chip>;
      case "estado":
         let color: "success" | "danger" = "success";
         if (solicitud.estado === 'rechazada') color = 'danger';
         return <Chip size="sm" color={color} variant="flat">{solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}</Chip>;
      case "fechaDecision":
        return (
          <div>
            <p className="text-sm">{formatearFecha(solicitud.fechaDecision)}</p>
            {solicitud.coordinadorDecision && (
              <p className="text-xs text-gray-500">{solicitud.coordinadorDecision}</p>
            )}
          </div>
        );
      case "acciones":
        return (
          <div className="flex justify-end gap-2">
            <Button 
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => onViewDetails(solicitud)} // Llama al prop
            >
              Detalles
            </Button>
            {/* Podrían ir otras acciones si aplica */}
          </div>
        );
      default:
        return <span className="text-sm">{String(cellValue)}</span>;
    }
  };

  return (
    <Table aria-label="Tabla de historial de solicitudes de cese">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn 
             key={column.uid} 
             align={column.align === 'end' ? 'end' : 'start'}
             // allowsSorting={column.sortable} // Habilitar si se implementa sort en HeroUI Table
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={requests}
        emptyContent={"No hay solicitudes en el historial para los filtros seleccionados."}
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

export default RequestHistoryTable;