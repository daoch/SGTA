"use client"

import { useState, useMemo, useEffect } from "react"
import { useAssignmentStore } from "@/features/asesores/store/solicitud-cese-asesoria" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, User, UserMinus, UserPlus } from "lucide-react"
import { useDebounce } from "../hooks/use-debounce"
import { ISearchCriteriaAvailableAdvisorList, IStudentCessationRequest } from "@/features/asesores/types/solicitud-cese-asesoria"
import { useRequestTerminationAdvisorPerThematicArea } from "../queries/solicitud-cese-asesoria"

import CessationRequestPagination from "@/features/asesores/components/solicitudes-cese-asesoria-pagination"

export function AdvisorList({selectedStudent}: {selectedStudent: IStudentCessationRequest}) {
  const {
    assignAdvisor,
    advisors,
    setAdvisors,
    assignedAdvisors,
    unassignAdvisor,
    addAssignedAdvisor,
    removeAssignedAdvisor,
  } = useAssignmentStore()

  const initialStateSearchCriteria: ISearchCriteriaAvailableAdvisorList = {idThematicArea: null, fullNameEmailCode: "", page: 1}

  const [ searchCriteria, setSearchCriteria ] = useState(initialStateSearchCriteria)
  const { isLoading, data} = useRequestTerminationAdvisorPerThematicArea(searchCriteria)
  const debouncedSearchTerm = useDebounce(searchCriteria.fullNameEmailCode, 2000)
  const [localTerm, setLocalTerm] = useState(searchCriteria.fullNameEmailCode);
  useEffect(()=>{
    setAdvisors(data?.advisors ?? [])
  },[data])


  useEffect(()=>{
    setSearchCriteria((prev) => ({
      ...prev,
      idThematicArea: selectedStudent.thematicArea.id, 
      page: 1,
    }));
  },[selectedStudent])
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
    }))
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
              {isLoading?
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground w-full">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p className="mt-4">
                        {isLoading ? "Cargando solicitudes..." : "Cargando solicitudes..."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
              
              : advisors.length === 0 ? 
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No se encontraron asesores
                  </TableCell>
                </TableRow>
              :advisors.map((advisor) => {
                const advisorAssignedCount = assignedAdvisors.find((assignedAdvisor)=>assignedAdvisor.id === advisor.id)?.assignedStudentsQuantity ?? advisor.assignedStudentsQuantity
                const isAtCapacity = advisorAssignedCount >= advisor.capacity
                const wasAssigned = advisor.id === selectedStudent.advisorId
                const assignedAndAtCapacity = wasAssigned || (isAtCapacity && wasAssigned)
                return (
                  <TableRow key={advisor.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={advisor.profilePicture || "/placeholder.svg"}
                          alt={`${advisor.firstName} ${advisor.lastName}`}
                          className="object-cover h-full w-full"
                        />
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
                            className={selectedStudent.thematicArea.id === area.id ? "bg-primary/10" : ""}
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
                      {
                        assignedAndAtCapacity ?(
                          <Button
                            size="sm"
                            variant={"default"}
                            className="bg-red-500 hover:bg-red-800"
                            onClick={() => {
                              unassignAdvisor(selectedStudent.id)
                              removeAssignedAdvisor(advisor.id)
                            }}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )
                        : !isAtCapacity ? (
                          <Button
                            size="sm"
                            variant={"default"}
                            onClick={() => {
                              if(selectedStudent.advisorId && selectedStudent.advisorId !== advisor.id){
                                unassignAdvisor(selectedStudent.id)
                                removeAssignedAdvisor(selectedStudent.advisorId)
                              }
                              assignAdvisor(selectedStudent.id, advisor.id)
                              addAssignedAdvisor(advisor)
                            }}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={"outline"}
                            disabled={true}
                          >
                            <User className="h-4 w-4" />
                          </Button>
                        )
                      }
                      
                    </TableCell>
                  </TableRow>
                )
              })}


              <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  <CessationRequestPagination
                      currentPage={searchCriteria.page}
                      totalPages={data?.totalPages || 1}
                      onPageChange={handlePageChange}                
                    />
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}