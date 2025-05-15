"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Loader2, Users } from "lucide-react";
import { StudentList } from "@/features/asesores/components/cessation-request/student-list";
import AdvisorList from "@/features/asesores/components/cessation-request/list-available-assessors";
import { AssignedAdvisorsList } from "./assigned-advisor-list"; 
import { z } from "zod";
import { toast } from "sonner";
import { ICessationRequestAssignmentModalProps } from "@/features/asesores/types/cessation-request";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { differenceInDays, format } from "date-fns";
import { useApproveTerminationRequest, useRequestTerminationDetail } from "@/features/asesores/queries/cessation-request";
import { useCessationRequestAssignmentStore } from "../../store/assignment-cessation-request";
import Image from "next/image";



export function AssignmentModal({ open, onOpenChange, idRequest, refetch }: Readonly<ICessationRequestAssignmentModalProps>) {
  const { students, setStudents, selectedStudent, assignedStudents, clear} = useCessationRequestAssignmentStore();
  const [ activeTab, setActiveTab ] = useState("list");
  const { isLoading: loadingRequestDetail, data: dataRequestDetail} = useRequestTerminationDetail(idRequest);
  const approveMutation = useApproveTerminationRequest();

  // Clear data state from previous state 
  useEffect(()=>{
    clear();
  },[clear]);
  
  useEffect(()=>{
    if(dataRequestDetail)
      setStudents(dataRequestDetail?.students ?? []);
  }, [dataRequestDetail, setStudents]);
  
  const isProcessing = approveMutation.status === "pending";
  const countAssignedStudents = students.filter((student)=>student.advisorId!==null).length;
  const countUnassignedStudents = students.filter((student)=>student.advisorId===null).length;

  const handleSubmit = () => {
    try {
      const assignmentSchema = z.object({
        assignedStudents: z.record(z.string()).refine(
          () => countUnassignedStudents===0,
          {
            message: "Todos los alumnos deben tener un asesor asignado",
          }
        ),
      });
      
      console.log("Validando datos", assignedStudents, students);

      assignmentSchema.parse({ assignedStudents });

      if (!dataRequestDetail?.id){
        console.error("No se obtuvo la informacion del detalle de la solicitud");
        return;
      }
      approveMutation.mutate(
        {
          requestId: dataRequestDetail.id,
          responseText: "Text placeholder",
        },
        {
          onSuccess: () => {
            toast.success("Asignación completada", {
              description: "Todos los alumnos han sido asignados correctamente",
            });
            refetch();
            onOpenChange(false);
          },
          onError: (error) => {
            const message = error instanceof Error ? error.message : "Error desconocido";
            toast.error("Error del servidor", {
              description: message,
            });
          },
        }
      );
      refetch();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Error de validación", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("Error inesperado", {
          description: "Ha ocurrido un error al procesar la asignación",
        });
      }
    }
  };

  

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      >
      <DialogContent className="w-full sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Asignación de Asesores a Alumnos</DialogTitle>
        </DialogHeader>
        {(()=>{
          if (loadingRequestDetail)
            return (
              <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="mt-4">Cargando detalle de solicitud...</p>
              </div>
          );

          if (dataRequestDetail)
            return (
              <>
                <div className="w-full flex justify-between items-center p-4 rounded-md gap-4 flex-wrap md:flex-nowrap">
                  
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <Avatar className="h-10 w-10">
                      {dataRequestDetail.assessor.urlPhoto ? (
                        <Image
                          src={dataRequestDetail.assessor.urlPhoto}
                          alt={`User-photo-${dataRequestDetail.assessor.id}`}
                          className="rounded-full"
                        />
                      ) : (
                        <AvatarFallback className="bg-gray-400" />
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{`${dataRequestDetail.assessor.name} ${dataRequestDetail.assessor.lastName}`}</p>
                      <p className="text-xs text-muted-foreground">{dataRequestDetail.assessor.email}</p>
                    </div>
                  </div>

                  
                  <div className="min-w-[200px]">
                    <p className="text-[11px] text-gray-500">Fecha de Solicitud:</p>
                    <p className="font-medium text-gray-800">
                      {`${format(dataRequestDetail.registerTime, "dd/MM/yyyy")} - ${format(dataRequestDetail.registerTime, "hh:mm a")}`}
                    </p>
                    <p className="text-gray-500">{`Hace ${differenceInDays(new Date(), dataRequestDetail.registerTime)} días`}</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total de alumnos</p>
                        <p className="text-2xl font-bold">{countAssignedStudents + countUnassignedStudents}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Alumnos asignados</p>
                        <p className="text-2xl font-bold">{countAssignedStudents}</p>
                      </div>
                    </div>
                  </div>
                </div>
              
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
                      <h2 className="text-xl font-semibold">Asesores disponibles</h2>
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
              </>
            );
        })()}
        <DialogFooter className="mt-4">
          <Button
          variant="outline"
          onClick={() => {onOpenChange(false);}}>
            Cancelar
          </Button>
          {isProcessing?
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Procesando...
          </>
          :
          <Button onClick={handleSubmit} disabled={countUnassignedStudents!==0}>
            {countUnassignedStudents===0
              ? "Guardar asignaciones"
              : `Faltan ${countUnassignedStudents} alumnos por asignar`}
          </Button>
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
