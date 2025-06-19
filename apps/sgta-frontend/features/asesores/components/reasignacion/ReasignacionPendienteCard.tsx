// src/features/coordinador/components/reasignacion/ReasignacionPendienteCard.tsx
"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IReasignacionPendienteTransformed } from "@/features/asesores/types/reasignacion.types"; // Ajusta ruta
import { format, differenceInDays, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Users, CalendarDays, User, UserCheck, AlertCircle, Clock, UserPlus, UserX } from "lucide-react"; // Nuevos iconos

interface ReasignacionPendienteCardProps {
  reasignacion: IReasignacionPendienteTransformed;
  // Callback para cuando el coordinador quiere proponer un nuevo asesor
  onProponerNuevoAsesor: (solicitudOriginalId: number, temaId: number | null) => void;
  // (Opcional) Callback para ver detalles más profundos de la solicitud de cese original
  // onViewCeseDetails?: (solicitudOriginalId: number) => void;
  // (Opcional) Callback si el coordinador puede cancelar una propuesta hecha a un asesor
  // onCancelProposal?: (solicitudOriginalId: number, asesorPropuestoId: number) => void;
}

const ReasignacionPendienteCard: React.FC<ReasignacionPendienteCardProps> = ({
  reasignacion,
  onProponerNuevoAsesor,
  // onViewCeseDetails,
  // onCancelProposal,
}) => {
  const formattedFechaAprobacionCese = isValid(reasignacion.fechaAprobacionCese)
    ? format(reasignacion.fechaAprobacionCese, "dd/MM/yyyy", { locale: es })
    : "N/A";
  
  const formattedFechaPropuestaNuevoAsesor = reasignacion.fechaPropuestaNuevoAsesor && isValid(reasignacion.fechaPropuestaNuevoAsesor)
    ? format(reasignacion.fechaPropuestaNuevoAsesor, "dd/MM/yyyy", { locale: es })
    : null;

  const getEstadoReasignacionVisual = () => {
    switch (reasignacion.estadoReasignacion) {
      case "PREACEPTADA":
        return <Badge variant="destructive" className="text-xs"><AlertCircle className="h-3 w-3 mr-1" />Necesita Proponer Asesor</Badge>;
      case "PENDIENTE_ACEPTACION_ASESOR":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-xs text-white"><Clock className="h-3 w-3 mr-1" />Propuesta Enviada a: {reasignacion.asesorPropuestoNombres} {reasignacion.asesorPropuestoPrimerApellido}</Badge>;
      case "REASIGNACION_RECHAZADA_POR_ASESOR":
        return <Badge variant="destructive" className="text-xs"><UserX className="h-3 w-3 mr-1" />Propuesta Rechazada por: {reasignacion.asesorPropuestoNombres} {reasignacion.asesorPropuestoPrimerApellido}. Necesita Nueva Propuesta.</Badge>;
      case "REASIGNACION_COMPLETADA": // No debería aparecer en esta lista, pero por si acaso
        return <Badge className="text-xs bg-green-500"><UserCheck className="h-3 w-3 mr-1" />Reasignación Completada</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{reasignacion.estadoReasignacion || "Estado Desconocido"}</Badge>;
    }
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg leading-tight">
                    Tema: <span className="font-semibold text-primary">{reasignacion.temaTitulo || "N/A"}</span>
                </CardTitle>
                <CardDescription className="text-xs pt-1">
                    Solicitud de Cese ID: {reasignacion.solicitudOriginalId} (Aprobada el: {formattedFechaAprobacionCese})
                </CardDescription>
            </div>
            <div className="ml-2 whitespace-nowrap">{getEstadoReasignacionVisual()}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
                <h4 className="font-medium text-xs text-muted-foreground mb-0.5 flex items-center">
                    <User className="h-3 w-3 mr-1.5" /> Asesor Original (Cesó):
                </h4>
                <p className="text-xs text-foreground pl-1">
                    {reasignacion.asesorOriginalNombres || "N/A"} {reasignacion.asesorOriginalPrimerApellido || ""}
                    {reasignacion.asesorOriginalCorreo && <span className="block text-muted-foreground">({reasignacion.asesorOriginalCorreo})</span>}
                </p>
            </div>
            <div>
                <h4 className="font-medium text-xs text-muted-foreground mb-0.5 flex items-center">
                    <Users className="h-3 w-3 mr-1.5" /> Tesista(s) Afectado(s):
                </h4>
                {reasignacion.estudiantes && reasignacion.estudiantes.length > 0 ? (
                    <ul className="list-none pl-1 text-xs text-foreground">
                    {reasignacion.estudiantes.map((est) => (
                        <li key={est.id}>
                        {est.nombres} {est.primerApellido}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-xs text-muted-foreground pl-1">No hay información de tesistas.</p>
                )}
            </div>
        </div>
        
        {reasignacion.motivoCeseOriginal && (
             <div>
                <h4 className="font-medium text-xs text-muted-foreground mb-0.5">Motivo del Cese Original:</h4>
                <p className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-md border line-clamp-2" title={reasignacion.motivoCeseOriginal}>
                    {reasignacion.motivoCeseOriginal}
                </p>
            </div>
        )}

        {reasignacion.estadoReasignacion === "PENDIENTE_ACEPTACION_ASESOR" && reasignacion.asesorPropuestoNombres && (
             <div>
                <h4 className="font-medium text-xs text-muted-foreground mb-0.5">Propuesta Actual:</h4>
                <p className="text-xs text-foreground">
                    Enviada a: <span className="font-semibold">{reasignacion.asesorPropuestoNombres} {reasignacion.asesorPropuestoPrimerApellido}</span>
                    {formattedFechaPropuestaNuevoAsesor && ` el ${formattedFechaPropuestaNuevoAsesor}`}
                </p>
            </div>
        )}

      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t mt-auto">
        {/* {onViewDetails && (
          <Button variant="outline" size="sm" onClick={() => onViewDetails(reasignacion.solicitudOriginalId)} className="w-full sm:w-auto">
            Ver Detalles del Cese
          </Button>
        )} */}

        {(reasignacion.estadoReasignacion === "PREACEPTADA" ||
          reasignacion.estadoReasignacion === "REASIGNACION_RECHAZADA_POR_ASESOR") && (
          <Button
            size="sm"
            onClick={() => onProponerNuevoAsesor(reasignacion.solicitudOriginalId, reasignacion.temaId)}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Proponer Nuevo Asesor
          </Button>
        )}

        {/* {reasignacion.estadoReasignacion === "PENDIENTE_ACEPTACION_ASESOR" && onCancelProposal && reasignacion.asesorPropuestoId && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-destructive hover:bg-destructive/10 w-full sm:w-auto"
            onClick={() => onCancelProposal(reasignacion.solicitudOriginalId, reasignacion.asesorPropuestoId!)}
          >
            Cancelar Propuesta Actual
          </Button>
        )} */}
      </CardFooter>
    </Card>
  );
};

export default ReasignacionPendienteCard;