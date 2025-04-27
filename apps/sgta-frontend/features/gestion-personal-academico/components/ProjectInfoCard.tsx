// src/features/academic-staff-management/components/ProjectInfoCard.tsx
import React from 'react';
import { Card, CardBody, CardHeader, Avatar, Chip } from "@heroui/react";
import { BookOpen } from 'lucide-react';
import { ProyectoReasignacion } from '../types';
// Importar el componente AreasTematicas que creaste antes
// import AreasTematicas from './AreasTematicas'; 

interface ProjectInfoCardProps {
    proyecto: ProyectoReasignacion;
}

// Simple componente para mostrar áreas, puedes usar el que ya tienes
const AreasTematicas = ({ areas }: { areas: string[] }) => (
   <div className="flex flex-wrap gap-1">
     {areas.map((area, index) => <Chip key={index} size="sm" variant="flat">{area}</Chip>)}
   </div>
);


const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ proyecto }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-gray-800 flex items-center border-b pb-2 mb-3">
        <BookOpen size={16} className="mr-2 text-gray-600" />
        Proyecto a Reasignar
      </h3>
      <Card className="bg-gray-50 border border-gray-200 shadow-sm">
        <CardBody className="p-4 space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Estudiante:</p>
            <p className="text-sm font-semibold text-gray-800">{proyecto.tesista.nombre}</p>
            <p className="text-sm text-gray-600">Código: {proyecto.tesista.codigo}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Título del Proyecto:</p>
            <p className="text-sm text-gray-700">{proyecto.titulo}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Asesor Original (en cese):</p>
            <div className="flex items-center">
              <Avatar src={proyecto.asesorOriginal.avatar} className="mr-2 flex-shrink-0" size="sm" />
              <div>
                <p className="text-sm text-gray-700">{proyecto.asesorOriginal.nombre}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Áreas Temáticas del Proyecto:</p>
            <div className="mt-1">
              <AreasTematicas areas={proyecto.areasTematicas} />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default ProjectInfoCard;