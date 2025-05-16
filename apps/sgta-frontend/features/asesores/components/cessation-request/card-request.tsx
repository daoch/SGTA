"use client";

import React, { useState } from "react";
import { differenceInDays, format } from "date-fns";
import {
  Check,
  X,
  Calendar,
  Clock,
  User,
  RefreshCw,
  Users
} from "lucide-react";

import { Avatar, AvatarFallback  } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ICessationRequestCardProps, IRequestTerminationConsultancyRequestData } from "@/features/asesores/types/cessation-request";
import { Image } from "@radix-ui/react-avatar";




const CessationRequestCard: React.FC<ICessationRequestCardProps> = ({
    request,
    onApprove,
    onReject
}) => {
  const SLICE_STUDENTS = 5;
  const [hideStudents, setHideStudents] = useState<boolean>(true);



  const statusConfig: Record<IRequestTerminationConsultancyRequestData["status"], { color: string; text: string }> = {
    pending: { color: "bg-yellow-200 text-yellow-800", text: "Pendiente" },
    approved: { color: "bg-green-200 text-green-800", text: "Aprobada" },
    rejected: { color: "bg-red-200 text-red-800", text: "Rechazada" },
  };

  const hasTesistas = request.students?.length > 0;

  const truncateText = (text: string | undefined, limit = 200): string => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <Card className="mb-3 shadow-sm border">
      <CardHeader className="py-4 px-4 bg-gray-50 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            {request.assessor.urlPhoto ? (
                <Image
                    src={request.assessor.urlPhoto}
                    alt={`User-photo-${request.assessor.id}`}
                />
            ) : (
                <AvatarFallback className="bg-gray-400" />
            )}
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">{`${request.assessor.name} ${request.assessor.lastName}`}</h3>
            <p className="text-xs text-gray-500 leading-tight">{request.assessor.email}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusConfig[request.status]?.color}`}>
          {statusConfig[request.status]?.text}
        </span>
      </CardHeader>

      <CardContent className="py-3 px-4 text-xs border-b">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2 mb-2 p-2">
          <div className="flex items-start gap-1.5">
            <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
            <div>
              <span className="text-gray-500 text-[11px]">Solicitud:</span>
              <span className="font-medium text-gray-800 block">{`${format(request.registerTime, "dd/MM/yyyy")} - ${format(request.registerTime, "hh:mm a")}`}</span>
              <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), request.registerTime)} días`}</span>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <Users className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
            <div>
              <span className="text-gray-500 text-[11px]">Proyectos: </span>
              <Badge variant="secondary">{request.students.length}</Badge>
            </div>
          </div>

          {request.status !== "pending" && request.registerTime && (
            <div className="flex items-start gap-1.5">
              <Clock className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
              <div>
                <span className="text-gray-500 text-[11px]">Decisión:</span>
                <span className="font-medium text-gray-800 block">{`${format(request.registerTime, "dd/MM/yyyy")} - ${format(request.registerTime, "hh:mm a")}`}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-2 p-2">
          <p className="text-[11px] text-gray-500 font-medium mb-0.5">Motivo:</p>
          <p className="text-xs text-gray-700 leading-snug line-clamp-2">{request.reason}</p>
        </div>

        {hasTesistas && (
          <div className="mb-1 p-2">
            <span className="text-[11px] text-gray-500 font-medium mb-0.5">Tesistas afectados: </span>
            <Badge variant="secondary">{request.students.length}</Badge>
            <div className="space-y-0.5">
              {  
                request.students.slice(hideStudents?0:undefined, hideStudents?SLICE_STUDENTS:undefined).map(student => (
                  <div key={`student-${student.id}`} className="text-xs text-gray-600 flex items-start gap-1">
                    <User className="h-3 w-3 mt-0.5 text-gray-400" />
                    <span className="font-medium text-gray-800">{`${student.name} ${student.lastName}`}:</span>
                    <span className="truncate text-gray-600">{truncateText(student.topic.name, 150)}</span>
                  </div>
                ))
              }
              {request.students.length > SLICE_STUDENTS && (
                
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs p-0 h-auto mt-0.5"
                  onClick={() => {setHideStudents((state)=>!state);}}
                  >
                  {hideStudents?`Ver los ${request.students.length - SLICE_STUDENTS} tesistas`:`Ocultar los ${request.students.length - SLICE_STUDENTS} tesistas`}
                </Button>
              )}
            </div>
          </div>
        )}

        {request.status === "rejected" && request.response && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs font-medium text-red-700 mb-0.5">Motivo del rechazo:</p>
            <p className="text-xs text-red-600 leading-snug line-clamp-2">{request.response}</p>
            {request.response.length > 100 && (
              <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-0.5 text-red-600" onClick={() => {}}>
                Ver completo
              </Button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="py-2 px-4 bg-gray-50 flex justify-end gap-2">
        {request.status === "pending" ? (
          <>
            <Button variant="outline" size="sm" onClick={() => onReject()}>
              <X size={14} className="mr-1" /> Rechazar
            </Button>
            <Button size="sm" onClick={() => onApprove()}>
              <Check size={14} className="mr-1" /> Reasignar alumnos
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              Ver detalles
            </Button>
            {request.status === "approved" && hasTesistas && (
              <Button size="sm" onClick={() => console.log(`Ir a reasignaciones para solicitud ${request.id}`)}>
                <RefreshCw size={14} className="mr-1" /> Reasignaciones
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CessationRequestCard;
