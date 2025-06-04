"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { useMemo, useState } from "react";

interface Student {
  id: string;
  name: string;
  thesis: string;
}

interface SeleccionarEstudianteModalProps {
  students: Student[];
  selectedStudentId: string;
  onSelect: (studentId: string) => void;
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
        s.name.toLowerCase().includes(term) ||
        s.thesis.toLowerCase().includes(term)
    );
  }, [students, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-[300px] flex items-center gap-2">
          <User className="w-4 h-4" />
          {selectedStudentId
            ? students.find((s) => s.id === selectedStudentId)?.name || "Seleccionar estudiante"
            : "Seleccionar estudiante"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="modal-dialog modal-lg"
        style={{ width: "80%", maxWidth: "60%" }}
        >
        <DialogHeader>
          <DialogTitle className="mb-2 text-center">Buscar y seleccionar estudiante</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Buscar por nombre o tema..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-5"
        />
        <ScrollArea className="h-80">
          {filteredStudents.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No se encontraron estudiantes</div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filteredStudents.map((student) => (
                <li key={student.id}>
                  <Button
                    variant={student.id === selectedStudentId ? "default" : "ghost"}
                    className={`w-full flex flex-wrap md:flex-nowrap justify-between items-start gap-4 py-4 px-5 rounded-lg transition-all shadow-sm ${
                        student.id === selectedStudentId
                        ? "bg-[#006699] text-white"
                        : "hover:bg-gray-100"
                    }`}
                    style={{ minHeight: 56 }}
                    onClick={() => {
                        onSelect(student.id);
                        setOpen(false);
                    }}
                    >
                    <span className="font-medium text-left text-base max-w-full md:max-w-[40%] truncate">
                        {student.name}
                    </span>
                    <span className="text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap max-w-full md:max-w-[55%] truncate overflow-hidden">
                        {student.thesis}
                    </span>
                    </Button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}