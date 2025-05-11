"use client";

import { Button } from "@/components/ui/button";
import { CursoSelect } from "@/features/jurado/components/curso-select";
import { EstadoSelect } from "@/features/jurado/components/estado-select";
import { PeriodoSelect } from "@/features/jurado/components/periodo-select";
import React, { useEffect, useState } from "react";
import ModalPlanificadorCoordinador from "../components/modal-planificador-coordinador";
import {
  getCiclos,
  getCursos,
  getExposicionesInicializadasByCoordinador,
} from "../services/exposicion-service";
import { ListExposicionXCoordinadorDTO } from "../dtos/ListExposicionXCoordiandorDTO";
import { useRouter } from "next/navigation";

const ExposicionesCoordinadorPage: React.FC = () => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [curso, setCurso] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<string | null>(null);
  const [estado, setEstado] = useState("Programada");
  const [ciclos, setCiclos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exposiciones, setExposiciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ciclosData, cursosData, exposicionesData] = await Promise.all([
          getCiclos(),
          getCursos(),
          getExposicionesInicializadasByCoordinador(3),
        ]);
        setCiclos(ciclosData);
        setCursos(cursosData);
        setExposiciones(exposicionesData);
        if (ciclosData.length > 0) setPeriodo(String(ciclosData[0].id));
        if (cursosData.length > 0) setCurso(String(cursosData[0].id));
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          "Hubo un problema al cargar los datos. Por favor, intenta nuevamente.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-2 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Exposiciones
      </h1>

      <div className="flex items-end flex-wrap gap-4 mb-6">
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

          <Button
            onClick={() => console.log("Exportar lista")}
            variant="secondary"
            className="text-indigo-700 bg-indigo-200 hover:bg-indigo-300 py-2 px-6"
          >
            Exportar Lista
          </Button>
        </div>

        <div className="ml-auto flex items-end">
          <Button
            onClick={() => setModalOpen(true)}
            variant="default"
            className="text-white bg-blue-900 hover:bg-blue-800 py-2 px-6"
          >
            Planificador de Exposiciones
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {exposiciones.length !== 0 &&
          exposiciones.map((expo: ListExposicionXCoordinadorDTO) => (
            <div
              key={expo.exposicionId}
              className="border rounded-lg p-4 shadow hover:cursor-pointer hover:shadow-lg transition duration-200"
              onClick={() => {
                router.push(
                  `/coordinador/exposiciones/planificacion/${expo.exposicionId}`,
                );
              }}
            >
              <h2 className="text-lg font-semibold mb-2">{expo.nombre}</h2>
              {/* <p className="text-sm text-gray-700 mb-1">{expo.descripcion}</p> */}
              <p className="text-sm text-gray-600">
                Curso: {expo.etapaFormativaNombre}
              </p>
              <p className="text-sm text-gray-600">Ciclo: {expo.cicloNombre}</p>
              <p className="text-sm text-gray-600">
                Estado: {expo.estadoPlanificacionNombre}
              </p>
            </div>
          ))}
      </div>

      <ModalPlanificadorCoordinador
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ExposicionesCoordinadorPage;
