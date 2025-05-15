'use client';

import React from 'react';
import { Loader2, Calendar, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { IRequestTerminationConsultancyRequestData } from '@/features/asesores/types/cessation-request';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { differenceInDays, format } from 'date-fns';

interface ApproveCessationModalProps {
  isOpen: boolean;
  request: IRequestTerminationConsultancyRequestData | null;
  loading: boolean;
  onClose: () => void;
 
}

const ApproveCessationModal: React.FC<ApproveCessationModalProps> = ({
  isOpen,
  onClose,
  request,
  loading
  
}) => {
  
  

  const statusConfig: Record<IRequestTerminationConsultancyRequestData['status'], { color: string; text: string }> = {
      pending: { color: "bg-yellow-200 text-yellow-800", text: "Pendiente" },
      approved: { color: "bg-green-200 text-green-800", text: "Aprobada" },
      rejected: { color: "bg-red-200 text-red-800", text: "Rechazada" },
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[800px]">
        <DialogHeader>
            <DialogTitle>Detalle de Solicitud de Cese</DialogTitle>
        </DialogHeader>
        { (() => {
            if (loading)
                return (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p className="mt-4">
                            Cargando detalle de solicitud...
                        </p>
                    </div>
                )
            if (request)
                return (
                    <Card className="mb-3 shadow-sm border">
                        <CardHeader className="py-4 px-4 bg-gray-50 flex flex-row justify-between items-center">
                            <div className="flex items-center gap-2 ">
                                <Avatar className="h-8 w-8">
                                    {request.assessor.urlPhoto ? (
                                        <img
                                            src={request.assessor.urlPhoto}
                                            alt={`User-photo-${request.assessor.id}`}
                                            className='rounded-full'
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-gray-400" />
                                    )}
                                </Avatar>
                                <div>
                                <p className="text-sm font-medium">{`${request.assessor.name} ${request.assessor.lastName}`}</p>
                                <p className="text-xs text-muted-foreground">{request.assessor.email}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusConfig[request.status]?.color}`}>
                                {statusConfig[request.status]?.text}
                            </span>
                        </CardHeader>

                        <CardContent className="py-3 px-4 text-xs h-full">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2 mb-2 p-2">
                                <div className="flex items-start gap-1.5 min-w-[200px]">
                                    <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
                                    <div>
                                        <span className="text-gray-500 text-[11px]">Solicitud:</span>
                                        <span className="font-medium text-gray-800 block">{`${format(request.registerTime, 'dd/MM/yyyy')} - ${format(request.registerTime, 'hh:mm a')}`}</span>
                                        <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), request.registerTime)} días`}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-1.5 min-w-[200px]">
                                    <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
                                    <div>
                                        <span className="text-gray-500 text-[11px]">Fecha de respuesta:</span>
                                        <span className="font-medium text-gray-800 block">{`${format(request.responseTime, 'dd/MM/yyyy')} - ${format(request.responseTime, 'hh:mm a')}`}</span>
                                        <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), request.responseTime)} días`}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-1.5">
                                    <Users className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
                                    <div>
                                        <span className="text-gray-500 text-[11px]">Proyectos: </span>
                                        <Badge variant="secondary">{request.students.length}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-2 p-2">
                                <p className="text-[11px] text-gray-500 font-medium mb-0.5">Motivo:</p>
                                <p className="text-xs text-gray-700 leading-snug line-clamp-2">{request.reason}</p>
                            </div>
                        

                            {request.students.length > 0 && (
                                <div className="mb-1 p-2">
                                    <span className="text-[11px] text-gray-500 font-medium mb-0.5">{request.status==="approved"?"Tesistas reasignados: ":"Tesistas asociados: "}</span>
                                    <Badge variant="secondary">{request.students.length}</Badge>
                                    <div className="space-y-0.5 h-[100px] overflow-y-auto pr-1">
                                    {  
                                        request.students.map(student => (
                                        <div key={`student-${student.id}`} className="text-xs text-gray-600 flex items-start gap-1 my-2">
                                            <User className="h-3 w-3 mt-0.5 text-gray-400" />
                                            <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}:</span>
                                            <span className="truncate text-gray-600">{student.topic.name}</span>
                                        </div>
                                        ))
                                    }
                                    
                                    </div>
                                </div>
                            )}

                            {request.status === 'rejected' && request.response && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                    <p className="text-xs font-medium text-red-700 mb-0.5">Motivo del rechazo:</p>
                                    <p className="text-xs text-red-600 leading-snug line-clamp-2">{request.response}</p>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                )
            return (
                <div>No se encontró informacion sobre esta solicitud de cese</div>
            )
        })()}
        <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose} >
            Cerrar
            </Button>
        </DialogFooter>
            
        
      </DialogContent>
    </Dialog>
  );
};

export default ApproveCessationModal;