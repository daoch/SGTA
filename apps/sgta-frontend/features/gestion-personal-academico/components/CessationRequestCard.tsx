// src/features/academic-staff-management/components/CessationRequestCard.tsx
'use client'

import React from 'react'; // No necesitamos useState aquí si los detalles se manejan fuera
import { 
  Check, 
  X, 
  Calendar, 
  FileText, 
  Clock, 
  User, 
  RefreshCw, 
  MessageSquare, // Cambiado icono de contacto
  Users
} from 'lucide-react';

// Importando componentes de HeroUI (Asegúrate que los imports sean correctos)
import { 
  Avatar, 
  Badge, 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Chip, // Usaremos Chip para el estado
  Tooltip 
} from "@heroui/react"; 

// Importar tipos desde la feature
import { SolicitudCese, Tesista } from '../types'; 

// --- Props del Componente ---
interface CessationRequestCardProps {
  solicitud: SolicitudCese;
  onAprobar: (solicitud: SolicitudCese) => void; 
  onRechazar: (solicitud: SolicitudCese) => void;
  onVerDetalle: (solicitud: SolicitudCese) => void; // Prop para abrir el modal de detalles
  // Añadir onContactar si es necesario pasar la lógica desde fuera
  // onContactar: (solicitud: SolicitudCese) => void; 
}

