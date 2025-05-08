"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import ModalDetallesExposicion from "./modal-detalles-exposicion";

interface Miembros {
  id_docente: number;
  nombre: string;
  tipo: string;
}

interface Exposicion {
  id_exposicion: number;
  hora: string;
  fecha: string;
  sala: string;
  estado: string;
  titulo: string;
  miembros: Miembros[];
}

export function ExposicionCard({ exposicion }: { exposicion: Exposicion }) {
  //formatear la fecha para mostrarla con el formato 1 de enero del 2025
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
    return `${dia} de ${mes} del ${año}`;
  };

  //formatear la hora para mostrarla con hrs
  const formatearHora = (hora: string) => {
    return `${hora} hrs`;
  };

  //separamos los miembros del jurado en dos grupos: asesor y jurados
  const getAsesor = () =>
    exposicion.miembros.filter((m) => m.tipo === "asesor");
  const getEstudiantes = () =>
    exposicion.miembros.filter((m) => m.tipo === "estudiante");

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-gray-50 rounded-lg shadow-sm border p-5 flex flex-col md:flex-row gap-10">
            {/*HORA FECHA Y SALA*/}
            <div className="flex flex-col items-center space-y-2 md:min-w-[150px] justify-center">
              <div className="text-4xl font-semibold">
                {formatearHora(exposicion.hora)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-base">
                  {formatearFecha(exposicion.fecha)}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-6 w-6" />
                <span className="text-2xl font-semibold">
                  {exposicion.sala}
                </span>
              </div>
            </div>

            {/*TITULO Y JURADOS*/}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{exposicion.titulo}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {getEstudiantes().map((estudiante) => (
                  <div
                    key={estudiante.id_docente}
                    className="flex items-center gap-2"
                  >
                    <div className="bg-gray-100 p-1 rounded-full">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base font-medium  text-gray-800">
                        Tesista
                      </div>
                      <div className="text-base">{estudiante.nombre}</div>
                    </div>
                  </div>
                ))}

                {getAsesor().map((asesor, index) => (
                  <div
                    key={asesor.id_docente}
                    className="flex items-center gap-2"
                  >
                    <div className="bg-gray-100 p-1 rounded-full">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base font-medium  text-gray-800">
                        {index === 0 ? "Asesor" : "Coasesor"}
                      </div>
                      <div className="text-base">{asesor.nombre}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:items-end justify-between">
              <Badge
                variant="outline"
                className={`
                  ${exposicion.estado === "Pendiente" ? "bg-[#F9D534] text-white border-yellow-200" : ""}
                  ${exposicion.estado === "Completado" ? "bg-[#00BF82] text-white border-green-200" : ""}
                  ${exposicion.estado === "Cancelado" ? "bg-red-100 text-red-800 border-red-200" : ""}
                  capitalize px-2 py-1 text-sm rounded-full
                  `}
              >
                {exposicion.estado}
              </Badge>

              <div className="flex flex-row gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base flex items-center gap-1"
                >
                  <Link href={""}>No Estoy Disponible</Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  className="text-base flex items-center gap-1 bg-[#042354]"
                >
                  <Link href={""}>Confirmar Asistencia</Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Exposicion</DialogTitle>
            <ModalDetallesExposicion _idExposicion={exposicion.id_exposicion} />
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
