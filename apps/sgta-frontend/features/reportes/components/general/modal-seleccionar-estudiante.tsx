"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { useMemo, useState } from "react";
import { AlumnoReviewer } from "../../types/Alumno.type";

interface SeleccionarEstudianteModalProps {
  students: AlumnoReviewer[];
  selectedStudentId: number;
  onSelect: (studentId: number) => void;
}

export function SeleccionarEstudianteModal({
  students,
  selectedStudentId,
  onSelect,
}: SeleccionarEstudianteModalProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (s) =>
        s.temaTitulo.toLowerCase().includes(term)
        || s.codigoPucp.toLowerCase().includes(term)
        || `${s.nombres} ${s.primerApellido} ${s.segundoApellido}`.toLowerCase().includes(term)
    );
  }, [students, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-[300px] flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          {selectedStudentId
            ? (() => {
                const student = students.find((s) => s.usuarioId === selectedStudentId);
                return student 
                  ? `${student.nombres} ${student.primerApellido} ${student.segundoApellido || ''}`.trim()
                  : "Seleccionar estudiante";
              })()
            : "Seleccionar estudiante"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] w-[90vw] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-center">Buscar y seleccionar estudiante</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">
          <Input
            autoFocus
            placeholder="Buscar por nombre, código PUCP o tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-[60vh] max-h-[500px] pr-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron estudiantes que coincidan con la búsqueda
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredStudents.map((student) => (
                  <Button
                    key={`student-${student.usuarioId}`}
                    variant={student.usuarioId === selectedStudentId ? "default" : "ghost"}
                    className={`w-full flex flex-col sm:flex-row items-start justify-between gap-2 p-4 text-left h-auto ${
                      student.usuarioId === selectedStudentId
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      onSelect(student.usuarioId);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                      <span className="font-medium text-base">
                        {student.nombres} {student.primerApellido} {student.segundoApellido}
                      </span>
                      <span className="text-xs opacity-70">({student.codigoPucp})</span>
                    </div>
                    <span className={`text-xs ${
                      student.usuarioId === selectedStudentId 
                        ? "bg-primary-foreground/20" 
                        : "bg-muted"
                      } px-3 py-1.5 rounded-full w-full sm:w-auto text-center sm:text-left`}>
                      {student.temaTitulo || "Sin tema asignado"}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}