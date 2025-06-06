"use client";

import React, { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { ExposicionCard } from "@/features/jurado/components/exposicion-card";
import ModalDetallesExposicion from "../../components/modal-detalles-exposicion";
import { Exposicion } from "../../types/exposicion.types";
import { FilterExposicionJurado } from "../../components/filters-exposicion-jurado";
import {
  getEtapasFormativasNombres,
  getCiclos,
  getExposicionesJurado,
} from "../../services/jurado-service";
import {
  EtapaFormativa,
  Ciclo,
} from "@/features/jurado/types/juradoDetalle.types";

import {
  ExposicionJurado,
  MiembroJuradoExpo,
} from "@/features/jurado/types/jurado.types";

import { useAuthStore } from "@/features/auth/store/auth-store";
{/*
const periodos = [
  { value: "2025-1", label: "2025-1" },
  { value: "2024-2", label: "2024-2" },
  { value: "2024-1", label: "2024-1" },
  { value: "2023-2", label: "2023-2" },
];

const cursos = [
  { value: "PFC1", label: "Proyecto de Fin de Carrera 1" },
  { value: "PFC2", label: "Proyecto de Fin de Carrera 2" },
];
*/}
const estados = [
  { value: "todos", label: "Todos" },
  { value: "esperando_respuesta", label: "Esperando Respuesta" },
  { value: "esperando_aprobación", label: "Esperando Aprobación" },
  { value: "programada", label: "Programada" },
  { value: "completada", label: "Completada" },
  { value: "calificada", label: "Calificada" },
];

{
  /*
const exposiciones: Exposicion[] = [
  {
    id_exposicion: 1,
    fechaHora: new Date("2025-10-15T09:00:00"),
    sala: "A501", // Sala diferente
    estado: "esperando_respuesta",
    id_etapa_formativa: 1, // ID de etapa formativa diferente
    titulo:
      "Desarrollo de un Sistema de Recomendación Musical Basado en Redes Neuronales Convolucionales", // Título diferente
    miembros: [
      { id_persona: 1, nombre: "Dr. Carlos Fuentes", tipo: "asesor" }, // Nombre diferente
      { id_persona: 2, nombre: "Ana García", tipo: "estudiante" }, // Nombre diferente
      { id_persona: 3, nombre: "Ing. Laura Mendez", tipo: "jurado" }, // Jurado 1 añadido
      { id_persona: 4, nombre: "MSc. Ricardo Solis", tipo: "jurado" }, // Jurado 2 añadido
    ],
  },
  {
    id_exposicion: 2,
    fechaHora: new Date("2025-05-04T10:00:00"),
    sala: "B210", // Sala diferente
    estado: "esperando_respuesta",
    id_etapa_formativa: 1,
    titulo:
      "Optimización de Rutas de Entrega Urbana Utilizando Algoritmos Genéticos y Datos de Tráfico en Tiempo Real", // Título diferente
    miembros: [
      { id_persona: 5, nombre: "Dra. Maria Crisostomo", tipo: "asesor" }, // Nombre diferente, id_persona único
      { id_persona: 6, nombre: "Pedro Martínez", tipo: "estudiante" }, // Nombre diferente, id_persona único
      { id_persona: 7, nombre: "Dr. Alberto Diaz", tipo: "jurado" }, // Jurado 1 añadido, id_persona único
      { id_persona: 8, nombre: "Lic. Sofia Castillo", tipo: "jurado" }, // Jurado 2 añadido, id_persona único
    ],
  },
  {
    id_exposicion: 3,
    fechaHora: new Date("2025-05-04T11:00:00"),
    sala: "A101", // Sala diferente
    estado: "programada",
    id_etapa_formativa: 2,
    titulo:
      "Análisis Comparativo de Técnicas de Procesamiento de Lenguaje Natural para la Detección de Sentimientos en Redes Sociales", // Título diferente
    miembros: [
      { id_persona: 9, nombre: "Mtro. Jorge Vidal", tipo: "asesor" }, // Nombre diferente, id_persona único
      { id_persona: 10, nombre: "Lucía Fernández", tipo: "estudiante" }, // Nombre diferente, id_persona único
      { id_persona: 11, nombre: "Dra. Isabel Navarro", tipo: "jurado" }, // Jurado 1 añadido, id_persona único
      { id_persona: 12, nombre: "Ing. Fernando Gómez", tipo: "jurado" }, // Jurado 2 añadido, id_persona único
    ],
  },
  {
    id_exposicion: 4,
    fechaHora: new Date("2025-05-04T12:00:00"),
    sala: "A101", // Sala diferente
    estado: "esperando_aprobacion",
    id_etapa_formativa: 2,
    titulo:
      "Análisis Comparativo de Técnicas de Procesamiento de Lenguaje Natural para la Detección de Sentimientos en Redes Sociales", // Título diferente
    miembros: [
      { id_persona: 9, nombre: "Mtro. Jorge Vidal", tipo: "asesor" }, // Nombre diferente, id_persona único
      { id_persona: 10, nombre: "Lucía Fernández", tipo: "estudiante" }, // Nombre diferente, id_persona único
      { id_persona: 11, nombre: "Dra. Isabel Navarro", tipo: "jurado" }, // Jurado 1 añadido, id_persona único
      { id_persona: 12, nombre: "Ing. Fernando Gómez", tipo: "jurado" }, // Jurado 2 añadido, id_persona único
    ],
  },
  {
    id_exposicion: 5,
    fechaHora: new Date("2025-05-04T12:00:00"),
    sala: "A101", // Sala diferente
    estado: "programada",
    id_etapa_formativa: 2,
    titulo:
      "Análisis Comparativo de Técnicas de Procesamiento de Lenguaje Natural para la Detección de Sentimientos en Redes Sociales", // Título diferente
    miembros: [
      { id_persona: 9, nombre: "Mtro. Jorge Vidal", tipo: "asesor" }, // Nombre diferente, id_persona único
      { id_persona: 10, nombre: "Lucía Fernández", tipo: "estudiante" }, // Nombre diferente, id_persona único
      { id_persona: 11, nombre: "Dra. Isabel Navarro", tipo: "jurado" }, // Jurado 1 añadido, id_persona único
      { id_persona: 12, nombre: "Ing. Fernando Gómez", tipo: "jurado" }, // Jurado 2 añadido, id_persona único
    ],
  },
];
*/
}
const ExposicionesJuradoPage: React.FC = () => {
  const [etapasFormativas, setEtapasFormativas] = useState<EtapaFormativa[]>(
    [],
  );
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Cargar etapas formativas y ciclos
        const [etapasData, ciclosData] = await Promise.all([
          getEtapasFormativasNombres(),
          getCiclos(),
        ]);
        const { idToken } = useAuthStore.getState();
        console.log("ID Token:", idToken);
        setToken(idToken);
        if (!idToken) {
            console.error("No authentication token available");
        return;
        }

        setEtapasFormativas(etapasData);
        setCiclos(ciclosData);

        if (ciclosData.length > 0) {
          const periodoDefault = `${ciclosData[0].anio}-${ciclosData[0].semestre}`;

          // Actualizar el formulario con el valor por defecto
          reset({
            ...getValues(),
            periodo: periodoDefault
          });

          // Actualizar también los filtros activos
          setActiveFilters(prev => ({
            ...prev,
            periodo: periodoDefault
          }));
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const [exposiciones, setExposiciones] = useState<ExposicionJurado[]>([]);

  const fetchExposiciones = async () => {
    setIsLoading(true);
    try {
      //se debe reemplazar el 6 por el id del jurado logueado
      //se deberia pasar el token de autenticación

      const exposicionesData = await getExposicionesJurado(token!);
      
      setExposiciones(exposicionesData);
    } catch (error) {
      console.error("Error al cargar exposiciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExposiciones();
  }, []);

  const { control, watch, getValues, reset } = useForm({
    defaultValues: {
      buscador: "",
      curso: "TODOS",
      periodo: "",
      //ciclos?.length > 0 ? `${ciclos[0].anio}-${ciclos[0].semestre}` : "",
      estado: estados[0].value,
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    estado: estados[0].value,
    curso: "TODOS",//cursos[0].value,
    periodo: ""//periodos[0].value,
  });

  const estadoSeleccionado = watch("estado");
  const cursoSeleccionado = watch("curso");
  const periodoSeleccionado = watch("periodo");

  // Actualiza los filtros de select automáticamente
  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      estado: estadoSeleccionado,
      curso: cursoSeleccionado,
      periodo: periodoSeleccionado,
    }));
  }, [estadoSeleccionado, cursoSeleccionado, periodoSeleccionado]);

  const handleSearch = () => {
    // Obtiene el valor actual del campo buscador
    const searchValue = getValues("buscador").toLowerCase();
    // Actualiza el término de búsqueda
    setSearchTerm(searchValue);
  };

  // Añade esta función a exposiciones-jurado-page.tsx (es similar a determinarEstadoMostrado en el card)
  const determinarEstadoMostradoParaFiltro = (exposicion: ExposicionJurado): string => {
    // Obtener el estado base normalizado
    const estadoBase = exposicion.estado.toLowerCase().trim().replace(/\s+/g, "_");

    // Si el estado base es "esperando_respuesta" pero el estado_control es "ACEPTADO" o "RECHAZADO",
    // mostrar como "esperando_aprobacion"
    if (
      estadoBase === "esperando_respuesta" &&
      (exposicion.estado_control === "ACEPTADO" || exposicion.estado_control === "RECHAZADO")
    ) {
      return "esperando_aprobación";
    }

    // En cualquier otro caso, mostrar el estado base
    return estadoBase;
  };

  const filteredExposiciones = exposiciones.filter((exposicion) => {

    const estadoMostrado = determinarEstadoMostradoParaFiltro(exposicion);
    const matchesEstado =
      estadoSeleccionado === "todos" ||
      estadoMostrado.toLowerCase() === estadoSeleccionado.toLowerCase();
    // Filtro por curso (añadir lógica según tus datos)
    const matchesCurso =
      cursoSeleccionado === "TODOS" ||
      etapasFormativas.some(
        (etapa) =>
          etapa.nombre === cursoSeleccionado &&
          exposicion.id_etapa_formativa === etapa.etapaFormativaId,
      );

    // Filtro por periodo (añadir lógica según tus datos)
    const fechaExposicion = exposicion.fechahora;
    // Extraer año y semestre de la fecha de exposición
    const anioExposicion = fechaExposicion.getFullYear();
    // Determinar semestre (1 o 2) según el mes
    const semestreExposicion = fechaExposicion.getMonth() < 6 ? 1 : 2;
    const periodoExposicion = `${anioExposicion}-${semestreExposicion}`;

    const matchesPeriodo =
      periodoSeleccionado === "" || // Si no hay selección
      periodoExposicion === periodoSeleccionado;

    const titulo = exposicion.titulo.toLowerCase();
    const nombresEstudiantes = exposicion.miembros
      .filter((m) => m.tipo === "estudiante")
      .map((m) => m.nombre.toLowerCase())
      .join(" ");

    const matchesBuscador =
      titulo.includes(searchTerm) || nombresEstudiantes.includes(searchTerm);

    return matchesEstado && matchesCurso && matchesPeriodo && matchesBuscador;
  });

  const [selectedExposicion, setSelectedExposicion] =
    useState<ExposicionJurado | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (exposicion: ExposicionJurado) => {
    setSelectedExposicion(exposicion);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex h-[60px] pt-[15px] pr-[20px] pb-[10px] items-center gap-[10px] self-stretch">
        <h1 className="text-[#042354] font-montserrat text-[24px] font-semibold leading-[32px] tracking-[-0.144px]">
          Mis Exposiciones
        </h1>
      </div>

      <FilterExposicionJurado control={control} onSearch={handleSearch} />

      {/* Opcionalmente, añade un mensaje cuando no hay resultados */}
      {filteredExposiciones.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron exposiciones que coincidan con los criterios de
          búsqueda.
        </div>
      )}

      <div className="space-y-4">
        {filteredExposiciones.map((exposicion) => (
          <ExposicionCard
            id_jurado={token} // Reemplazar con el ID del jurado logueado
            key={exposicion.id_exposicion}
            exposicion={exposicion}
            onClick={() => handleOpenModal(exposicion)}
            onStatusChange={fetchExposiciones}
          />
        ))}
      </div>

      <ModalDetallesExposicion
        open={modalOpen}
        onOpenChange={setModalOpen}
        exposicion={selectedExposicion}
      />
    </div>
  );
};

export default ExposicionesJuradoPage;
