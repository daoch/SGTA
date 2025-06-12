"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface ScheduleReportsDialogProps {
  defaultEmail?: string;
}

export function ScheduleReportsDialog({ defaultEmail = "usuario@pucp.edu.pe" }: ScheduleReportsDialogProps) {
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");

  const handleSaveConfiguration = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log("Guardando configuración:", {
      frequency: scheduleFrequency,
      email: defaultEmail
    });
    // Mostrar mensaje de éxito, cerrar modal, etc.
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Programar Reportes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Programar Envío de Reportes</DialogTitle>
          <DialogDescription className="text-base">
            Configura la frecuencia con la que deseas recibir reportes automáticos en tu correo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="schedule-frequency" className="text-base font-medium">Frecuencia de envío</label>
            <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
              <SelectTrigger id="schedule-frequency" className="text-base">
                <SelectValue placeholder="Selecciona frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="text-base">Diario</SelectItem>
                <SelectItem value="weekly" className="text-base">Semanal</SelectItem>
                <SelectItem value="monthly" className="text-base">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="report-format" className="text-base font-medium">Formato de reporte</label>
            <Select defaultValue="pdf">
              <SelectTrigger id="report-format" className="text-base">
                <SelectValue placeholder="Selecciona formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf" className="text-base">PDF</SelectItem>
                <SelectItem value="excel" className="text-base">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="email-input" className="text-base font-medium">Correo electrónico</label>
            <input
              id="email-input"
              type="email"
              className="w-full px-3 py-2 border rounded-md text-base"
              defaultValue={defaultEmail}
              readOnly
            />
          </div>
          <Button className="w-full mt-4 text-base" onClick={handleSaveConfiguration}>
            Guardar configuración
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 