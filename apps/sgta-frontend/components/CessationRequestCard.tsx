'use client'

import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Calendar, 
  FileText, 
  Clock, 
  User, 
  RefreshCw, 
  MessageSquare,
  Users
} from 'lucide-react';

// --- Importaciones de HeroUI ---
import { 
  Avatar, 
  Badge, 
  Button, 
  Card, 
  CardBody, // Asumiendo CardBody o similar
  CardFooter, // Asumiendo CardFooter o similar
  CardHeader, // Asumiendo CardHeader o similar
  Modal,      // Asumiendo Modal o Dialog
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure, // Hook para el modal de HeroUI
  Accordion, 
  AccordionItem,
  // Otros componentes que puedas necesitar: Tooltip, etc.
} from "@heroui/react"; 

// --- Funciones Helper (Igual que antes) ---
const formatearFecha = (fecha: string | Date): string => {
  // ... (misma implementación)
  if (!fecha) return '-';
  try {
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(fecha));
  } catch (e) { return '-'; }
};

const obtenerTiempoTranscurrido = (fecha: string | Date): string => {
  // ... (misma implementación)
   if (!fecha) return '';
   const diff = new Date().getTime() - new Date(fecha).getTime();
   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
   if (days > 1) return `Hace ${days} días`;
   if (days === 1) return `Ayer`;
   const hours = Math.floor(diff / (1000 * 60 * 60));
   if (hours > 0) return `Hace ${hours} horas`;
   return 'Recientemente';
};

// --- Interfaces (Igual que antes) ---
interface Tesista {
  id: string;
  nombre: string;
  titulo: string;
}
interface SolicitudCese {
  id: string;
  profesorNombre: string;
  profesorEmail: string;
  profesorAvatar?: string; 
  fechaSolicitud: string | Date;
  tesistasAfectados: Tesista[];
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaDecision?: string | Date;
  coordinadorDecision?: string; 
  motivoRechazo?: string;
}

// --- Props del Componente (Igual que antes) ---
interface CessationRequestCardProps {
  solicitud: SolicitudCese;
  onAprobar: (solicitud: SolicitudCese) => void; 
  onRechazar: (solicitud: SolicitudCese) => void;
}

