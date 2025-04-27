// src/features/dashboard/components/MyStudentsProgressCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Progress, Button, Badge } from '@heroui/react';
import { GraduationCap, ArrowRight, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { MyStudentInfo } from '../types';

interface MyStudentsProgressCardProps {
  students: MyStudentInfo[];
}

// Función para obtener el color del progreso según el porcentaje
const getProgressColor = (progress: number) => {
  if (progress < 25) return "danger";
  if (progress < 50) return "warning";
  if (progress < 75) return "primary";
  return "success";
};

const MyStudentsProgressCard: React.FC<MyStudentsProgressCardProps> = ({ students }) => {
  // Ordenar por progreso (descendente)
  const sortedStudents = [...students].sort((a, b) => b.progreso - a.progreso);
  
  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
            <GraduationCap size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Mis Tesistas (Progreso)</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Avance general de los estudiantes que asesoras.
        </p>
      </CardHeader>
      
      <CardBody className="p-0 flex-grow overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {sortedStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 space-y-2">
            <GraduationCap size={48} className="text-gray-300 mb-2" />
            <p className="text-base font-medium">Aún no tienes tesistas asignados</p>
            <p className="text-sm text-gray-400">Se mostrarán aquí cuando tengas estudiantes a cargo.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedStudents.map((student) => {
              const progressColor = getProgressColor(student.progreso);
              const isHighProgress = student.progreso >= 90;
              
              return (
                <Link 
                  href={student.linkToProject} 
                  key={student.id} 
                  className="block hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center p-4 gap-3">
                    <Avatar 
                      src={student.avatar} 
                      name={student.nombre} 
                      size="md" 
                      className="flex-shrink-0 ring-2 ring-gray-100"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate" title={student.nombre}>
                            {student.nombre}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5 line-clamp-1" title={student.temaTitulo}>
                            {student.temaTitulo}
                          </p>
                        </div>
                        
                        <div className="flex items-center">
                          <span className={`text-xs font-semibold text-${progressColor}-600 whitespace-nowrap`}>
                            {student.progreso}%
                          </span>
                          {isHighProgress && (
                            <Badge color="success" variant="flat" className="ml-2 py-0.5 gap-0.5 text-[10px]">
                              <Award size={10} /> Finalizado
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 mb-1.5">
                        <Progress 
                          value={student.progreso} 
                          color={progressColor as any} 
                          size="sm" 
                          className="h-2 rounded-full" 
                        />
                      </div>
                      
                      {student.estadoActual && (
                        <div className="flex items-center text-xs font-medium gap-1.5 mt-1">
                          <Clock size={12} className={`text-${progressColor}-500`} />
                          <span className={`text-${progressColor}-600`}>
                            {student.estadoActual}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <ArrowRight 
                      size={16} 
                      className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 ml-1 hidden sm:block" 
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardBody>
      
      {sortedStudents.length > 0 && (
        <CardFooter className="border-t border-gray-100 p-3">
          <Button 
            variant="light" 
            color="primary" 
            size="sm" 
            className="w-full text-xs font-medium py-2 hover:bg-primary-50 transition-colors"
            as={Link} 
            href="/mis-tesistas"
          >
            Ver todos mis tesistas
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyStudentsProgressCard;