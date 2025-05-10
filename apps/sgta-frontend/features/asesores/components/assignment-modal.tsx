"use client"

import { useEffect, useState } from "react"
import { useAssignmentStore } from "@/features/asesores/store/solicitud-cese-asesoria" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Users } from "lucide-react"
import { StudentList } from "@/features/asesores/components/student-list"
import { AdvisorList } from "@/features/asesores/components/advisor-list"
import { AssignedAdvisorsList } from "./assigned-advisor-list" 
import { z } from "zod"
import { toast } from "sonner"
import { IRequestTerminationConsultancyRequestData } from "@/features/asesores/types/solicitud-cese-asesoria"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { differenceInDays, format } from "date-fns"
import { useRequestTerminationFullStudentList } from "../queries/solicitud-cese-asesoria"

interface AssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: IRequestTerminationConsultancyRequestData
}

export function AssignmentModal({ open, onOpenChange, request }: AssignmentModalProps) {
  const { assignedAdvisors, students, setStudents, selectedStudent, assignedStudents, getUnassignedStudentsCount, clear} = useAssignmentStore()
  const [ activeTab, setActiveTab ] = useState("list")
  const { isLoading, data, isError, error, refetch } = useRequestTerminationFullStudentList(request.id)

  // Clear data state from previous state 
  useEffect(()=>{
    clear()
  },[])
  
  useEffect(()=>{
    if(data)
      setStudents(data)
  }, [data])
  

  const areAllStudentsAssigned = students.filter((student)=>student.advisorId===null).length === 0

  const handleSubmit = () => {
    try {
      const assignmentSchema = z.object({
        assignedStudents: z.record(z.string()).refine((data) => Object.keys(data).length === students.length, {
          message: "Todos los alumnos deben tener un asesor asignado",
        }),
      })

      assignmentSchema.parse({ assignedStudents })

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
      <DialogContent className="w-full sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Asignación de Asesores a Alumnos</DialogTitle>
        </DialogHeader>
        {request && (
          <div className="w-full flex justify-between items-center p-4 rounded-md gap-4 flex-wrap md:flex-nowrap">
            
            <div className="flex items-center gap-2 min-w-[200px]">
              <Avatar className="h-10 w-10">
                {request.assessor.urlPhoto ? (
                  <img
                    src={request.assessor.urlPhoto}
                    alt={`User-photo-${request.assessor.id}`}
                    className="rounded-full"
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

            
            <div className="min-w-[200px]">
              <p className="text-[11px] text-gray-500">Fecha de Solicitud:</p>
              <p className="font-medium text-gray-800">
                {`${format(request.registerTime, 'dd/MM/yyyy')} - ${format(request.registerTime, 'hh:mm a')}`}
              </p>
              <p className="text-gray-500">{`Hace ${differenceInDays(new Date(), request.registerTime)} días`}</p>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total de alumnos</p>
                  <p className="text-2xl font-bold">{request.students.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Alumnos asignados</p>
                  <p className="text-2xl font-bold">{request.students.length - students.filter((student)=>student.advisorId===null).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          
          {/* Students section */}
          <div className="lg:col-span-3 border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Alumnos</h2>
            <div className="h-[350px]">
              <StudentList />
            </div>
          </div>

          {/* Assessors section */}
          <div className="lg:col-span-4 border rounded-lg p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Asesores</h2>
                <TabsList>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                  <TabsTrigger value="assigned">Asignado</TabsTrigger>
                </TabsList>
              </div>

              <div className="h-[350px]">
                <TabsContent value="list" className="mt-0 h-full">
                  {selectedStudent ?
                  <AdvisorList selectedStudent={selectedStudent} />
                  :
                  <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                    Seleccione un alumno para poder listar profesores según su área temática
                  </div>
                  }
                </TabsContent>

                <TabsContent value="assigned" className="mt-0 h-full">
                  <AssignedAdvisorsList />
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
        </div>
        <DialogFooter className="mt-4">
          <Button
          variant="outline"
          onClick={() => {onOpenChange(false)}}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!areAllStudentsAssigned}>
            {areAllStudentsAssigned
              ? "Guardar asignaciones"
              : `Faltan ${students.filter((student)=>student.advisorId===null).length} alumnos por asignar`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
