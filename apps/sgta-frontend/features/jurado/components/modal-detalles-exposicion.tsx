"use client";

import { Input } from "@/components/ui/input";

interface ModalDetallesExposicionProps {
    id_exposicion: number;
}

const exposicion = {
    nombre_estudiante: "Alex Pan Li",
    codigo: "20180115",
    correo: "alex.pan@pucp.edu.pe",
    curso: "Proyecto de Fin de Carrera 2",
    tema:
      "Aplicación de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampas pegantes",
    asesor: "Cesar Beltrán",
    miembros: ["Fernando Contreras", "Eder Quispe"],
    fecha: "15/04/2025",
    horaInicio: "15:00",
    horaFin: "15:20",
    sala: "V202",
}

const ModalDetallesExposicion: React.FC<ModalDetallesExposicionProps> = ({ id_exposicion }) => {
    return (
      <div className="pt-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-500">
                    Nombre del tesista
                </label>
                <Input value={exposicion.nombre_estudiante} disabled className="bg-gray-50" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">
                    Código del tesista
                </label>
                <Input value={exposicion.codigo} disabled className="bg-gray-50" />
            </div>
        </div>
      </div>
    );
  };
  
export default ModalDetallesExposicion;