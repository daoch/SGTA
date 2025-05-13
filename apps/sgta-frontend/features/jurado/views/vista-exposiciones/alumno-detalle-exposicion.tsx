"use client";
import type React from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MiembroJurado {
  id_docente: number;
  nombre: string;
  tipo: string;
  departamento?: string;
  evalua?: boolean;
}

interface Exposicion {
  id_exposicion: number;
  hora: string;
  fecha: string;
  sala: string;
  estado: string;
  titulo: string;
  curso?: string;
  miembros_jurado: MiembroJurado[];
  enlace_sesion?: string;
  enlace_grabacion?: string;
}

interface DetalleExposicionProps {
  id: string;
}

const exposicion: Exposicion = {
  id_exposicion: 1,
  hora: "16:00",
  fecha: "2025-04-15",
  sala: "V201",
  estado: "Pendiente",
  titulo:
    "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots basado en Machine Learning",
  curso: "Proyecto de Fin de Carrera 2",
  miembros_jurado: [
    {
      id_docente: 1,
      nombre: "Juan Perez",
      tipo: "miembro",
      departamento: "Ingeniería Informática",
      evalua: false,
    },
    {
      id_docente: 2,
      nombre: "Maria Lopez",
      tipo: "miembro",
      departamento: "Ingeniería Informática",
      evalua: true,
    },
    {
      id_docente: 3,
      nombre: "Luis Muroya",
      tipo: "miembro",
      departamento: "Ingeniería Informática",
      evalua: true,
    },
  ],
  enlace_sesion: "https://zoom.edu/fallway/h2j3asfdsa5usamoyedo32",
};

const DetalleExposicion: React.FC<DetalleExposicionProps> = ({ id }) => {
  // Formatear la fecha para mostrarla en español
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate();
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `${dia} de ${mes} de ${año}`;
  };

  return (
    <div className="pt-4">
      <div className="rounded-2xl shadow-sm border p-6 mb-4">
        {/*HEADER*/}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/*NOMBRE DEL TEMA*/}
          <div>
            <label className="text-base text-gray-500">Nombre del tema</label>
            <p className="text-lg font-medium">{exposicion.titulo}</p>
          </div>
          {/*CURSO*/}
          <div>
            <label className="text-base text-gray-500">Curso</label>
            <p className="text-lg font-medium">{exposicion.curso}</p>
          </div>
        </div>

        {/*DETALLES DE LA EXPOSICION*/}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Detalles de la Exposición
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <div className="text-base text-gray-500">Fecha</div>
                <div className="font-medium">
                  {formatearFecha(exposicion.fecha)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <div className="text-base text-gray-500">Hora</div>
                <div className="font-medium">{exposicion.hora}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <MapPin className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <div className="text-base text-gray-500">
                  Sala de Exposición
                </div>
                <div className="font-medium">{exposicion.sala}</div>
              </div>
            </div>
          </div>
        </div>

        {/*ENLACES*/}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-base text-gray-500 block mb-2">
              Enlace de la Sesión
            </label>
            <a
              href={exposicion.enlace_sesion}
              target="_blank"
              className={
                exposicion.enlace_sesion ? " text-blue-500" : " text-gray-500"
              }
            >
              {exposicion.enlace_sesion || "No disponible"}
            </a>
          </div>
          <div>
            <label className="text-base text-gray-500 block mb-2">
              Enlace de la Grabación
            </label>
            <a
              href={exposicion.enlace_grabacion}
              target="_blank"
              className={
                exposicion.enlace_grabacion
                  ? " text-blue-500"
                  : " text-gray-500"
              }
            >
              {exposicion.enlace_grabacion || "No disponible"}
            </a>
          </div>
        </div>
      </div>
      {/*JURADO*/}
      <div>
        <h2 className="text-lg font-semibold mb-4">Miembros de Jurados</h2>
        <div className="grid grid-cols-3 gap-4">
          {exposicion.miembros_jurado.map((miembro) => (
            <div
              key={miembro.id_docente}
              className="border rounded-2xl p-4 flex flex-col items-center text-center shadow-sm"
            >
              <div className="bg-gray-100 p-4 rounded-full mb-3">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="font-medium text-base">{miembro.nombre}</h3>
              <p className="text-gray-500 text-sm mb-4">
                {miembro.departamento}
              </p>
              <Button
                asChild
                variant={miembro.evalua ? "outline" : "secondary"}
                size="default"
                className="w-full"
              >
                <Link
                  href={`/alumno/mi-proyecto/exposiciones/${exposicion.id_exposicion}/observaciones/${miembro.id_docente}`}
                >
                  {miembro.evalua ? "Ver Comentarios" : "No evalúa"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetalleExposicion;
