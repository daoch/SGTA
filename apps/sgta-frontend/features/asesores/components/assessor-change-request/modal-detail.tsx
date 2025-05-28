"use client";

import React from "react";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IAssessorChangeApproveModalProps, IRequestAssessorChangeRequestData } from "@/features/asesores/types/assessor-change-request";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { differenceInDays, format } from "date-fns";
import { useRequestAssessorChangeDetail } from "../../queries/assessor-change-request";
import Image from "next/image";


const ApproveAssessorChangeModal: React.FC<IAssessorChangeApproveModalProps> = ({
  isOpen,
  onClose,
  idRequest
  
}) => {
    const { isLoading: loadingRequestDetail, data: dataRequestDetail} = useRequestAssessorChangeDetail(idRequest);
    const statusConfig: Record<IRequestAssessorChangeRequestData["status"], { color: string; text: string }> = {
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
        {(()=>{
            if (loadingRequestDetail)
                return (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p className="mt-4">
                            Cargando detalle de solicitud...
                        </p>
                    </div>
                );
            if (dataRequestDetail)
                return (
                    <Card className="mb-3 shadow-sm border">
                        <CardHeader className="py-4 px-4 bg-gray-50 flex flex-row justify-between items-center">
                            <div className="flex items-center gap-2 ">
                                <Avatar className="h-8 w-8">
                                    {dataRequestDetail.student.urlPhoto ? (
                                        <Image
                                            src={dataRequestDetail.student.urlPhoto}
                                            alt={`User-photo-${dataRequestDetail.student.id}`}
                                            className='rounded-full'
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-gray-400" />
                                    )}
                                </Avatar>
                                <div>
                                <p className="text-sm font-medium">{`${dataRequestDetail.student.name} ${dataRequestDetail.student.lastName}`}</p>
                                <p className="text-xs text-muted-foreground">{dataRequestDetail.student.email}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusConfig[dataRequestDetail.status]?.color}`}>
                                {statusConfig[dataRequestDetail.status]?.text}
                            </span>
                        </CardHeader>

                        <CardContent className="py-3 px-4 text-xs h-full">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2 mb-2 p-2">
                                <div className="flex items-start gap-1.5 min-w-[200px]">
                                    <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
                                    <div>
                                        <span className="text-gray-500 text-[11px]">Solicitud:</span>
                                        <span className="font-medium text-gray-800 block">{`${format(dataRequestDetail.registerTime, "dd/MM/yyyy")} - ${format(dataRequestDetail.registerTime, "hh:mm a")}`}</span>
                                        <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), dataRequestDetail.registerTime)} días`}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-1.5 min-w-[200px]">
                                    <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
                                    <div>
                                        <span className="text-gray-500 text-[11px]">Fecha de respuesta:</span>
                                        <span className="font-medium text-gray-800 block">{`${format(dataRequestDetail.responseTime, "dd/MM/yyyy")} - ${format(dataRequestDetail.responseTime, "hh:mm a")}`}</span>
                                        <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), dataRequestDetail.responseTime)} días`}</span>
                                    </div>
                                </div>

                            </div>

                            <div className="mb-2 p-2">
                                <p className="text-[11px] text-gray-500 font-medium mb-0.5">Motivo:</p>
                                <p className="text-xs text-gray-700 leading-snug line-clamp-2">{dataRequestDetail.reason}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Asesores asociados:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {dataRequestDetail.previousAssessors.map((advisor) => (
                                    <Card key={advisor.id} className="border shadow-none bg-muted/50">
                                        <CardContent className="p-1">
                                        <div className="flex items-center gap-2 p-2">
                                            <Avatar className="h-8 w-8">
                                            {advisor.urlPhoto ? (
                                                <Image
                                                    src={advisor.urlPhoto}
                                                    alt={`User-photo-${advisor.id}`}
                                                />
                                            ) : (
                                                <AvatarFallback className="bg-gray-400" />
                                            )}
                                            </Avatar>
                                            <div>
                                            <h3 className="text-sm font-semibold text-gray-800 leading-tight">{`${advisor.name} ${advisor.lastName}`}</h3>
                                            <p className="text-xs text-gray-500 leading-tight">{advisor.email}</p>
                                            </div>
                                        </div>
                                        </CardContent>
                                    </Card>
                                    ))}
                                </div>
                            </div>
                            {dataRequestDetail.status === "rejected" && dataRequestDetail.response && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                    <p className="text-xs font-medium text-red-700 mb-0.5">Motivo del rechazo:</p>
                                    <p className="text-xs text-red-600 leading-snug line-clamp-2">{dataRequestDetail.response}</p>
                                </div>
                            )}



                        </CardContent>
                    </Card>
                );
            
            
        return (
            <div>No se encontró informacion sobre esta solicitud de cambio de asesor</div>
        );
        
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

export default ApproveAssessorChangeModal;