// --- Componente de la Tarjeta ---
const CessationRequestCard: React.FC<CessationRequestCardProps> = ({ 
  solicitud, 
  onAprobar, 
  onRechazar,
  onVerDetalle 
  // onContactar // Descomentar si se usa
}) => {

  // --- Funciones Helper Internas (o importadas desde lib/utils) ---
  const formatDate = (isoDate?: string | Date): string => {
      if (!isoDate) return '-';
      try {
          const date = new Date(isoDate);
          // Formato más conciso para la tarjeta: DD/MM/YY, HH:MM AM/PM
          const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
          const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          return `${dateStr}, ${timeStr}`;
      } catch (e) { return '-' }
  };
  
  const getTimeElapsed = (isoDate?: string | Date): string => {
      if (!isoDate) return '';
      try {
          const diff = new Date().getTime() - new Date(isoDate).getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          if (days > 1) return `Hace ${days} d`;
          if (days === 1) return `Ayer`;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          if (hours > 0) return `Hace ${hours} h`;
          const minutes = Math.floor(diff / (1000 * 60));
          return `Hace ${minutes} min`;
      } catch (e) { return '' }
  };

  // Mapeo de estados a colores y textos de HeroUI Chip
  const statusConfig: Record<
      SolicitudCese['estado'],
      { color: "warning" | "success" | "danger" | "default"; text: string } // Ajusta colores según HeroUI
  > = {
      pendiente: { color: "warning", text: "Pendiente" },
      aprobada: { color: "success", text: "Aprobada" },
      rechazada: { color: "danger", text: "Rechazada" }
  };
  
  // Verificar si hay tesistas afectados
  const hasTesistas = solicitud.tesistasAfectados && solicitud.tesistasAfectados.length > 0;
  
  // Truncar texto
  const truncateText = (text: string | undefined, limit = 200): string => {
      if (!text) return '';
      return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  // --- Renderizado del Componente ---
  return (
    // Usar Card de HeroUI
    <Card className="mb-3 shadow-sm border border-gray-300/80">
      {/* Cabecera */}
      <CardHeader className="py-2 px-4 bg-gray-50 flex justify-between items-center border-b-1 border-gray-300/80">
        <div className="flex items-center gap-2 p-2">
          <Avatar 
             src={solicitud.profesorAvatar} 
             name={solicitud.profesorNombre} // Fallback
             size="sm" // Tamaño pequeño para cabecera
             className="flex-shrink-0"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">{solicitud.profesorNombre}</h3>
            <p className="text-xs text-gray-500 leading-tight">{solicitud.profesorEmail}</p>
          </div>
        </div>
        {/* Usar Chip de HeroUI */}
        <Chip 
          color={statusConfig[solicitud.estado]?.color || "default"} 
          variant="flat" 
          size="sm"
          className="flex-shrink-0" // Evitar que se encoja demasiado
        >
          {statusConfig[solicitud.estado]?.text || "Desconocido"}
        </Chip>
      </CardHeader>
      
      {/* Cuerpo */}
      <CardBody className="py-3 px-4 text-xs border-b-1 border-gray-300/80"> {/* Reducir padding y tamaño de fuente base */}
        {/* Información principal en Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2 mb-2 p-2">
          {/* Columna Fecha Solicitud */}
          <div className="flex items-start gap-1.5">
            <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
            <div>
              <span className="text-gray-500 block text-[11px] leading-tight">Solicitud:</span>
              <span className="font-medium text-gray-800 block leading-tight">{formatDate(solicitud.fechaSolicitud)}</span>
              <span className="text-gray-500 block leading-tight">{getTimeElapsed(solicitud.fechaSolicitud)}</span>
            </div>
          </div>
          
          {/* Columna Proyectos Afectados */}
          <div className="flex items-start gap-1.5">
            <Users className="h-3.5 w-3.5 mt-0.5 text-gray-400 flex-shrink-0" /> {/* Cambiado icono */}
            <div>
              <span className="text-gray-500 block text-[11px] leading-tight">Proyectos:</span>
              {/* Usar Badge de HeroUI */}
              <Badge color="warning" variant="flat" size="sm">{solicitud.tesistasAfectados.length}</Badge>
            </div>
          </div>
          
          {/* Columna Fecha Decisión (Condicional) */}
          {solicitud.estado !== 'pendiente' && solicitud.fechaDecision && (
            <div className="flex items-start gap-1.5">
              <Clock className="h-3.5 w-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500 block text-[11px] leading-tight">Decisión:</span>
                <span className="font-medium text-gray-800 block leading-tight">{formatDate(solicitud.fechaDecision)}</span>
                {solicitud.coordinadorDecision && 
                    <span className="text-gray-500 block text-[11px] leading-tight">({solicitud.coordinadorDecision})</span>}
              </div>
            </div>
          )}
        </div>
        
        {/* Motivo (Truncado con botón Ver más) */}
        <div className="mb-2 p-2">
          <p className="text-[11px] text-gray-500 font-medium mb-0.5">Motivo:</p>
          <p className="text-xs text-gray-700 leading-snug line-clamp-2"> {/* line-clamp para truncar */}
            {solicitud.motivo} 
          </p>
          {/* Mostrar botón "Ver más" solo si el texto es largo */}
          {solicitud.motivo.length > 80 && ( // Ajusta el límite según necesites
            <Button 
              variant="light" // Estilo sutil de HeroUI
              color="primary" 
              size="sm" 
              className="h-auto p-0 text-xs mt-0.5" // Clases para ajustar tamaño/padding
              onPress={() => onVerDetalle(solicitud)} // Llama al prop
            >
              Ver completo
            </Button>
          )}
        </div>
        
        {/* Tesistas afectados (Vista previa si existen) */}
        {hasTesistas && (
          <div className="mb-1 p-2">
            <p className="text-[11px] text-gray-500 font-medium mb-0.5">Tesistas afectados:</p>
            <div className="space-y-0.5">
              {/* Mostrar solo el primero o dos */}
              {solicitud.tesistasAfectados.slice(0, 1).map(tesista => (
                <div key={tesista.id} className="text-xs text-gray-600 flex items-start gap-1">
                  <User className="h-3 w-3 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{tesista.nombre}:</span>
                  <span className="truncate text-gray-600">{truncateText(tesista.titulo, 150)}</span> {/* Truncar título */}
                </div>
              ))}
              {/* Botón para ver todos si hay más */}
              {solicitud.tesistasAfectados.length > 1 && (
                <Button 
                  variant="light" 
                  color="primary" 
                  size="sm" 
                  className="h-auto p-0 text-xs mt-0.5"
                  onPress={() => onVerDetalle(solicitud)} // Llama al prop
                >
                  Ver los {solicitud.tesistasAfectados.length} tesistas
                </Button>
              )}
            </div>
          </div>
        )}
        
        {/* Motivo de rechazo (si aplica) */}
        {solicitud.estado === 'rechazada' && solicitud.motivoRechazo && (
          <div className="mt-2 p-1.5 bg-danger-50 rounded border border-danger-100"> {/* Color danger de HeroUI */}
            <p className="text-xs font-medium text-danger-700 mb-0.5">Motivo del rechazo:</p>
            <p className="text-xs text-danger-600 leading-snug line-clamp-2">{solicitud.motivoRechazo}</p>
             {solicitud.motivoRechazo.length > 100 && (
                <Button variant="light" color="danger" size="sm" className="h-auto p-0 text-xs mt-0.5" onPress={() => onVerDetalle(solicitud)}>
                  Ver completo
                </Button>
             )}
          </div>
        )}
      </CardBody>
      
      {/* Footer con acciones */}
      <CardFooter className="py-2 px-4 bg-gray-50 flex justify-end gap-1"> {/* Gap más pequeño */}
        <div className='p-2'>
          {solicitud.estado === 'pendiente' ? (
            <>
              {/* Botón Rechazar (Blanco/Outline - HeroUI) */}
              <Button 
                size="sm"
                variant="bordered" // O variant 'bordered' si existe
                color="danger" // Para borde/texto rojo
                onPress={() => onRechazar(solicitud)} // Llama al prop
                startContent={<X size={14} />} // Asumiendo startContent
              >
                Rechazar
              </Button>

              {/* Botón Aprobar (Azul - HeroUI) */}
              {/* <Tooltip content="Aprobar e iniciar reasignación" placement="top"> */} {/* Tooltip si HeroUI lo tiene */}
                <Button 
                  size="sm"
                  color="primary" // Asumiendo que primary es azul
                  onPress={() => onAprobar(solicitud)} // Llama al prop
                  startContent={<Check size={14} />}
                >
                  Aprobar
                </Button>
              {/* </Tooltip> */}

              {/* Botón Contactar (Icono - HeroUI) */}
              {/* <Tooltip content="Contactar al profesor" placement="top"> */}
                <Button 
                  size="sm"
                  isIconOnly // Para que sea solo icono
                  variant="light" // Estilo sutil
                  color="default" // Color neutro
                  onPress={() => console.log(`Contactar a ${solicitud.profesorNombre}`)} // Lógica de contacto
                  aria-label="Contactar al profesor"
                >
                  <MessageSquare size={16} /> 
                </Button>
              {/* </Tooltip> */}
            </>
          ) : ( // Si no está pendiente (Aprobada o Rechazada)
            <>
              {/* Botón Ver Detalles */}
              <Button 
                size="sm"
                variant="flat" // Estilo plano/sutil
                color="primary"
                onPress={() => onVerDetalle(solicitud)} // Llama al prop
              >
                Ver detalles
              </Button>
              {/* Botón Ver Reasignaciones (solo si aprobada) */}
              {solicitud.estado === 'aprobada' && hasTesistas && ( // Solo si hay tesistas
                <Button 
                  size="sm"
                  color="primary" // O un color secundario
                  onPress={() => console.log(`Ir a reasignaciones para solicitud ${solicitud.id}`)} // Lógica de navegación/acción
                  startContent={<RefreshCw size={14} />}
                >
                  Reasignaciones
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CessationRequestCard;