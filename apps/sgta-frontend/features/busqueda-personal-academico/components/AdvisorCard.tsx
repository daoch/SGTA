// src/features/academic-staff-search/components/AdvisorCard.tsx
import React from 'react';
import { Card, CardBody, CardFooter, Avatar, Chip, Button, Tooltip } from '@heroui/react';
import { Mail, BookCopy, Check, X, MessageCircle, UserPlus, ExternalLink, Clock, Award } from 'lucide-react'; // Iconos
import Link from 'next/link';
import { AsesorInfo } from '../types';

interface AdvisorCardProps {
  asesor: AsesorInfo;
  viewerRole?: 'estudiante' | 'asesor';
  // Opcional: Función para iniciar contacto/propuesta (si el rol es Estudiante)
  onProposeClick?: (asesorId: string) => void; 
}

// Componente interno para mostrar áreas concisamente
const AreasList = ({ areas }: { areas: { nombre: string }[] }) => {
    if (!areas || areas.length === 0) return <span className="text-xs italic text-gray-500">No especificadas</span>;
    const MAX_VISIBLE = 3;
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {areas.slice(0, MAX_VISIBLE).map((area, i) => (
                <Chip key={i} size="sm" variant="flat" color="secondary">{area.nombre}</Chip>
            ))}
            {areas.length > MAX_VISIBLE && (
                 <Tooltip content={areas.slice(MAX_VISIBLE).map(a=>a.nombre).join(', ')} placement="top">
                     <Chip size="sm" variant="bordered" className="cursor-help">+{areas.length - MAX_VISIBLE} más</Chip>
                 </Tooltip>
            )}
        </div>
    );
}

const AdvisorCard: React.FC<AdvisorCardProps> = ({
  asesor,
  viewerRole = 'estudiante',
  onProposeClick
}) => {

const showLoad = viewerRole === 'asesor';
const showProposeButton = viewerRole === 'estudiante' && onProposeClick && asesor.disponibleNuevos;
// *** Eliminada la variable showSuggestButton ***

return (
  <Card className="shadow-md hover:shadow-lg border border-gray-100 transition-shadow h-full flex flex-col">
    <CardBody className="p-4 flex-grow">
      {/* Sección Superior */}
      <div className="flex items-start gap-4 mb-3">
        <Avatar src={asesor.avatar} name={asesor.nombre} size="lg" className="flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
           <div className="flex justify-between items-start gap-2">
               <div className='flex-grow'>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight truncate" title={asesor.nombre}>{asesor.nombre}</h3>
                  {asesor.rolAcademico && <p className="text-xs text-gray-500 leading-tight">{asesor.rolAcademico}</p>}
               </div>
               {/* Mostrar estado solo si NO es estudiante Y si el asesor NO está disponible */}
               {viewerRole !== 'estudiante' && !asesor.disponibleNuevos && (
                    <Chip
                       size="sm"
                       variant="flat"
                       color="warning" // Usar warning para Cupo Lleno
                       startContent={<Clock size={12}/>} // Icono de Reloj/Espera
                       className="flex-shrink-0 mt-0.5"
                    >
                        Cupo Lleno
                    </Chip>
               )}
                {/* Podríamos añadir aquí el chip de "En Licencia" si tuviéramos ese estado */}
           </div>
           {/* Mostrar Carga Condicionalmente */}
           {showLoad && asesor.cargaActual !== undefined && (
              <div className="flex items-center text-xs text-amber-700 mt-1.5">
                 <Award size={14} className="mr-1"/> Carga: {asesor.cargaActual} tesis
              </div>
           )}
        </div>
      </div>

      {/* Biografía Breve */}
      {asesor.biografiaBreve && ( <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-3">{asesor.biografiaBreve}</p> )}

      {/* Áreas de Expertise */}
      <div>
           <p className="text-xs font-medium text-gray-500 mb-1">Áreas de Expertise:</p>
           <AreasList areas={asesor.areasExpertise}/>
      </div>

      {/* Temas de Interés */}
       {asesor.temasInteres && asesor.temasInteres.length > 0 && (
          <div className="mt-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Temas de Interés:</p>
              <div className="flex flex-wrap gap-1">
                  {asesor.temasInteres.map((tema, i) => <Chip key={i} size="sm" variant="bordered">{tema}</Chip>)}
              </div>
          </div>
      )}

    </CardBody>
    <CardFooter className="p-3 bg-gray-50/70 border-t flex justify-end gap-2">
       {/* Enlace a Perfil Completo */}
       <Button as={Link} href={asesor.linkPerfilCompleto} size="sm" variant="light" color="primary" startContent={<ExternalLink size={14}/>}>
           Ver Perfil
       </Button>

       {/* Botón Enviar Propuesta (Solo Estudiante y Disponible) */}
       {showProposeButton && (
           <Button size="sm" color="primary" variant="solid" onPress={() => onProposeClick(asesor.id)} startContent={<UserPlus size={14}/>}>
               Enviar Propuesta
           </Button>
       )}

       {/* *** ELIMINADO BOTÓN SUGERIR CO-ASESOR *** */}

        {/* Botón Contactar (Quizás para Asesor/Coordinador?) */}
        {(viewerRole === 'asesor') && (
             <Tooltip content={`Contactar a ${asesor.nombre}`}>
               <Button size="sm" isIconOnly variant="light" color="default" onPress={() => window.location.href = `mailto:${asesor.email}`}>
                   <MessageCircle size={16}/>
               </Button>
             </Tooltip>
        )}
    </CardFooter>
  </Card>
);
};
export default AdvisorCard;