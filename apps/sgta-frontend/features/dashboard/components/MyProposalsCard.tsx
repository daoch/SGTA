// src/features/dashboard/components/MyProposalsCard.tsx
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Chip, Button, Badge } from '@heroui/react';
import { FolderGit2, Users, ArrowRight, Plus, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { MyProposalInfo } from '../types';

interface MyProposalsCardProps {
  proposals: MyProposalInfo[];
}

// Mapeo de estados mejorado con iconos y colores más claros
const proposalStatusConfig: Record<MyProposalInfo['estado'], { 
  color: "success" | "primary" | "warning" | "danger" | "default"; 
  text: string;
  icon: React.ElementType;
  bgColor: string;
}> = {
  aprobado: { 
    color: "success", 
    text: "Aprobado", 
    icon: CheckCircle,
    bgColor: "bg-success-50"
  },
  en_revision: { 
    color: "warning", 
    text: "En Revisión", 
    icon: Clock,
    bgColor: "bg-warning-50"
  },
  con_interesados: { 
    color: "primary", 
    text: "Con Interesados", 
    icon: Users,
    bgColor: "bg-primary-50"
  },
  rechazado: { 
    color: "danger", 
    text: "Rechazado", 
    icon: XCircle,
    bgColor: "bg-danger-50"
  },
  borrador: { 
    color: "default", 
    text: "Borrador", 
    icon: AlertCircle,
    bgColor: "bg-gray-50"
  },
};

const MyProposalsCard: React.FC<MyProposalsCardProps> = ({ proposals }) => {
  // Ordenar por estado y luego por interesados (priorizar los que tienen interesados)
  const sortedProposals = [...proposals].sort((a, b) => {
    const stateOrder = {
      'con_interesados': 0,
      'en_revision': 1,
      'aprobado': 2,
      'borrador': 3,
      'rechazado': 4
    };
    
    const stateA = stateOrder[a.estado as keyof typeof stateOrder] || 99;
    const stateB = stateOrder[b.estado as keyof typeof stateOrder] || 99;
    
    if (stateA !== stateB) return stateA - stateB;
    
    // Si ambos tienen el mismo estado, priorizar los que tienen más interesados
    const interesadosA = a.interesadosCount || 0;
    const interesadosB = b.interesadosCount || 0;
    
    return interesadosB - interesadosA;
  });

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl h-full flex flex-col bg-white overflow-hidden">
      <CardHeader className="pb-4 pt-5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
            <FolderGit2 size={20} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Mis Propuestas de Temas</h3>
        </div>
        <p className="text-sm text-gray-600 ml-10">
          Estado de los temas que has propuesto.
        </p>
      </CardHeader>
      
      <CardBody className="p-0 flex-grow overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {sortedProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <FolderGit2 size={48} className="text-gray-300 mb-3" />
            <p className="text-base font-medium">No has propuesto temas aún</p>
            <p className="text-sm text-gray-400 mb-4">Comienza creando tu primera propuesta</p>
            <Button 
              color="primary" 
              size="sm" 
              as={Link} 
              href="/gestion-temas/nuevo"
              startContent={<Plus size={14} />}
              className="font-medium"
            >
              Crear propuesta
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedProposals.map((proposal) => {
              const statusInfo = proposalStatusConfig[proposal.estado] || { 
                color: "default", 
                text: proposal.estado,
                icon: AlertCircle,
                bgColor: "bg-gray-50"
              };
              const StatusIcon = statusInfo.icon;
              
              // Determinar si hay interesados para destacar
              const hasInterested = proposal.interesadosCount !== undefined && proposal.interesadosCount > 0;
              
              return (
                <Link 
                  href={proposal.linkToTheme} 
                  key={proposal.id} 
                  className="block hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className={`p-4 relative ${
                    proposal.estado === 'con_interesados' ? 'bg-blue-50/30 hover:bg-blue-50/50' : ''
                  }`}>
                    {/* Indicador visual para propuestas con interesados */}
                    {proposal.estado === 'con_interesados' && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></span>
                    )}
                    
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`p-2 rounded-full ${statusInfo.bgColor} text-${statusInfo.color}-600 ring-1 ring-${statusInfo.color}-200 shadow-sm flex-shrink-0 mt-0.5`}>
                          <StatusIcon size={16} strokeWidth={2} />
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug" title={proposal.titulo}>
                            {proposal.titulo}
                          </p>
                          {proposal.area && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              Área: {proposal.area}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Chip 
                        color={statusInfo.color} 
                        variant="flat" 
                        size="sm" 
                        className="flex-shrink-0 capitalize font-medium"
                      >
                        {statusInfo.text}
                      </Chip>
                    </div>
                    
                    <div className="flex justify-between items-center ml-10">
                      {hasInterested ? (
                        <Badge 
                          color="primary" 
                          variant="flat" 
                          className="text-xs flex items-center gap-1 pl-1.5 pr-2 py-1"
                        >
                          <Users size={12} />
                          <span className="font-medium">{proposal.interesadosCount} interesado{proposal.interesadosCount !== 1 ? 's' : ''}</span>
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-500">Sin interesados aún</span>
                      )}
                      
                      <ArrowRight 
                        size={16} 
                        className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardBody>
      
      {sortedProposals.length > 0 && (
        <CardFooter className="border-t border-gray-100 p-3 flex gap-2">
          <Button 
            variant="light" 
            color="primary" 
            size="sm" 
            className="flex-1 text-xs font-medium py-2 hover:bg-primary-50 transition-colors"
            as={Link} 
            href="/gestion-temas"
          >
            Gestionar mis propuestas
            <ArrowRight size={14} className="ml-1.5" />
          </Button>
          
          <Button 
            color="primary" 
            size="sm" 
            className="px-3 py-2"
            as={Link} 
            href="/gestion-temas/nuevo"
            title="Crear nueva propuesta"
          >
            <Plus size={16} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyProposalsCard;