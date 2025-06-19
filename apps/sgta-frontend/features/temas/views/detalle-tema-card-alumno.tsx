"use client";

import { useState } from "react";

export function DetalleTemaAlumnoView() {
  const [tab, setTab] = useState("detalle");

  // Data sintética
  const tema = {
    estado: "INSCRITO",
    estadoColor: "bg-purple-100 text-purple-700",
    numero: 37,
    titulo: "Desarrollo de una aplicación móvil para la gestión de tareas académicas",
    estudiantes: ["Laura Vega"],
    asesores: [
      "Martha Chavez",
      "Freddy Alberto Paz",
      "César Augusto Aguilera",
      "Luis Fernando Muroya",
    ],
    fecha: "18 de junio de 2025",
    resumen:
      "facilite la creación, programación y seguimiento de tareas académicas. La aplicación contará con funcionalidades como recordatorios, calendario integrado y categorías para diferentes asignaturas. Se busca mejorar la productividad de los estudiantes y su capacidad para gestionar el tiempo de manera más efectiva.",
    objetivos:
      "crear una aplicación móvil que permita a los estudiantes organizar, gestionar y realizar un seguimiento de sus tareas académicas de manera eficiente.",
  };

  // Contadores sintéticos para los tabs
  const counts = {
    detalle: 1,
    historial: 1,
    exposiciones: 0,
  };

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      {/* Tabs arriba alineados a la izquierda */}
      <div className="mb-6 flex">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <button
            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 transition ${
              tab === "detalle" ? "bg-white shadow text-black" : "text-black/80"
            }`}
            onClick={() => setTab("detalle")}
          >
            Aprobación de temas
            <span
              className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                tab === "detalle" ? "bg-gray-100 text-black" : "bg-transparent text-black"
              }`}
            >
              {counts.detalle}
            </span>
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 transition ${
              tab === "historial" ? "bg-white shadow text-black" : "text-black/80"
            }`}
            onClick={() => setTab("historial")}
          >
            Solicitudes de cambios
            <span
              className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                tab === "historial" ? "bg-gray-100 text-black" : "bg-transparent text-black"
              }`}
            >
              {counts.historial}
            </span>
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 transition ${
              tab === "exposiciones" ? "bg-white shadow text-black" : "text-black/80"
            }`}
            onClick={() => setTab("exposiciones")}
          >
            Información de exposiciones
            {counts.exposiciones > 0 && (
              <span
                className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  tab === "exposiciones" ? "bg-gray-100 text-black" : "bg-transparent text-black"
                }`}
              >
                {counts.exposiciones}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {tab === "detalle" && (
            <>
              {/* Card principal */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <button className="mb-4 text-sm flex items-center gap-2 text-gray-600 hover:underline">
                  ← Volver a solicitudes
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tema.estadoColor}`}>
                    {tema.estado}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    #{tema.numero}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900">{tema.titulo}</h1>
                <div className="flex flex-wrap gap-8 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-base">person</span>
                    <span className="font-semibold">Estudiantes:</span>
                    <span className="ml-1">{tema.estudiantes.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-base">school</span>
                    <span className="font-semibold">Asesores:</span>
                    <span className="ml-1">{tema.asesores.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-icons text-base">event</span>
                    <span className="font-semibold">Fecha:</span>
                    <span className="ml-1">{tema.fecha}</span>
                  </div>
                </div>
              </div>

              {/* Información del Tema */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                  <span className="material-icons text-lg">description</span>
                  Información del Tema
                </div>
                <div className="mb-4">
                  <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                    <span className="material-icons text-base">article</span>
                    Resumen del proyecto
                  </div>
                  <div className="text-gray-700">{tema.resumen}</div>
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2 mb-1 text-gray-800">
                    <span className="material-icons text-base">track_changes</span>
                    Objetivos del proyecto
                  </div>
                  <div className="text-gray-700">{tema.objetivos}</div>
                </div>
              </div>
            </>
          )}
          {tab === "historial" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              {/* Aquí tu historial */}
              <span className="text-gray-500">Aquí irá el historial del tema.</span>
            </div>
          )}
          {tab === "exposiciones" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              {/* Aquí tu información de exposiciones */}
              <span className="text-gray-500">Aquí irá la información de exposiciones.</span>
            </div>
          )}
        </div>

        {/* Columna derecha SOLO en tab detalle */}
        {tab === "detalle" && (
          <div className="flex flex-col gap-6">
            {/* Análisis de Similitud */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="font-semibold mb-2">Análisis de Similitud</div>
              <div className="text-gray-600 text-sm">
                No se encontraron temas similares. Puede solicitar una nueva revisión.
              </div>
            </div>
            {/* Acciones Disponibles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="font-semibold mb-2">Acciones Disponibles</div>
              <button className="flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 font-semibold">
                <span className="material-icons text-base">delete</span>
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}