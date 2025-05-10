"use client"

import { useAssignmentStore } from "@/features/asesores/store/solicitud-cese-asesoria" 
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserMinus } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function AssignedAdvisorsList() {
  const { students, assignedAdvisors, unassignAdvisor, removeAssignedAdvisor, selectedStudent } =
    useAssignmentStore()

  if (assignedAdvisors.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No hay asesores asignados todavía</div>
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Asesor</TableHead>
              <TableHead>Áreas</TableHead>
              <TableHead>Alumnos asignados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedAdvisors.map((advisor) => {
              const isSelectedStudentAdvisor = selectedStudent?.advisorId === advisor.id
              
              return (
                <TableRow key={advisor.id} className={cn(isSelectedStudentAdvisor && "bg-primary/10")}>
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
                      <div className="text-sm text-muted-foreground">{advisor.email}</div>
                      <div className="text-xs text-muted-foreground">{advisor.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {advisor.thematicAreas.map((area) => (
                        <Badge
                          key={area.description}
                          variant="outline"
                          className={selectedStudent?.thematicArea === area ? "bg-primary/10" : ""}
                        >
                          {area.description}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {students.filter((student)=>student.advisorId === advisor.id).map((student) => (
                        <div
                          key={student.id}
                          className={cn(
                            "text-sm flex items-center justify-between gap-2 p-2 rounded",
                            selectedStudent?.id === student.id && "bg-primary/10",
                          )}
                        >
                          <div>
                            <div className="font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">{student.code}</div>
                          </div>
                          <Button
                            size="icon"
                            className="h-7 w-7 bg-amber-700"
                            onClick={() => {
                                unassignAdvisor(student.id)
                                removeAssignedAdvisor(advisor.id)
                              }}
                          >
                            <UserMinus className="h-4 w-4" />
                            <span className="sr-only">Desasignar</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
