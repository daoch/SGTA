"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, User, UserMinus, UserPlus } from "lucide-react";
import { useDebounce } from "@/features/asesores/hooks/use-debounce";
import { ICessationRequestAdvisor, ICessationRequestAdvisorListProps, ICessationRequestSearchCriteriaAvailableAdvisorList, IRequestTerminationConsultancyStudentDetail } from "@/features/asesores/types/cessation-request";
import { useRequestTerminationAdvisorPerThematicArea } from "@/features/asesores/queries/cessation-request";
import CessationRequestPagination from "@/features/asesores/components/cessation-request/pagination-cessation-request";
import { useCessationRequestAssignmentStore } from "@/features/asesores/store/assignment-cessation-request";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image } from "@radix-ui/react-avatar";




export default function AvailableAssesorsList({selectedStudent}: Readonly<ICessationRequestAdvisorListProps>) {
  const {
    assignAdvisor,
    advisors,
    setAdvisors,
    assignedAdvisors,
    unassignAdvisor,
    addAssignedAdvisor,
    removeAssignedAdvisor,
  } = useCessationRequestAssignmentStore();

  const initialStateSearchCriteria: ICessationRequestSearchCriteriaAvailableAdvisorList = {idThematicAreas: [], fullNameEmailCode: "", page: 1};

  const [ searchCriteria, setSearchCriteria ] = useState(initialStateSearchCriteria);
  const { isLoading, data} = useRequestTerminationAdvisorPerThematicArea(searchCriteria);
  const debouncedSearchTerm = useDebounce(searchCriteria.fullNameEmailCode, 1500);
  const [localTerm, setLocalTerm] = useState(searchCriteria.fullNameEmailCode);

  useEffect(()=>{
    if (data)
      setAdvisors(data.assessors ?? []);
  },[data, setAdvisors]);


  useEffect(()=>{
    if (selectedStudent.thematicAreas)
      setSearchCriteria((prev) => ({
        ...prev,
        idThematicAreas: selectedStudent.thematicAreas.map(thematicArea => thematicArea.id), 
        page: prev.page,
      }));
  },[selectedStudent]);

  const debouncedTerm = useDebounce(localTerm, 1500);
  useEffect(() => {
      if (debouncedTerm !== searchCriteria.fullNameEmailCode) {
        setSearchCriteria((prev) => ({
      ...prev,
      fullNameEmailCode: debouncedTerm, 
      page: 1,
    }));
      }
  }, [debouncedTerm, searchCriteria.fullNameEmailCode]);

  const validPattern = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ@. ]*$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value.length > 50) {
      value = value.slice(0, 50);
    }

    if (validPattern.test(value)) {
      setLocalTerm(value);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchCriteria((prev)=>({
      ...prev,
      page: page
    }));
  };

  const handleReAssignAssessor = (selectedStudent: IRequestTerminationConsultancyStudentDetail, advisor: ICessationRequestAdvisor) => {
    if(selectedStudent.advisorId && selectedStudent.advisorId !== advisor.id){
      unassignAdvisor(selectedStudent.id);
      removeAssignedAdvisor(selectedStudent.advisorId);
    }
    assignAdvisor(selectedStudent.id, advisor.id);
    addAssignedAdvisor(advisor);
  };

  const getReassignClickHandler = (
    student: IRequestTerminationConsultancyStudentDetail,
    advisor: ICessationRequestAdvisor
  ) => () => {
    handleReAssignAssessor(student, advisor);
  };


  const handleUnAssignAssessor = (selectedStudent: IRequestTerminationConsultancyStudentDetail, advisor: ICessationRequestAdvisor) => {
    if(selectedStudent.advisorId && selectedStudent.advisorId !== advisor.id){
      unassignAdvisor(selectedStudent.id);
      removeAssignedAdvisor(selectedStudent.advisorId);
    }
    unassignAdvisor(selectedStudent.id);
    removeAssignedAdvisor(advisor.id);
  };

  const getUnassignClickHandler = (
    student: IRequestTerminationConsultancyStudentDetail,
    advisor: ICessationRequestAdvisor
  ) => () => {
    handleUnAssignAssessor(student, advisor);
  };

  useEffect(() => {
    setSearchCriteria((prev) => ({
      ...prev,
      fullNameEmail: debouncedSearchTerm,
      page: 1,
    }));
  }, [debouncedSearchTerm]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          placeholder="Buscar por nombre, código o correo"
          value={localTerm}
          onChange={handleChange}
          className="flex-1"
        />

      </div>
      <div className="rounded-md border overflow-hidden flex-1">
        <div className="overflow-y-auto h-[calc(100%-2px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Asesor</TableHead>
                <TableHead>Áreas Temáticas</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead className="w-[100px] text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(()=>{
              if (isLoading)
                return (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground w-full">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p className="mt-4">
                            Cargando asesores...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              if (advisors.length === 0)
                return (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No se encontraron asesores
                    </TableCell>
                </TableRow>
                );
              return (
                advisors.map((advisor) => {
                  const advisorAssignedCount = assignedAdvisors.find((assignedAdvisor)=>assignedAdvisor.id === advisor.id)?.assignedStudentsQuantity ?? advisor.assignedStudentsQuantity;
                  const isAtCapacity = advisorAssignedCount >= advisor.capacity;
                  const wasAssigned = advisor.id === selectedStudent.advisorId;
                  const assignedAndAtCapacity = wasAssigned || (isAtCapacity && wasAssigned);
                  return (
                    <TableRow key={advisor.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <Avatar className="h-8 w-8">
                            {advisor.urlPhoto ? (
                                <Image
                                    src={advisor.urlPhoto}
                                    alt={`User-photo-${advisor.firstName}`}
                                    className='rounded-full'
                                />
                            ) : (
                                <AvatarFallback className="bg-gray-400" />
                            )}
                            </Avatar>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {advisor.firstName} {advisor.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">{advisor.email}</div>
                          <div className="text-xs text-muted-foreground">{advisor.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {advisor.thematicAreas.map((area) => (
                            <Badge
                              key={area.id}
                              variant="outline"
                            >
                              {area.description}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={isAtCapacity ? "text-red-500" : ""}>
                          {advisorAssignedCount} / {advisor.capacity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {(()=>{
                          if (assignedAndAtCapacity)
                            return (
                                <Button
                                size="sm"
                                variant={"default"}
                                className="bg-red-500 hover:bg-red-800"
                                onClick={getUnassignClickHandler(selectedStudent, advisor)}
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            );
                          if(!isAtCapacity)
                            return (
                              <Button
                                size="sm"
                                variant={"default"}
                                onClick={getReassignClickHandler(selectedStudent, advisor)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            );
                          return (
                            <Button
                              size="sm"
                              variant={"outline"}
                              disabled={true}
                            >
                              <User className="h-4 w-4" />
                          </Button>
                            );
                        })()}
                        
                      </TableCell>
                    </TableRow>
                  );
              }));
              
              })()}


              <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  <CessationRequestPagination
                      currentPage={searchCriteria.page}
                      totalPages={data?.totalPages ?? 1}
                      onPageChange={handlePageChange}                
                    />
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}