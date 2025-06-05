// features/asesores/components/cessation-request/utils/statusStyles.ts
// NUEVO ARCHIVO para centralizar la configuración de estilos de los badges de estado

import { ICessationRequestStatusBackend } from "@/features/asesores/types/cessation-request";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";
import React from "react";

export const statusBadgeConfig: Record<
  ICessationRequestStatusBackend,
  { 
    variant: "default" | "destructive" | "outline" | "secondary"; 
    text: string; 
    icon: React.ElementType;
    className?: string;
  }
> = {
  pendiente: { variant: "outline", text: "Pendiente", icon: Clock, className: "border-yellow-400 text-yellow-700 bg-yellow-50 hover:bg-yellow-100" },
  aprobada: { variant: "outline", text: "Aprobada", icon: CheckCircle2, className: "border-green-400 text-green-700 bg-green-50 hover:bg-green-100" },
  rechazada: { variant: "outline", text: "Rechazada", icon: XCircle, className: "border-red-400 text-red-700 bg-red-50 hover:bg-red-100" },
  desconocido: { variant: "secondary", text: "Desconocido", icon: HelpCircle, className: "border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100" },
};