// --- Componente de la Tarjeta con HeroUI ---
const CessationRequestCard: React.FC<CessationRequestCardProps> = ({ 
  solicitud, 
  onAprobar, 
  onRechazar 
}) => {
  
  // Hook para el modal de detalles de HeroUI
  const { isOpen: isDetailModalOpen, onOpen: onDetailModalOpen, onClose: onDetailModalClose } = useDisclosure(); 

  const EstadoChip = () => {
    let color: 'default' | 'danger' | 'success' | 'warning' = 'default'; // Ajustar colores según HeroUI
    let text = 'Pendiente';
    switch (solicitud.estado) {
      case 'aprobada':
        color = 'success';
        text = 'Aprobada';
        break;
      case 'rechazada':
        color = 'danger';
        text = 'Rechazada';
        break;
      case 'pendiente':
        color = 'warning'; 
        text = 'Pendiente';
        break;
    }
    // Asumiendo que Badge de HeroUI tiene prop `color`
    return <Badge color={color} variant="flat">{text}</Badge>; 
  };

  return (
    // Asumiendo que Card de HeroUI soporta clases de Tailwind para estilos adicionales
    <Card className="mb-5 shadow-md border border-gray-200 overflow-hidden transition-shadow hover:shadow-lg">
      {/* Encabezado */}
      <CardHeader className="flex flex-row items-center justify-between space-x-4 p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* --- Avatar de HeroUI --- */}
          <Avatar 
            src={solicitud.profesorAvatar} 
            name={solicitud.profesorNombre} // HeroUI usa 'name' para fallback
            size="md" // Asumiendo prop 'size'
          />
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">{solicitud.profesorNombre}</h3>
            <p className="text-xs text-gray-500">{solicitud.profesorEmail}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <EstadoChip />
        </div>
      </CardHeader>
      
      {/* Cuerpo */}
      <CardBody className="p-4 md:p-5 space-y-4"> 
        {/* Fila de Datos Principales */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
          {/* Fecha Solicitud */}
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Fecha Solicitud</p>
              <p className="font-medium text-gray-800">{formatearFecha(solicitud.fechaSolicitud)}</p>
              <p className="text-xs text-gray-500">{obtenerTiempoTranscurrido(solicitud.fechaSolicitud)}</p>
            </div>
          </div>
          {/* Proyectos Afectados */}
          <div className="flex items-start space-x-2">
            <Users className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Proyectos Afectados</p>
              <p className="font-semibold text-gray-800 text-base">{solicitud.tesistasAfectados.length}</p>
            </div>
          </div>
          {/* Fecha Decisión (Condicional) */}
          {solicitud.estado !== 'pendiente' && (
            <div className="flex items-start space-x-2 col-span-2 sm:col-span-1">
              <Clock className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Fecha Decisión</p>
                <p className="font-medium text-gray-800">{solicitud.fechaDecision ? formatearFecha(solicitud.fechaDecision) : '-'}</p>
                {solicitud.coordinadorDecision && 
                  <p className="text-xs text-gray-500">Por: {solicitud.coordinadorDecision}</p>
                }
              </div>
            </div>
          )}
        </div>

        {/* Separador (Tailwind simple si HeroUI no tiene) */}
        <hr className="my-3 border-gray-200" /> 

        {/* --- Accordion de HeroUI --- */}
        <Accordion selectionMode="multiple">
          {[
            <AccordionItem 
              key="motivo-cese" 
              aria-label="Motivo del Cese" 
              title={<span className="text-sm font-semibold text-gray-800">Motivo del Cese</span>}
              // Podríamos necesitar clases para estilizar el título si es necesario
            >
              <p className="text-sm text-gray-600 pt-1 pb-2"> 
                {solicitud.motivo}
              </p>
            </AccordionItem>,

            solicitud.tesistasAfectados.length > 0 ? (
              <AccordionItem 
                key="tesistas-afectados" 
                aria-label="Tesistas Afectados" 
                title={<span className="text-sm font-semibold text-gray-800">Tesistas Afectados ({solicitud.tesistasAfectados.length})</span>}
              >
                <div className="space-y-1.5 pt-1 pb-2 text-sm max-h-40 overflow-y-auto pr-2">
                  {solicitud.tesistasAfectados.map(tesista => (
                    <div key={tesista.id} className="flex items-start space-x-1.5">
                      <User className="h-3.5 w-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-800">{tesista.nombre}:</span>{' '}
                        <span className="text-gray-600">{tesista.titulo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            ) : null,

            solicitud.estado === 'rechazada' && solicitud.motivoRechazo ? (
              <AccordionItem 
                key="motivo-rechazo" 
                aria-label="Motivo del Rechazo" 
                title={<span className="text-sm font-semibold text-red-700">Motivo del Rechazo</span>}
                className="border-t border-gray-200" // Separador opcional
              >
                <p className="text-sm text-red-600 pt-1 pb-2">{solicitud.motivoRechazo}</p>
              </AccordionItem>
            ) : null
          ].filter(Boolean)}
        </Accordion>
      </CardBody> 
      
      {/* Footer con Acciones */}
      <CardFooter className="flex justify-end gap-2 p-4 bg-gray-50 border-t border-gray-200">
        {solicitud.estado === 'pendiente' && (
          <>
            {/* Botón Rechazar (Blanco/Outline - Ajustar `color` según HeroUI) */}
            <Button 
              variant="ghost" // Cambiado a un variant válido de HeroUI
              color="danger"    // O el color apropiado en HeroUI
              size="sm"
              onPress={() => onRechazar(solicitud)} // Usar onPress si es de HeroUI
              startContent={<X size={16} />} // Asumiendo startContent para icono
            >
              Rechazar
            </Button>
            
            {/* Botón Aprobar (Azul - Ajustar `color` según HeroUI) */}
            <Button 
              color="primary" // O el color apropiado en HeroUI
              size="sm"
              onPress={() => onAprobar(solicitud)}
              startContent={<Check size={16} />}
            >
              Aprobar
            </Button>

            {/* Botón Contactar (Opcional - Estilo light/ghost) */}
            <Button 
              variant="light" // O el variant apropiado
              isIconOnly    // Para que sea solo icono
              size="sm"
              onPress={() => console.log(`Contactar a ${solicitud.profesorNombre}`)}
              aria-label="Contactar al profesor"
            >
              <MessageSquare size={16} />
            </Button>
          </>
        )}
        
        {solicitud.estado !== 'pendiente' && (
           <>
             {/* Botón Ver Detalles (Abre Modal) */}
             <Button variant="flat" size="sm" onPress={onDetailModalOpen}> 
                 Ver Detalles
             </Button>

             {solicitud.estado === 'aprobada' && (
               <Button 
                 color="primary" // O el color/variant apropiado
                 size="sm"
                 onPress={() => console.log('Redirigir a reasignaciones')} 
                 startContent={<RefreshCw size={16} />}
               >
                 Gestionar Reasignaciones ({solicitud.tesistasAfectados.length})
               </Button>
             )}
           </>
        )}
      </CardFooter>

      {/* --- Modal de Detalles con HeroUI --- */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={onDetailModalClose}
        size="xl" // Ajustar tamaño según sea necesario
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-medium">Detalle Solicitud de Cese</h3>
          </ModalHeader>
          <ModalBody className="py-4">
             {/* Replicar contenido del CardBody o mostrar información más detallada */}
             <div className="space-y-3 text-sm max-h-[60vh] overflow-y-auto pr-2">
                <p><span className='font-medium'>Profesor:</span> {solicitud.profesorNombre} ({solicitud.profesorEmail})</p>
                <p><span className='font-medium'>Estado:</span> <EstadoChip /></p>
                <p><span className='font-medium'>Fecha Solicitud:</span> {formatearFecha(solicitud.fechaSolicitud)} ({obtenerTiempoTranscurrido(solicitud.fechaSolicitud)})</p>
                {solicitud.fechaDecision && <p><span className='font-medium'>Fecha Decisión:</span> {formatearFecha(solicitud.fechaDecision)} (Por: {solicitud.coordinadorDecision || 'N/A'})</p>}
                
                <p className='font-medium mt-3'>Motivo del Cese:</p>
                <p className='text-gray-600 bg-gray-50 p-2 rounded border border-gray-200'>{solicitud.motivo}</p>
                
                {solicitud.tesistasAfectados.length > 0 && (
                  <>
                    <p className='font-medium mt-3'>Tesistas Afectados ({solicitud.tesistasAfectados.length}):</p>
                    <ul className='list-disc pl-5 space-y-1 text-xs sm:text-sm'>
                        {solicitud.tesistasAfectados.map(t => (
                          <li key={t.id}>
                             <span className='font-medium'>{t.nombre}:</span>{' '}
                             <span className='text-gray-600'>{t.titulo}</span>
                          </li>
                        ))}
                    </ul>
                  </>
                )}

                {solicitud.motivoRechazo && (
                  <>
                    <p className='font-medium mt-3 text-red-700'>Motivo del Rechazo:</p>
                    <p className='text-red-600 bg-red-50 p-2 rounded border border-red-200'>{solicitud.motivoRechazo}</p>
                  </>
                )}
             </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onDetailModalClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Card>
  );
};

export default CessationRequestCard;