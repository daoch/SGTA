"use client";

import { Button } from "@/components/ui/button";
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
  const [periodo, setPeriodo] = useState("");
  const [estado, setEstado] = useState("Programada");

  const [ciclos, setCiclos] = useState([]);
  const [cursos, setCursos] = useState([]);
  useEffect(() => {
    const fetchCiclos = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ciclos/listarCiclos`,
        );
        if (!response.ok) {
          throw new Error("Error al obtener ciclos");
        }
        const data = await response.json();
        setCiclos(data);
        if (data.length > 0 && !periodo) {
          setPeriodo(String(data[0].id));
        }
      } catch (error) {
        console.error("Error al obtener ciclos:", error);
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/etapas-formativas/listarActivas`,
        );
        if (!response.ok) {
          throw new Error("Error al obtener cursos");
        }
        const data = await response.json();
        setCursos(data);
        if (data.length > 0 && !curso) {
          setCurso(String(data[0].id));
        }
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      }
    };

    fetchCiclos();
    fetchCursos();
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
            <CursoSelect curso={curso} setCurso={setCurso} cursos={cursos} />
          </div>
          <div className="flex flex-col">
            <PeriodoSelect
              periodo={periodo}
              setPeriodo={setPeriodo}
              ciclos={ciclos}
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

