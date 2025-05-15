"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, BookOpen, GraduationCap } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { differenceInDays, format } from "date-fns"
import AssessorListAssessorChangeRequest from "@/features/asesores/components//assessor-change-request/list-available-assessors"
import { IAssessorChangeAssignmentModalProps } from "@/features/asesores/types/assessor-change-request"

export function AssessorChangeAssignmentModal({ open, onOpenChange, request }: Readonly<IAssessorChangeAssignmentModalProps>) {
  const [ selectedAssessorId, setSelectedAssessorId] = useState<number | null>(null)
  const handleSubmit = () => {
    try {

      toast.success("Asignación completada", {
        description: "Todos los alumnos han sido asignados correctamente",
      })

      onOpenChange(false)
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Error de validación", {
          description: error.errors[0].message,
        })
      } else {
        toast.error("Error", {
          description: "Ha ocurrido un error al procesar la asignación",
        })
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      >
      <DialogContent className="w-full sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Asignación de Asesor a Alumno</DialogTitle>
        </DialogHeader>
        
        {request && (
          <div className="w-full mb-6 space-y-4">
            {/* Primera fila: Alumno (2/6) y Tema (4/6) */}
            <div className="grid grid-cols-6 gap-4">
              {/* Alumno section - 2/6 */}
              <div className="col-span-6 md:col-span-2 border rounded-md p-3">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Users size={14} />
                  <span>Alumno</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    {request.student.urlPhoto ? (
                      <img
                        src={request.student.urlPhoto}
                        alt={`User-photo-${request.student.id}`}
                        className="rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-400" />
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{`${request.student.name} ${request.student.lastName}`}</p>
                    <p className="text-xs text-muted-foreground">{request.student.email}</p>
                  </div>
                </div>
              </div>

              {/* Tema section - 4/6 */}
              <div className="col-span-6 md:col-span-4 border rounded-md p-3">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>Tema</span>
                </div>
                <p className="text-sm font-medium mb-2">Algoritmos metaheurísticos para la predicción de temperatura en zonas Rurales en invierno</p>
                <Badge variant="secondary" className="text-xs">Ciencias de la Computación</Badge>
              </div>
            </div>

            {/* Segunda fila: Fecha (2/6) y Asesor actual (4/6) */}
            <div className="grid grid-cols-6 gap-4">
              {/* Fecha section - 2/6 */}
              <div className="col-span-6 md:col-span-2 border rounded-md p-3">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span>Fecha de Solicitud</span>
                </div>
                <p className="text-sm font-medium">
                  {`${format(request.registerTime, 'dd/MM/yyyy')} - ${format(request.registerTime, 'hh:mm a')}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">{`Hace ${differenceInDays(new Date(), request.registerTime)} días`}</p>
              </div>
              
              {/* Asesor section - 4/6 */}
              <div className="col-span-6 md:col-span-4 border rounded-md p-3">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <GraduationCap size={14} />
                  <span>Asesor Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-400">AA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Dr. Juan Pérez</p>
                    <p className="text-xs text-muted-foreground">juan.perez@universidad.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Advisors section - full width */}
        <div className="w-full border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Asesores disponibles</h2>
          </div>
        </div>
        <div className="h-[350px]">
            <AssessorListAssessorChangeRequest selectedAssessorId={selectedAssessorId} setSelectedAssessorId={setSelectedAssessorId} selectedIdThematicArea={request.student.topic.thematicArea.id}/>
        </div>
        
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {onOpenChange(false)}}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedAssessorId}>
            {selectedAssessorId
              ? "Asignar asesor"
              : `Falta asignar asesor`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}