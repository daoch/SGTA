"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, Check, X } from "lucide-react"
import { AssessorChangeCardRequestProps, IRequestAssessorChangeRequestData } from "@/features/asesores/types/assessor-change-request"
import { differenceInDays, format } from "date-fns"


const AssessorChangeRequestCard: React.FC<AssessorChangeCardRequestProps> = ({
    request,
    onApprove,
    onReject
}) => {
  const statusConfig: Record<IRequestAssessorChangeRequestData['status'], { color: string; text: string }> = {
      pending: { color: "bg-yellow-200 text-yellow-800", text: "Pendiente" },
      approved: { color: "bg-green-200 text-green-800", text: "Aprobada" },
      rejected: { color: "bg-red-200 text-red-800", text: "Rechazada" },
  };
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="py-4 px-4 bg-gray-50 flex flex-row justify-between items-center">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            {request.student.urlPhoto ? (
                <img
                    src={request.student.urlPhoto}
                    alt={`User-photo-${request.student.id}`}
                />
            ) : (
                <AvatarFallback className="bg-gray-400" />
            )}
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">{`${request.student.name} ${request.student.lastName}`}</h3>
            <p className="text-xs text-gray-500 leading-tight">{request.student.email}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusConfig[request.status]?.color}`}>
          {statusConfig[request.status]?.text}
        </span>
      </CardHeader>
      <CardContent className="px-6 py-2 space-y-4">
          <div className="flex items-start gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 mt-0.5 text-gray-400" />
            <div>
              <span className="text-gray-500 text-[11px]">Solicitud:</span>
              <span className="font-medium text-gray-800 block">{`${format(request.registerTime, 'dd/MM/yyyy')} - ${format(request.registerTime, 'hh:mm a')}`}</span>
              <span className="text-gray-500 block">{`Hace ${differenceInDays(new Date(), request.registerTime)} días`}</span>
            </div>
          </div>

        <div>
          <p className="text-sm font-medium mb-1">Motivo:</p>
          <p className="text-sm text-muted-foreground">{request.reason}</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Tema de tesis:</p>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm">{request.student.topic.name}</p>
            <Badge variant="outline" className="mt-2">
              {request.student.topic.thematicArea.name}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Asesores asociados:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {request.assessors.map((advisor) => (
              <Card key={advisor.id} className="border shadow-none bg-muted/50">
                <CardContent className="p-1">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      {advisor.urlPhoto ? (
                          <img
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
      </CardContent>
      <CardFooter className="px-6 py-4 flex justify-end gap-2 border-t">
        {request.status === 'pending' ? (
          <>
            <Button variant="outline" size="sm" onClick={() => onReject()}>
              <X size={14} className="mr-1" /> Rechazar
            </Button>
            <Button size="sm" onClick={() => onApprove()}>
              <Check size={14} className="mr-1" /> Reasignar alumno
            </Button>
          </>
        ) : (
            <Button variant="ghost" size="sm" onClick={() => {}}>
              Ver detalles
            </Button>
        )}
      </CardFooter>
    </Card>
  )
}


export default AssessorChangeRequestCard