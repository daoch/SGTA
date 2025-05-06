"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ExposicionCard } from "@/features/jurado/components/exposicion-card";
import ModalDetallesExposicion from "../../components/modal-detalles-exposicion";
import { Exposicion } from "../../types/exposicion.types";
import { FilterExposicionJurado } from "../../components/filters-exposicion-jurado";

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

const estados = [
  { value: "todos", label: "Todos" },
  { value: "esperando_respuesta", label: "Esperando Respuesta" },
  { value: "esperando_aprobacion", label: "Esperando Aprobacion" },
  { value: "programada", label: "Programada" },
  { value: "completada", label: "Completada" },
  { value: "finalizada", label: "Finalizada" },
];

const exposiciones: Exposicion[] = [
  {
    id_exposicion: 1,
    fechaHora: new Date("2025-10-15T09:00:00"),
    sala: "A501", // Sala diferente
    estado: "esperando_respuesta",
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
    fechaHora: new Date("2025-10-15T10:00:00"),
    sala: "B210", // Sala diferente
    estado: "esperando_respuesta",
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
    fechaHora: new Date("2025-12-15T11:00:00"),
    sala: "A101", // Sala diferente
    estado: "programada",
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
    fechaHora: new Date("2025-10-15T12:00:00"),
    sala: "A101", // Sala diferente
    estado: "esperando_aprobacion",
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

const ExposicionesJuradoPage: React.FC = () => {
  const { control, watch } = useForm({
    defaultValues: {
      buscador: "",
      curso: cursos[0].value,
      periodo: periodos[0].value,
      estado: estados[0].value,
    },
  });

  const estadoSeleccionado = watch("estado");
  const buscadorFiltrado = watch("buscador").toLowerCase();

  const filteredExposiciones = exposiciones.filter((exposicion) => {
    const matchesEstado =
      estadoSeleccionado === "todos" ||
      exposicion.estado.toLowerCase() === estadoSeleccionado.toLowerCase();

    const titulo = exposicion.titulo.toLowerCase();
    const nombresEstudiantes = exposicion.miembros
      .filter((m) => m.tipo === "estudiante")
      .map((m) => m.nombre.toLowerCase())
      .join(" ");

    const matchesBuscador =
      titulo.includes(buscadorFiltrado) ||
      nombresEstudiantes.includes(buscadorFiltrado);

    return matchesEstado && matchesBuscador;
  });

  const [selectedExposicion, setSelectedExposicion] =
    useState<Exposicion | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (exposicion: Exposicion) => {
    setSelectedExposicion(exposicion);
    setModalOpen(true);
  };

  return (
    <div>
      <FilterExposicionJurado control={control} />

      <div className="space-y-4">
        {filteredExposiciones.map((exposicion) => (
          <ExposicionCard
            key={exposicion.id_exposicion}
            exposicion={exposicion}
            onClick={() => handleOpenModal(exposicion)}
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
