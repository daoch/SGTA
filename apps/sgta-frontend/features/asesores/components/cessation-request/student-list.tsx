"use client"

import { useState } from "react"
import { useCessationRequestAssignmentStore } from "@/features/asesores/store/assignment-cessation-request" 
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function StudentList() {
  const { students, selectedStudent, selectStudent } = useCessationRequestAssignmentStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter((student) => {
    

    const fullName = `${student.name} ${student.lastName}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()

    return (
      fullName.includes(searchLower) ||
      student.code.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="h-full flex flex-col">
      <Input
        placeholder="Buscar por nombre, código o correo"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
        {filteredStudents.map((student) => {
          const isAssigned = student.advisorId !== null
          const isSelected = selectedStudent?.id === student.id

          return (
            <div
              key={student.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-md border transition-colors",
                isSelected ? "border-primary bg-primary/5" : "border-border",
                isAssigned ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800" : "",
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => selectStudent(student)}
                id={`student-${student.id}`}
              />

              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <img
                  src={student.urlPhoto ?? "/placeholder.svg"}
                  alt={`${student.name} ${student.lastName}`}
                  className="object-cover h-full w-full"
                />
                {isAssigned && (
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-background rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <label htmlFor={`student-${student.id}`} className="font-medium cursor-pointer">
                  {student.name} {student.lastName}
                </label>
                <div className="text-sm text-muted-foreground truncate">{student.email}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{student.code}</span>
                  {student.thematicAreas.map((thematicArea)=>(
                    <Badge variant="outline" className="text-xs" key={thematicArea.id}>
                      {thematicArea.description}
                    </Badge>
                  ))
                  }
                </div>
              </div>
            </div>
          )
        })}

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No se encontraron alumnos</div>
        )}
      </div>
    </div>
  )
}
