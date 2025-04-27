// src/features/student-project/components/ProjectHeader.tsx
import React from 'react';
import { Progress, Chip } from '@heroui/react'; // Asumiendo Progress y Chip de HeroUI
import TesistaStatusChip from '@/features/supervision-estudiantes/components/TesistaStatusChip'; // Reutilizar el chip de estado
import { CursoType } from '@/features/configuracion-academica/types';
import { ProjectStatus } from '@/features/supervision-estudiantes/types';

interface ProjectHeaderProps {
  title: string;
  status: ProjectStatus;
  cycle: string;
  course: CursoType | null;
  progress: number; // 0-100
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title, status, cycle, course, progress
}) => {
  return (
    <div className="bg-gradient-to-r from-white to-blue-50 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Título y Estado */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3 sm:mb-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 leading-tight max-w-3xl">
          {title}
        </h1>
        <div className="flex-shrink-0 mt-1 sm:mt-0">
           <TesistaStatusChip status={status} /> {/* Reutilizar Chip de Estado */}
        </div>
      </div>

      {/* Barra de Progreso e Info Adicional */}
      <div className="space-y-2">
         <div className="flex justify-between items-center mb-1">
             <span className="text-sm font-medium text-primary">Progreso General</span>
             <span className="text-sm font-semibold text-primary">{progress}%</span>
         </div>
         {/* Asumiendo Progress de HeroUI */}
         <Progress 
            value={progress} 
            color="primary" 
            size="md" // Ajustar tamaño
            aria-label={`Progreso del proyecto: ${progress}%`}
            // Podrías añadir valueLabel si HeroUI lo soporta: valueLabel={`${progress}%`}
            className="h-2.5" // Ajustar altura si es necesario
          />
          <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
              <span>Ciclo: <span className="font-medium text-gray-700">{cycle}</span></span>
              {course && <span>Curso: <span className="font-medium text-gray-700">{course}</span></span>}
          </div>
      </div>
    </div>
  );
};

export default ProjectHeader;