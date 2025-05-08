"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

interface ModalDetallesExposicionProps {
  _idExposicion: number;
}

const exposicion = {
  nombre_estudiante: "Alex Pan Li",
  codigo: "20180115",
  correo: "alex.pan@pucp.edu.pe",
  curso: "Proyecto de Fin de Carrera 2",
  tema: "Aplicación de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampas pegantes",
  asesor: "Cesar Beltrán",
  miembros: ["Fernando Contreras", "Eder Quispe"],
  fecha: "15/04/2025",
  horaInicio: "15:00",
  horaFin: "15:20",
  sala: "V202",
};

const ModalDetallesExposicion: React.FC<ModalDetallesExposicionProps> = ({
  _idExposicion,
}) => {
  console.log(_idExposicion);
  return (
    <div className="pt-4">
      <div className="grid grid-cols-2 gap-4 pb-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Nombre del tesista
          </label>
          <Input
            value={exposicion.nombre_estudiante}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Código del tesista
          </label>
          <Input value={exposicion.codigo} disabled className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Correo electrónico del tesista
          </label>
          <Input value={exposicion.correo} disabled className="bg-gray-50" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Curso</label>
          <Input value={exposicion.curso} disabled className="bg-gray-50" />
        </div>
      </div>

      <div className="gap-4 pb-4">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Nombre del tema
          </label>
          <Textarea
            value={exposicion.tema}
            disabled
            className="bg-gray-50 resize-none"
          />
        </div>
      </div>

      <div className="gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-full">
              <User className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <div className="text-sm font-medium  text-gray-800">Asesor</div>
              <div className="text-sm">{exposicion.asesor}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-4">
        {exposicion.miembros.map((miembro, index) => (
          <div key={index} className="gap-4 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1 rounded-full">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    Miembro {index + 1}
                  </div>
                  <div className="text-sm">{miembro}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 pb-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Fecha</label>
          <Input value={exposicion.fecha} disabled className="bg-gray-50" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Hora de Inicio
          </label>
          <Input
            value={exposicion.horaInicio}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Hora de Fin
          </label>
          <Input value={exposicion.horaFin} disabled className="bg-gray-50" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Sala</label>
          <Input value={exposicion.sala} disabled className="bg-gray-50" />
        </div>
      </div>
    </div>
  );
};

export default ModalDetallesExposicion;
