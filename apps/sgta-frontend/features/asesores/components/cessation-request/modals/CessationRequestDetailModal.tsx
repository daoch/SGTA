"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  CalendarDays, 
  Clock, 
  User, 
  MessageSquare, 
  AlertTriangle, 
  Briefcase,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Users as UsersIcon, // Renamed to avoid conflict with User icon
  Hash, 
  BookOpen,
  FileText, // For Reason/Response
  Info // For general info/details
} from "lucide-react";
import { useRequestTerminationDetail } from "@/features/asesores/queries/cessation-request";
import { 
  ICessationRequestStatusBackend,
  ICessationRequestDataViewDetailTransformed,
  ICessationRequestStudentDetailBackend, // Assuming this type is available
} from "@/features/asesores/types/cessation-request";
import { format, isValid, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface CessationRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number | null;
}

// Status Badge Configuration (remains the same)
const statusBadgeConfig: Record<
  ICessationRequestStatusBackend,
  { 
    text: string; 
    icon: React.ElementType;
    className: string;
  }
> = {
  pendiente: { text: "Pendiente", icon: Clock, className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  aprobada: { text: "Aprobada", icon: CheckCircle2, className: "bg-green-100 text-green-700 border-green-300" },
  rechazada: { text: "Rechazada", icon: XCircle, className: "bg-red-100 text-red-700 border-red-300" },
  desconocido: { text: "Desconocido", icon: HelpCircle, className: "bg-gray-100 text-gray-700 border-gray-300" },
};

// Helper to get relative time (remains the same)
const getRelativeTime = (date: Date | null | undefined): string | null => {
  if (!date || !isValid(date)) return null;
  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch (e) {
    console.error("Error formatting relative time:", e);
    return "Fecha inválida";
  }
};

// A new, more flexible Detail Item component
const InfoField: React.FC<{
  icon?: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}> = ({ icon: Icon, label, children, className = "", labelClassName="text-xs text-slate-500 font-medium", valueClassName="text-sm text-slate-800" }) => (
  <div className={`flex ${Icon ? "items-start" : "flex-col"} gap-1.5 ${className}`}>
    {Icon && <Icon className="h-4 w-4 mt-0.5 text-slate-400 flex-shrink-0" />}
    <div>
      <p className={labelClassName}>{label}</p>
      <div className={valueClassName}>{children}</div>
    </div>
  </div>
);


const CessationRequestDetailModal: React.FC<CessationRequestDetailModalProps> = ({
  isOpen,
  onClose,
  requestId,
}) => {
  const { data: request, isLoading, isError, error } = useRequestTerminationDetail(requestId);

  if (!isOpen) return null;

  const currentStatusDisplayConfig = 
    (request?.status && statusBadgeConfig[request.status]) 
    ? statusBadgeConfig[request.status] 
    : statusBadgeConfig.desconocido;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 h-full">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
          <p className="mt-4 text-slate-500">Cargando detalles...</p>
        </div>
      );
    }

    if (isError || !request) {
      return (
        <div className="m-6 p-4 border border-red-200 bg-red-50 rounded-md text-red-600 flex items-center gap-3 h-full justify-center">
          <AlertTriangle className="h-6 w-6 flex-shrink-0"/>
          <div>
            <p className="font-semibold">Error al Cargar Detalles</p>
            <p className="text-sm">{error?.message || "No se pudo obtener la información de la solicitud."}</p>
          </div>
        </div>
      );
    }

    // Main content rendering after data is loaded
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 p-6">
        {/* --- LEFT COLUMN (or top on mobile) --- */}
        <div className="md:col-span-2 space-y-5">
          {/* Assessor Info */}
          <section>
            <h3 className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Solicitante</h3>
            {request.assessor ? (
              <div className="flex items-center gap-3 p-3 border bg-slate-50 rounded-md">
                <Avatar className="h-12 w-12">
                  {request.assessor.urlPhoto && <AvatarImage src={request.assessor.urlPhoto} alt={request.assessor.name} className="object-cover" />}
                  <AvatarFallback className="bg-slate-300 text-slate-700 text-lg">
                    {request.assessor.name?.[0]?.toUpperCase()}{request.assessor.lastName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-slate-800">{request.assessor.name} {request.assessor.lastName}</p>
                  <p className="text-xs text-slate-500">{request.assessor.email}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    <Briefcase className="h-3 w-3 mr-1"/>
                    Proyectos: {request.assessor.quantityCurrentProyects}
                  </Badge>
                </div>
              </div>
            ) : <InfoField icon={User} label="Asesor">Información no disponible.</InfoField>}
          </section>

          {/* Reason for Cessation */}
          <section>
            <InfoField icon={FileText} label="Motivo del Asesor para el Cese">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {request.reason || "No especificado."}
              </p>
            </InfoField>
          </section>

          {/* Coordination Response (if applicable) */}
          {request.status !== "pendiente" && request.response && (
            <section>
              <InfoField 
                icon={MessageSquare} 
                label="Respuesta de Coordinación"
                valueClassName={request.status === "rechazada" ? "text-sm text-red-700 whitespace-pre-wrap leading-relaxed" : "text-sm text-slate-700 whitespace-pre-wrap leading-relaxed"}
              >
                {request.response}
              </InfoField>
            </section>
          )}
        </div>

        {/* --- RIGHT COLUMN (or bottom on mobile) --- */}
        <div className="md:col-span-1 space-y-5 md:border-l md:pl-6">
          <section>
            <h3 className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Detalles de Solicitud</h3>
            <div className="space-y-3">
              <InfoField icon={CalendarDays} label="Fecha de Solicitud">
                {request.registerTime && isValid(request.registerTime) ? (
                  <>
                    {format(request.registerTime, "dd MMM yyyy, hh:mm a", { locale: es })}
                    <span className="block text-xs text-slate-500 mt-0.5 capitalize">
                      {getRelativeTime(request.registerTime)}
                    </span>
                  </>
                ) : "N/A"}
              </InfoField>

              {request.responseTime && isValid(request.responseTime) && (
                <InfoField icon={Clock} label="Fecha de Decisión">
                   <>
                    {format(request.responseTime, "dd MMM yyyy, hh:mm a", { locale: es })}
                    <span className="block text-xs text-slate-500 mt-0.5 capitalize">
                      {getRelativeTime(request.responseTime)}
                    </span>
                  </>
                </InfoField>
              )}
            </div>
          </section>
          
          {request.students && request.students.length > 0 && (
            <section>
                <InfoField icon={UsersIcon} label={"Tesista(s) Afectado(s)"}>
                    <Badge variant="outline" className="text-base">{request.students.length}</Badge>
                </InfoField>
            </section>
          )}
        </div>

        {/* --- AFFECTED STUDENTS (Full Width Below Columns) --- */}
        {request.students && request.students.length > 0 && (
          <section className="md:col-span-3 pt-3 mt-3 md:border-t">
            <h3 className="text-base font-semibold text-slate-700 mb-3">
                Información de Tesistas Afectados
            </h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 simple-scrollbar"> {/* Scroll for students if list is long */}
              {request.students.map((student: ICessationRequestStudentDetailBackend) => ( // Assuming this type
                <div key={student.id} className="p-3 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1.5">
                      <Avatar className="h-10 w-10">
                          {/* {student.urlPhoto && <AvatarImage src={student.urlPhoto} alt={`${student.name} ${student.lastName}`} />} */}
                          <AvatarFallback className="bg-slate-200 text-slate-700">
                              {student.name?.[0]?.toUpperCase()}{student.lastName?.[0]?.toUpperCase()}
                          </AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="text-sm font-semibold text-slate-800">{student.name} {student.lastName}</p>
                          <p className="text-xs text-slate-500 -mt-0.5">{student.email || "Email no disponible"}</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs pl-2 border-l-2 border-slate-200 ml-1">
                      <InfoField icon={Hash} label="Código" labelClassName="text-xs text-slate-500" valueClassName="text-xs text-slate-700">
                        {student.code || "N/A"}
                      </InfoField>
                      <InfoField icon={BookOpen} label="Tema de Tesis" labelClassName="text-xs text-slate-500" valueClassName="text-xs text-slate-700">
                        <span className="truncate block w-full" title={student.topic.name}>{student.topic.name || "N/A"}</span>
                      </InfoField>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Set max height for the content and allow internal scrolling */}
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-3xl p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold text-slate-800">
              Solicitud de Cese #{request?.id || requestId}
            </DialogTitle>
            {request && (
              <Badge
                  variant="outline"
                  className={`text-xs px-2.5 py-1 rounded-full ${currentStatusDisplayConfig.className}`}
              >
                  {currentStatusDisplayConfig.icon && <currentStatusDisplayConfig.icon className="h-3.5 w-3.5 mr-1.5" />}
                  {currentStatusDisplayConfig.text}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* ScrollArea will now wrap the main content section, not the entire dialog content */}
        <ScrollArea className="flex-grow" style={{ height: "calc(100% - 65px - 61px)" }}> {/* Adjust height based on header/footer */}
          {renderContent()}
        </ScrollArea>
        
        <DialogFooter className="px-6 py-3 border-t sticky bottom-0 bg-white z-10">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CessationRequestDetailModal;