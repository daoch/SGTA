// src/features/student-project/components/ProjectTimelineOrSteps.tsx
import React from 'react';
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Button } from '@heroui/react';
import { ProjectMilestone } from '../types';
import { Calendar, CheckCircle, AlertCircle, Clock, ArrowRight, Upload, Eye } from 'lucide-react'; // Iconos
import Link from 'next/link';

interface ProjectTimelineOrStepsProps {
  milestones: ProjectMilestone[];
}

// Componente para el chip de estado de entrega
const MilestoneStatusChip: React.FC<{ status: ProjectMilestone['estadoEntrega'], dueDate: Date | null }> = ({ status, dueDate }) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isOverdue = dueDate && dueDate < today && status === 'pendiente';

  const config = {
    pendiente: { text: "Pendiente", color: "default" as const, icon: Clock },
    entregado: { text: "Entregado", color: "primary" as const, icon: Upload },
    revisado_observado: { text: "Observado", color: "warning" as const, icon: AlertCircle },
    aprobado: { text: "Aprobado", color: "success" as const, icon: CheckCircle },
    vencido: { text: "Vencido", color: "danger" as const, icon: AlertCircle },
  };
  // Sobrescribir si está vencido
  const currentStatus = isOverdue ? 'vencido' : status;
  const currentConfig = config[currentStatus] || config.pendiente;
  const Icon = currentConfig.icon;

  return (
    <Chip 
      color={currentConfig.color} 
      variant="flat" 
      size="sm" 
      startContent={<Icon size={14}/>}
      className="capitalize"
    >
      {currentConfig.text}
    </Chip>
  );
};

const ProjectTimelineOrSteps: React.FC<ProjectTimelineOrStepsProps> = ({ milestones }) => {

  const formatDate = (isoDate?: string | Date): string => {
    if (!isoDate) return '-';
    try { return new Date(isoDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }); } 
    catch(e) { return '-'; }
  };

  // Columnas para la tabla
   const columns = [
    { key: "nombre", label: "Hito / Entregable" },
    { key: "fechaLimite", label: "Fecha Límite" },
    { key: "estadoEntrega", label: "Estado" },
    { key: "acciones", label: "Acciones", align: "end" as const},
  ];

  // Render Celdas
   const renderCell = React.useCallback((item: ProjectMilestone, columnKey: React.Key) => {
       switch (columnKey) {
           case "nombre":
               return (
                   <div>
                       <p className="font-medium text-sm">{item.nombre}</p>
                       {item.descripcion && <p className="text-xs text-gray-500">{item.descripcion}</p>}
                   </div>
               );
           case "fechaLimite":
                const dueDate = item.fechaLimite ? new Date(item.fechaLimite) : null;
                dueDate?.setHours(0,0,0,0); // Comparar solo fechas
                return <span className="text-sm">{formatDate(item.fechaLimite)}</span>;
           case "estadoEntrega":
               const dueDateForChip = item.fechaLimite ? new Date(item.fechaLimite) : null;
                return <MilestoneStatusChip status={item.estadoEntrega} dueDate={dueDateForChip} />;
           case "acciones":
               // Mostrar botón para subir/ver según estado
               const canSubmit = item.estadoEntrega === 'pendiente' || item.estadoEntrega === 'revisado_observado';
               const showView = item.estadoEntrega === 'entregado' || item.estadoEntrega === 'aprobado';
               return (
                  <div className="flex justify-end">
                    {item.linkToSubmission && (canSubmit || showView) && (
                         <Button 
                           as={Link} 
                           href={item.linkToSubmission} 
                           size="sm" 
                           variant={canSubmit ? "solid" : "flat"} // Resaltar si puede entregar
                           color="primary"
                           startContent={canSubmit ? <Upload size={14}/> : <Eye size={14}/>}
                         >
                           {canSubmit ? 'Entregar / Ver' : 'Ver Entrega'}
                         </Button>
                    )}
                    {/* Podría haber un botón para ver observaciones si tieneObservaciones es true */}
                  </div>
               );
           default: return null;
       }
   }, []);

  return (
    <Card className="shadow-sm border">
      <CardHeader className="border-b">
         <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar size={18} className="text-primary"/> Cronograma y Entregables
         </h2>
      </CardHeader>
      <CardBody className="p-0"> {/* Padding cero para que la tabla ocupe todo */}
        {milestones.length === 0 ? (
            <div className="p-6 text-center text-gray-500">El cronograma aún no ha sido definido.</div>
        ) : (
            <Table 
                aria-label="Cronograma del proyecto" 
                removeWrapper // Quitar wrapper para que no haya doble borde/sombra
                // classNames={{ table: "min-w-full divide-y divide-gray-200" }} // Clases si es necesario
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn 
                    key={column.key} 
                    align={column.align || 'start'}
                    className="bg-gray-50/70 text-xs font-semibold uppercase text-gray-500 px-4 py-2" // Estilo cabecera
                   >
                      {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={milestones} emptyContent={"No hay hitos definidos."}>
                {(item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    {(columnKey) => <TableCell className="px-4 py-3">{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
        )}
      </CardBody>
    </Card>
  );
};
export default ProjectTimelineOrSteps;