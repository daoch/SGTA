// src/features/academic-staff-management/components/AdvisorCandidateCard.tsx
import React, { useMemo } from 'react';
import { Card, CardBody, Avatar, Chip, Tooltip, Button, Badge } from "@heroui/react";
import { User, Mail, BookCopy, CheckCircle, Star } from 'lucide-react'; // Iconos relevantes
import { Asesor } from '../types'; // Importar tipo Asesor

interface AdvisorCandidateCardProps {
  asesor: Asesor;
  proyectoAreas: string[]; // Áreas del proyecto para comparar
  onSelect: (asesor: Asesor) => void; // Función para seleccionar este asesor
}

const AdvisorCandidateCard: React.FC<AdvisorCandidateCardProps> = ({ asesor, proyectoAreas, onSelect }) => {
  
  // Calcular áreas coincidentes
  const areasCoincidentes = useMemo(() => 
      asesor.areasExpertise.filter(area => proyectoAreas.includes(area)),
      [asesor.areasExpertise, proyectoAreas]
  );
  const numCoincidencias = areasCoincidentes.length;

  return (
    // Usamos Card con isPressable para detectar el clic en toda la tarjeta
    <Card 
       className="mb-2 shadow-sm hover:shadow-lg transition-shadow border border-transparent hover:border-primary cursor-pointer" // Hover effect
       isPressable 
       onPress={() => onSelect(asesor)} // Llama a la función onSelect al presionar
    > 
      <CardBody className="p-3">
        <div className="flex items-start justify-between gap-3">
          {/* Columna Izquierda: Info Principal */}
          <div className="flex items-start gap-3 flex-grow">
            <Avatar 
              src={asesor.avatar} 
              name={asesor.nombre} 
              size="md" // Tamaño mediano
              className="mt-1 flex-shrink-0"
            />
            <div className="flex-grow">
              <p className="font-semibold text-sm leading-tight text-gray-900">{asesor.nombre}</p>
              <p className="text-xs text-gray-500 leading-tight flex items-center">
                 <Mail size={12} className="mr-1"/> {asesor.email}
              </p>
              {/* Carga Actual */}
              <div className="mt-1.5">
                 <Badge 
                    color={asesor.cargaActual <= 3 ? "success" : asesor.cargaActual <= 5 ? "warning" : "danger"} 
                    variant="flat" 
                    size="sm"
                 >
                    Carga Actual: {asesor.cargaActual} tesis
                 </Badge>
              </div>
               {/* Coincidencia de Áreas */}
              {numCoincidencias > 0 && (
                <Tooltip content={`Coincide en: ${areasCoincidentes.join(', ')}`} placement="bottom" delay={300}>
                    <Chip
                        color="success"
                        variant="dot" // Estilo diferente para destacar coincidencia
                        size="sm"
                        className="mt-1.5 cursor-default"
                        startContent={<Star size={12} className="text-success"/>} // Icono estrella
                    >
                        {numCoincidencias} {numCoincidencias === 1 ? 'área afín' : 'áreas afines'}
                    </Chip>
                </Tooltip>
              )}
            </div>
          </div>
          
          {/* Columna Derecha: (Opcional) Botón o Indicador */}
           {/* El botón explícito se quita porque toda la tarjeta es clickeable */}
           {/* Podríamos poner un icono de Check si fuera el seleccionado */}
           {/* <Button size="sm" color="primary" variant="ghost" onPress={() => onSelect(asesor)}> Seleccionar </Button> */}

        </div>

         {/* Áreas de Expertise (Plegable si son muchas o fijas) */}
         <div className="mt-2 border-t border-gray-100 pt-2">
           <p className="text-xs text-gray-500 mb-1 flex items-center">
              <BookCopy size={12} className="mr-1"/> Áreas de expertise:
           </p>
           <div className="flex flex-wrap gap-1">
             {asesor.areasExpertise.slice(0, 5).map((area, index) => ( // Limitar a 5 visibles inicialmente
               <Chip
                 key={`exp-${index}`}
                 size="sm"
                 variant={proyectoAreas.includes(area) ? "flat" : "bordered"} // Resaltar coincidentes
                 color={proyectoAreas.includes(area) ? "success" : "default"}
                 className="text-xs"
               >
                 {area}
               </Chip>
             ))}
             {asesor.areasExpertise.length > 5 && (
                 <Tooltip content={asesor.areasExpertise.slice(5).join(', ')} placement="top">
                     <Chip size="sm" variant="bordered" className="text-xs cursor-help">
                         +{asesor.areasExpertise.length - 5} más
                     </Chip>
                 </Tooltip>
             )}
           </div>
         </div>
      </CardBody>
    </Card>
  );
};

export default AdvisorCandidateCard;