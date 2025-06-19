// src/features/asesores/components/asesor-invitations/InvitacionAsesoriaCard.tsx
"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IInvitacionAsesoriaTransformed } from "@/features/asesores/types/asesor-invitations.types"; // Ajusta ruta
import { format, differenceInDays, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { Users, CalendarDays, MessageSquareText, UserMinus, Info } from "lucide-react";

interface InvitacionAsesoriaCardProps {
  invitacion: IInvitacionAsesoriaTransformed;
  onAccept: (solicitudOriginalId: number) => void;
  onReject: (solicitudOriginalId: number) => void;
  // onViewDetails?: (solicitudOriginalId: number) => void; // Opcional si quieres un modal de detalle primero
}

const InvitacionAsesoriaCard: React.FC<InvitacionAsesoriaCardProps> = ({
  invitacion,
  onAccept,
  onReject,
  // onViewDetails,
}) => {
  const formattedFechaPropuesta = isValid(invitacion.fechaPropuesta)
    ? format(invitacion.fechaPropuesta, "dd/MM/yyyy", { locale: es })
    : "Fecha inválida";
  const daysAgo = isValid(invitacion.fechaPropuesta)
    ? differenceInDays(new Date(), invitacion.fechaPropuesta)
    : null;

  return (
    <Card className="w-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg leading-tight">
          Propuesta para Asesorar: <span className="font-semibold text-primary">{invitacion.temaTitulo}</span>
        </CardTitle>
        <CardDescription className="text-xs pt-1">
          Recibida el {formattedFechaPropuesta}
          {daysAgo !== null && ` (hace ${daysAgo} día${daysAgo === 1 ? "" : "s"})`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 text-sm flex-grow">
        <div>
          <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center">
            <Info className="h-3 w-3 mr-1.5" />
            Motivo del Cese del Asesor Original:
          </h4>
          <p className="text-muted-foreground bg-slate-50 p-2 rounded-md text-xs border">
            {invitacion.motivoCeseOriginal || "No especificado."}
          </p>
        </div>
        
        {invitacion.temaResumen && (
             <div>
                <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center">
                    <MessageSquareText className="h-3 w-3 mr-1.5" />
                    Resumen del Tema:
                </h4>
                <p className="text-muted-foreground text-xs line-clamp-3">{invitacion.temaResumen}</p>
            </div>
        )}


        <div>
          <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center">
            <Users className="h-3 w-3 mr-1.5" />
            Tesista(s) Involucrado(s):
          </h4>
          {invitacion.estudiantes && invitacion.estudiantes.length > 0 ? (
            <ul className="list-disc list-inside pl-4 text-muted-foreground">
              {invitacion.estudiantes.map((est) => (
                <li key={est.id} className="text-xs">
                  {est.nombres} {est.primerApellido} {est.segundoApellido || ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground pl-4">No hay información de tesistas.</p>
          )}
        </div>

        <div>
          <h4 className="font-medium text-xs text-muted-foreground mb-1 flex items-center">
            <UserMinus className="h-3 w-3 mr-1.5" />
            Asesor Original (que cesó):
          </h4>
          <p className="text-xs text-muted-foreground pl-4">
            {invitacion.asesorOriginalNombres} {invitacion.asesorOriginalApellidos || ""}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t mt-auto">
        {/* {onViewDetails && ( // Si tienes un modal de detalle primero
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(invitacion.solicitudOriginalId)}
            className="w-full sm:w-auto"
          >
            Ver Detalles
          </Button>
        )} */}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onReject(invitacion.solicitudOriginalId)}
          className="w-full sm:w-auto"
        >
          Rechazar Invitación
        </Button>
        <Button
          variant="default" // o primary
          size="sm"
          onClick={() => onAccept(invitacion.solicitudOriginalId)}
          className="w-full sm:w-auto"
        >
          Aceptar Invitación
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvitacionAsesoriaCard;