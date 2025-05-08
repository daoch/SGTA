"use client";

import React, { useState } from "react";
import { AreaEspecialidad, Dispo, Exposicion } from "../types/jurado.types";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ExposList from "@/features/jurado/components/ExposList";
import PlanificationPanel from "@/features/jurado/components/PlanificationPanel";

const PlanExpo: React.FC = () => {
  const roomAvailList: Dispo[] = [
    {
      code: 1,
      date: new Date("2024-01-01"),
      startTime: "08:00",
      endTime: "09:00",
      spaces: [
        { code: "V201", busy: false },
        { code: "V202", busy: false },
        { code: "V203", busy: false },
        { code: "V204", busy: false },
      ],
    },
    {
      code: 2,
      date: new Date("2024-01-02"),
      startTime: "14:00",
      endTime: "15:00",
      spaces: [
        { code: "V201", busy: false },
        { code: "V202", busy: false },
        { code: "V204", busy: false },
      ],
    },
  ];

  const [topics, _] = useState<AreaEspecialidad[]>([
    { name: "Todos" },
    { name: "Inteligencia Artificial" },
    { name: "Sistemas de información" },
  ]);
  const [freeExpos, setFreeExpos] = useState<Exposicion[]>([
    {
      code: "INF0501",
      name: "Aplicaion de Deep Learning para la detección y clasificación automática de insectos agrícolas en trampoas pegantes",
      advisor: "Rony Cueva",
      jurys: [
        { code: "JUR00001", name: "Eder Quispe" },
        { code: "JUR00002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0502",
      name: "Generacion de imagenes de acciones especificas de una persona utilizando aprendizaje profundo",
      advisor: "Ediwn Villegas",
      jurys: [
        { code: "JUR0003", name: "Carlos Cisneros" },
        { code: "JUR0004", name: "Roger  Quiroz" },
      ],
    },
    {
      code: "INF0503",
      name: "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0504",
      name: "Aplicacion de móvil para gestionar carpool en universidades",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0505",
      name: "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0506",
      name: "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0507",
      name: "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0508",
      name: "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
    {
      code: "INF0509",
      name: "Identificación del nivel de complejidad de texto para el entrenamiento de chatbots",
      advisor: "Marco Bossio",
      jurys: [
        { code: "JUR0001", name: "Eder Quispe" },
        { code: "JUR0002", name: "Fredy Paz" },
      ],
    },
  ]);

  const [assignedExpos, setAssignedExpos] = useState<
    Record<string, Exposicion>
  >({});

  /*Handles the drag and drop event for the expositions*/
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    /*validates that the drop occurs in a valid and different location from the original one.*/
    if (!over || active.id === over.id) return;

    const expoId = active.id as string;
    const spaceId = over.id as string;
    /*checks if the item being dragged is in the list of unassigned expositions.*/
    const chosenExpo = freeExpos.find((e) => e.code === expoId);

    if (chosenExpo) {
      /*If it's in the unassigned list, it's removed from there and added to the assigned list*/
      const newAssignment = {
        [spaceId]: chosenExpo,
      };
      setAssignedExpos((prevAssignment) => ({
        ...prevAssignment,
        ...newAssignment,
      }));

      setFreeExpos((prev) => prev.filter((e) => e.code !== expoId));
    } else {
      /*If it's not in the unassigned list, it means it was already assigned,
           so we remove it from its previous assignment and reassign it to the new location.*/
      const chosenExpo = Object.values(assignedExpos).find(
        (a) => a.code === expoId,
      );
      if (chosenExpo) {
        const newAssignment = {
          [spaceId]: chosenExpo,
        };
        const updatedAssignment = Object.keys(assignedExpos)
          .filter((key) => assignedExpos[key].code !== chosenExpo.code)
          .reduce((acc: Record<string, Exposicion>, key) => {
            acc[key] = assignedExpos[key];
            return acc;
          }, {});

        setAssignedExpos(() => ({
          ...updatedAssignment,
          ...newAssignment,
        }));
      }
    }
  }

  const removeExpo = (expo: Exposicion) => {
    //find the click expo
    const clickedExpo = Object.values(assignedExpos).find(
      (a) => a.code === expo.code,
    );

    if (clickedExpo) {
      //if we find it , add to free expos
      setFreeExpos((prev) => [...prev, clickedExpo]);
      //and remove from assigned expos
      setAssignedExpos((prev) => {
        const updatedAssignment = { ...prev };
        Object.keys(updatedAssignment).forEach((key) => {
          if (updatedAssignment[key].code === expo.code) {
            delete updatedAssignment[key];
          }
        });
        return updatedAssignment;
      });
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 20,
    },
  });

  const sensors = useSensors(mouseSensor);

  return (
    <main className="h-screen flex flex-col">
      <div className="py-4">
        <h1
          className="text-blue-900 font-bold text-2xl"
          style={{ color: "#042354" }}
        >
          Planificador de exposiciones
        </h1>
      </div>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="flex flex-col md:flex-row gap-2  flex-1 min-h-0">
          <div className="w-full md:w-1/4  h-full">
            <ExposList freeExpos={freeExpos} topics={topics} />
          </div>

          <div className="bg-gray-300 w-full h-px md:w-px md:h-auto"></div>
          <div className="flex flex-col w-full md:w-3/4 overflow-y-auto gap-4">
            <PlanificationPanel
              roomAvailList={roomAvailList}
              assignedExpos={assignedExpos}
              removeExpo={removeExpo}
            />
          </div>
        </div>
      </DndContext>
    </main>
  );
};

export default PlanExpo;
