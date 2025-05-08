"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CursoSelect } from "@/features/jurado/components/curso-select";
import { EstadoSelect } from "@/features/jurado/components/estado-select";
import { PeriodoSelect } from "@/features/jurado/components/periodo-select";

import React, { useEffect, useState } from "react";
import ModalPlanificadorCoordinador from "../components/modal-planificador-coordinador";

const ExposicionesCoordinadorPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = () => setModalOpen(true);
  const cerrarModal = () => setModalOpen(false);

  const [curso, setCurso] = useState("");
  const [periodo, setPeriodo] = useState("2025-1");
  const [estado, setEstado] = useState("Pendiente");

  const [ciclos, setCiclos] = useState([]);
  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/ciclos/listarCiclosOrdenados",
        );
        if (!response.ok) {
          throw new Error("Error al obtener ciclos");
        }
        const data = await response.json();
        setCiclos(data);
      } catch (error) {
        console.error("Error al obtener ciclos:", error);
      }
    };

    fetchCiclos();
  }, []);

  return (
    <div className="flex flex-col p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Exposiciones
      </h1>

      <div className="flex items-end flex-wrap gap-4 mb-6">
        {/* Contenedor de los tres combo boxes y el botón "Exportar" */}
        <div className="flex gap-4 flex-1 items-end">
          <div className="flex flex-col">
            <CursoSelect curso={curso} setCurso={setCurso} />
          </div>
          <div className="flex flex-col">
            <PeriodoSelect
              periodo={periodo}
              ciclos={ciclos}
              setPeriodo={setPeriodo}
            />
          </div>
          <div className="flex flex-col">
            <EstadoSelect estado={estado} setEstado={setEstado} />
          </div>

          {/* Botón Exportar Lista */}
          <Button
            onClick={() => console.log("Exportar lista")}
            variant="secondary"
            className="text-indigo-700 bg-indigo-200 hover:bg-indigo-300 py-2 px-6"
          >
            Exportar Lista
          </Button>
        </div>

        {/* Botón Planificador de Exposiciones alineado a la derecha */}
        <div className="ml-auto flex items-end">
          <Button
            onClick={abrirModal}
            variant="default"
            className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
          >
            Planificador de Exposiciones
          </Button>
        </div>
      </div>
      <ModalPlanificadorCoordinador open={modalOpen} onClose={cerrarModal} />
    </div>
  );
};

export default ExposicionesCoordinadorPage;

