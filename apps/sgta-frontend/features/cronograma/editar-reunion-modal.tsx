"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axios/axios-instance";
import { VariantProps, cva } from "class-variance-authority";
import { AxiosResponse } from "axios";

export interface ReunionFormData {
  titulo: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  descripcion: string;
  disponible: number;
  url: string;
  estadoAsistencia: string;
  estadoDetalle: string;
}
interface Asesor {
  id: string;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
}
interface EditarReunionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reunion: ReunionFormData) => Promise<void>;
    evento?: CalendarEvent; // ← esta línea nueva
    listaEventos: CalendarEvent [];
    emisor: string;
    onUpdateSuccess?: () => void;
  }

  const monthEventVariants = cva("size-2 rounded-full", {
    variants: {
      variant: {
        default: "bg-primary",
        blue: "bg-blue-500",
        green: "bg-green-500",
        pink: "bg-pink-500",
        purple: "bg-purple-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

    type CalendarEvent = {
    id: string;
    start?: Date;
    end: Date;
    title: string;
    type?: string;
    description?: string;  // <-- Añade esto
    tesista?: string;
    color?: VariantProps<typeof monthEventVariants>["variant"];
    url?: string;
    };

const obtenerIdReal = (id: string, emisor: string): number => {
        if (emisor === "Alumno") {
          // Formato: "reunion-2" => devuelve 2
          return parseInt(id.split("-")[1], 10);
        } else if (emisor === "Asesor") {
          // Formato: "2-66" => devuelve 2
          return parseInt(id.split("-")[0], 10);
        } else {
          throw new Error(`Emisor desconocido: ${emisor}`);
        }
      };

export const EditarReunionModal: React.FC<EditarReunionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  evento,
  listaEventos,
  emisor,
  onUpdateSuccess, // ✅ Añádelo aquí
}) => {
  const [formData, setFormData] = useState<ReunionFormData>({
    titulo: "",
    fechaHoraInicio: "",
    fechaHoraFin: "",
    descripcion: "",
    disponible: 1,
    url: "",
    estadoAsistencia: "",
    estadoDetalle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ReunionFormData>>({});

  const toOffsetDateTime = (localDateTime: string) => {
    const date = new Date(localDateTime);
    return date.toISOString();
  };

  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [asesorId, setAsesorId] = useState<string>("");

  useEffect(() => {
    if (evento && isOpen) {
      setFormData({
        titulo: evento.title || "",
        //fechaHoraInicio: evento.start?.toISOString().slice(0, 16) || "",
        fechaHoraInicio: evento.start
  ? formatLocalDateTime(new Date(evento.start.getTime() - 5 * 60 * 60))
  : "",
        //fechaHoraFin: evento.end?.toISOString().slice(0, 16) || "",
        fechaHoraFin: evento.end
  ? formatLocalDateTime(new Date(evento.end.getTime() - 5 * 60 * 60))
  : "",
        descripcion: evento.description || "",
        disponible: 1,
        url: evento.url || "",
        estadoAsistencia: "",
        estadoDetalle: "",
      });
    }
  }, [evento, isOpen]);

  useEffect(() => {
    const fetchDatosAsistencia = async () => {
      if (!evento || !isOpen) return;

      console.log("Id falso de la reunion: " + evento.id);
  
      //const reunionId = obtenerIdReal(evento.id);

      const reunionId = obtenerIdReal(evento.id, emisor);

      let tesistaId: number | null = null;

      if (emisor === "Asesor") {
        tesistaId = parseInt(evento.id.split("-")[1], 10);
      }


      console.log("Id de la reunion: " + reunionId);

      console.log("Id del tesista: " + tesistaId);
  
      try {
        // Obtener el id de la relación usuario-reunión
        /*
        let responseUsuarioReunion: any;

        if (emisor === "Alumno") {
          responseUsuarioReunion = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/alumno", {
            params: { reunionId },
          });
        } else if (emisor === "Asesor") {
          responseUsuarioReunion = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/asesor", {
            params: { reunionId, usuarioId: tesistaId },
          });
        } else {
          throw new Error("Tipo de emisor no reconocido");
        }
          */

        interface UsuarioReunionResponse {
          id: number;
        }

        let responseUsuarioReunion: AxiosResponse<UsuarioReunionResponse>;

        if (emisor === "Alumno") {
          responseUsuarioReunion = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/alumno", {
            params: { reunionId },
          });
        } else if (emisor === "Asesor") {
          responseUsuarioReunion = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/asesor", {
            params: { reunionId, usuarioId: tesistaId },
          });
        } else {
          throw new Error("Tipo de emisor no reconocido");
        }
  
        const usuarioReunionId = responseUsuarioReunion.data.id;
  
        // Obtener los datos de asistencia de esa relación
        const responseAsistencia = await axiosInstance.get("/api/reuniones/getUsuarioXReunion", {
          params: { usuarioReunionId },
        });
  
        const { estadoAsistencia, estadoDetalle } = responseAsistencia.data;
  
        setFormData(prev => ({
          ...prev,
          estadoAsistencia: estadoAsistencia || "Pendiente",
          estadoDetalle: estadoDetalle || "",
        }));
      } catch (error) {
        console.error("Error al obtener datos de asistencia:", error);
      }
    };
  
    fetchDatosAsistencia();
  }, [evento, isOpen]);
  

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        titulo: "",
        fechaHoraInicio: "",
        fechaHoraFin: "",
        descripcion: "",
        disponible: 1,
        url: "",
        estadoAsistencia: "",
        estadoDetalle: "",
      });
      setErrors({});
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const fetchAsesores = async () => {
      try {
        const response = await axiosInstance.get("/api/reuniones/getasesorxalumno");
        setAsesores(response.data);
        if (response.data.length > 0) setAsesorId(response.data[0].id);
      } catch (error) {
        console.error("Error al obtener asesores:", error);
      }
    };
    fetchAsesores();
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ReunionFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /*
  const validateForm = (): boolean => {
    const newErrors: Partial<ReunionFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }
    if (!formData.fechaHoraInicio) {
      newErrors.fechaHoraInicio = "La fecha y hora de inicio es requerida";
    }
    if (!formData.fechaHoraFin) {
      newErrors.fechaHoraFin = "La fecha y hora de fin es requerida";
    }
    if (formData.fechaHoraInicio && formData.fechaHoraFin) {
      const inicio = new Date(formData.fechaHoraInicio);
      const fin = new Date(formData.fechaHoraFin);
      if (fin <= inicio) {
        newErrors.fechaHoraFin = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }
    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "La URL no tiene un formato válido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  */


  const validateForm = (): boolean => {
    const newErrors: Partial<ReunionFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }
    if (!formData.fechaHoraInicio) {
      newErrors.fechaHoraInicio = "La fecha y hora de inicio es requerida";
    }
    if (!formData.fechaHoraFin) {
      newErrors.fechaHoraFin = "La fecha y hora de fin es requerida";
    }

    const inicio = new Date(formData.fechaHoraInicio);
    const fin = new Date(formData.fechaHoraFin);

    if (formData.fechaHoraInicio && formData.fechaHoraFin && fin <= inicio) {
      newErrors.fechaHoraFin = "La fecha de fin debe ser posterior a la fecha de inicio";
    }

    // Validar solapamiento (solo si emisor es Asesor)
    if (emisor === "Asesor" && formData.fechaHoraInicio && formData.fechaHoraFin) {
      const idReunionActual = obtenerIdReal(evento?.id || "", emisor);

      for (const ev of listaEventos) {
        if (ev.type !== "REUNION" && ev.type !== "EXPOSICION") continue;

        const idEv = obtenerIdReal(ev.id, emisor);
        if (idEv === idReunionActual) continue;

        const evStart = ev.start ? new Date(ev.start) : null;
        const evEnd = new Date(ev.end);
        if (!evStart || !evEnd) continue;

        const seSolapaInicio = inicio >= evStart && inicio < evEnd;
        const seSolapaFin = fin > evStart && fin <= evEnd;
        const abarcaTotalmente = inicio <= evStart && fin >= evEnd;

        if (seSolapaInicio || seSolapaFin || abarcaTotalmente) {
          if (seSolapaInicio || abarcaTotalmente) {
            newErrors.fechaHoraInicio = "La hora de inicio se superpone con otra reunión o exposición";
          }
          if (seSolapaFin || abarcaTotalmente) {
            newErrors.fechaHoraFin = "La hora de fin se superpone con otra reunión o exposición";
          }
          break;
        }
      }
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "La URL no tiene un formato válido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  //const obtenerIdReal = (id: string) => parseInt(id.split("-")[1], 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    try {
      if (!evento) {
        console.error("No se ha proporcionado un evento para editar");
        return;
      }
  
      const reunionId = obtenerIdReal(evento.id,emisor); // solo extrae el número, ej: "reunion-45" → 45

      let tesistaId: number | null = null;

      if (emisor === "Asesor") {
        tesistaId = parseInt(evento.id.split("-")[1], 10);
      }

  
      // Obtener el id de la relación usuario-reunión
      /*
        let response: any;

        if (emisor === "Alumno") {
          response = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/alumno", {
            params: { reunionId },
          });
        } else if (emisor === "Asesor") {
          response = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/asesor", {
            params: { reunionId, usuarioId: tesistaId },
          });
        } else {
          throw new Error("Tipo de emisor no reconocido");
        }
      */

        interface UsuarioReunionResponse {
          id: number;
        }

        let response: AxiosResponse<UsuarioReunionResponse>;

        if (emisor === "Alumno") {
          response = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/alumno", {
            params: { reunionId },
          });
        } else if (emisor === "Asesor") {
          response = await axiosInstance.get("/api/reuniones/buscarUsuarioReunion/asesor", {
            params: { reunionId, usuarioId: tesistaId },
          });
        } else {
          throw new Error("Tipo de emisor no reconocido");
        }
  
      const usuarioReunionId = response.data.id; // id de la tabla usuario_reunion
  
      // Llamar a la actualización
      /*
      await axiosInstance.put(
        "/api/reuniones/updateEstadoAsistencia",
        {
          estadoAsistencia: formData.estadoAsistencia,
          estadoDetalle: formData.estadoDetalle,
        },
        {
          params: {
            usuarioReunionId,
          },
        }
      );
      */

      if (emisor === "Alumno") {
        // Solo se actualiza la asistencia
        await axiosInstance.put(
          "/api/reuniones/updateEstadoAsistencia",
          {
            estadoAsistencia: formData.estadoAsistencia,
            estadoDetalle: formData.estadoDetalle,
          },
          {
            params: {
              usuarioReunionId,
            },
          }
        );
      } else if (emisor === "Asesor") {
        // Actualización completa de la reunión
        const reunionData = {
          titulo: formData.titulo,
          fechaHoraInicio: new Date(formData.fechaHoraInicio).toISOString(),
          fechaHoraFin: new Date(formData.fechaHoraFin).toISOString(),
          descripcion: formData.descripcion,
          url: formData.url,
        };

        await axiosInstance.put("/api/reuniones/update", reunionData, {
          params: {
            id: reunionId,
          },
        });
      } else {
        console.error("Emisor no reconocido");
      }

      onUpdateSuccess?.();
  
      handleOpenChange(false); // cerrar modal
      
    } catch (error) {
      console.error("Error al actualizar asistencia:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  

  /*
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() - 5);
    return now.toISOString().slice(0, 16);
  };
  */
 

  const formatLocalDateTime = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  const getCurrentDateTime = () => {
    const now = new Date();
    //now.setHours(now.getHours() - 5);
    return now.toISOString().slice(0, 16);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la reunión</DialogTitle>
          <DialogDescription>
            Se muestran los detalles de la reunión. Puede marcar su asistencia y brindar detalles adicionales.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Campos originales (deshabilitados) */}
            <div className="grid gap-2">
              <Label htmlFor="titulo">Título <span className="text-red-500">*</span></Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ej: Reunión de seguimiento del proyecto"
                value={formData.titulo}
                onChange={handleInputChange}
                className={errors.titulo ? "border-red-500" : ""}
                disabled={emisor === "Alumno"}
              />
              {errors.titulo && <p className="text-sm text-red-500">{errors.titulo}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fechaHoraInicio">Fecha y hora de inicio <span className="text-red-500">*</span></Label>
              <Input
                id="fechaHoraInicio"
                name="fechaHoraInicio"
                type="datetime-local"
                value={formData.fechaHoraInicio}
                onChange={handleInputChange}
                min={getCurrentDateTime()}
                className={errors.fechaHoraInicio ? "border-red-500" : ""}
                disabled={emisor === "Alumno"}
              />
              {errors.fechaHoraInicio && <p className="text-sm text-red-500">{errors.fechaHoraInicio}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fechaHoraFin">Fecha y hora de fin <span className="text-red-500">*</span></Label>
              <Input
                id="fechaHoraFin"
                name="fechaHoraFin"
                type="datetime-local"
                value={formData.fechaHoraFin}
                onChange={handleInputChange}
                min={formData.fechaHoraInicio || getCurrentDateTime()}
                className={errors.fechaHoraFin ? "border-red-500" : ""}
                disabled={emisor === "Alumno"}
              />
              {errors.fechaHoraFin && <p className="text-sm text-red-500">{errors.fechaHoraFin}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe el propósito y agenda de la reunión..."
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`min-h-[100px] ${errors.descripcion ? "border-red-500" : ""}`}
                disabled={emisor === "Alumno"}
              />
              {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL de la reunión</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={formData.url}
                onChange={handleInputChange}
                className={errors.url ? "border-red-500" : ""}
                disabled={emisor === "Alumno"}
              />
              {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
              <p className="text-xs text-muted-foreground">
                Opcional: Enlace para reunión virtual (Google Meet, Zoom, etc.)
              </p>
            </div>

            {/* Nuevos campos (habilitados) */}
            <div className="grid gap-2">
              <Label>Asistencia <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estadoAsistencia"
                    value="Asistió"
                    checked={formData.estadoAsistencia === "Asistió"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    disabled={emisor === "Asesor"}
                  />
                  <span>Asistió</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estadoAsistencia"
                    value="No asistió"
                    checked={formData.estadoAsistencia === "No asistió"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    disabled={emisor === "Asesor"}
                  />
                  <span>No asistió</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estadoAsistencia"
                    value="Pendiente"
                    checked={formData.estadoAsistencia === "Pendiente"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    disabled={emisor === "Asesor"}
                  />
                  <span>Pendiente</span>
                </label>
              </div>
              {errors.estadoAsistencia && <p className="text-sm text-red-500">{errors.estadoAsistencia}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estadoDetalle">Detalles de la asistencia</Label>
              <Textarea
                id="estadoDetalle"
                name="estadoDetalle"
                placeholder="Observaciones sobre la asistencia..."
                value={formData.estadoDetalle}
                onChange={handleInputChange}
                className={`min-h-[100px] ${errors.estadoDetalle ? "border-red-500" : ""}`}
                disabled={emisor === "Asesor"}
              />
              {errors.estadoDetalle && <p className="text-sm text-red-500">{errors.estadoDetalle}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#042354] hover:bg-[#042354]/90"
            >
              {isSubmitting ? "Actualizando..." : emisor === "Asesor"? "Actualizar Reunión": "Actualizar asistencia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

    
