"use client";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useState, useTransition } from "react";
import {
  finishPlanning,
  //updateBloquesListFirstTime,
  updateBloquesNextPhase,
} from "../../actions/actions";
import { JornadaExposicionDTO } from "../../dtos/JornadExposicionDTO";
import { listarEstadoPlanificacionPorExposicion } from "../../services/data";
import {
  AreaEspecialidad,
  EstadoPlanificacion,
  OrigenBoton,
  Tema,
  TimeSlot,
} from "../../types/jurado.types";
import { DragContext } from "./DragContext";
import { DragMonitor } from "./DragMonitor";
import ExposList from "./ExposList";
import PlanificationPanel from "./PlanificationPanel";
import AppLoading from "@/components/loading/app-loading";

interface Props {
  temas: Tema[];
  topics: AreaEspecialidad[];
  days: JornadaExposicionDTO[];
  bloques: TimeSlot[];
  exposicionId: number;
  estadoPlanificacion: EstadoPlanificacion;
}

const GeneralPlanificationExpo: React.FC<Props> = ({
  temas,
  topics,
  bloques,
  days,
  exposicionId,
  estadoPlanificacion,
}: Props) => {
  console.log("bloquesList", bloques);
  const [bloquesMapeados, setBloquesMapeados] = useState<TimeSlot[]>(bloques);
  const [temasSinBloque, setTemasSinBloque] = useState<Tema[]>(temas);
  const [temasAsignados, setTemasAsignados] = useState<Record<string, Tema>>(
    {},
  );
  const [isPending, startTransition] = useTransition();
  const [_, setIsLoading] = useState(false);
  const [estadoPlan, setEstadoPlan] =
    useState<EstadoPlanificacion>(estadoPlanificacion);

  useEffect(() => {
    const assigned: Record<string, Tema> = {};
    const assignedTemaIds = new Set<string>();

    for (const bloque of bloquesMapeados) {
      const temaAsignado = temas.find(
        (tema) => tema.codigo === bloque.expo?.codigo,
      ); // O ajusta el campo según sea necesario
      if (temaAsignado) {
        assigned[bloque.key] = temaAsignado;
        assignedTemaIds.add(temaAsignado.codigo);
      }
    }

    const free = temas.filter((tema) => !assignedTemaIds.has(tema.codigo));

    setTemasAsignados(assigned);
    setTemasSinBloque(free);
  }, [bloquesMapeados, temas]);

  const actualizarBloque = (idBloque: number, datos: Partial<TimeSlot>) => {
    setBloquesMapeados((prev) =>
      prev.map((b) => (b.idBloque === idBloque ? { ...b, ...datos } : b)),
    );
  };

  /*Handles the drag and drop event for the expositions*/
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    /*validates that the drop occurs in a valid and different location from the original one.*/
    if (!over || active.id === over.id) return;

    const expoId = active.id;
    const spaceId = over.id;
    /*checks if the item being dragged is in the list of unassigned expositions.*/
    const chosenExpo = temasSinBloque.find((e) => e.codigo === expoId);

    if (chosenExpo) {
      /*If it's in the unassigned list, it's removed from there and added to the assigned list*/
      if (spaceId in temasAsignados) {
        return;
      }

      const newAssignment = {
        [spaceId]: chosenExpo,
      };
      setTemasAsignados((prevAssignment) => ({
        ...prevAssignment,
        ...newAssignment,
      }));

      setTemasSinBloque((prev) => prev.filter((e) => e.codigo !== expoId));
    } else {
      /*If it's not in the unassigned list, it means it was already assigned,
           so we remove it from its previous assignment and reassign it to the new location.*/
      const chosenExpo = Object.values(temasAsignados).find(
        (a) => a.codigo === expoId,
      );
      if (chosenExpo) {
        const newAssignment = {
          [spaceId]: chosenExpo,
        };
        const updatedAssignment = Object.keys(temasAsignados)
          .filter((key) => temasAsignados[key].codigo !== chosenExpo.codigo)
          .reduce((acc: Record<string, Tema>, key) => {
            acc[key] = temasAsignados[key];
            return acc;
          }, {});

        setTemasAsignados(() => ({
          ...updatedAssignment,
          ...newAssignment,
        }));
      }
    }
  }

  const removeExpo = (expo: Tema) => {
    if (estadoPlan.nombre === "Cierre de planificacion") return;
    //find the click expo
    const clickedExpo = Object.values(temasAsignados).find(
      (a) => a.id === expo.id,
    );

    if (clickedExpo) {
      //if we find it , add to free expos
      setTemasSinBloque((prev) => [...prev, clickedExpo]);
      //and remove from assigned expos
      setTemasAsignados((prev) => {
        const updatedAssignment = { ...prev };
        Object.keys(updatedAssignment).forEach((key) => {
          if (updatedAssignment[key].id === expo.id) {
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

  // const onPlanificacionInicialClick = () => {
  //   if (temasSinBloque.length > 0) {
  //     console.log("No puede dejar temas sin asignar");
  //     return;
  //   }
  //   setIsLoading(true);
  //   const bloquesListToInsert: TimeSlot[] = bloques.map((bloque) => {
  //     const temaAsignado = temasAsignados[bloque.key];
  //     return {
  //       ...bloque,
  //       expo: temaAsignado ? temaAsignado : undefined,
  //       idExposicion: exposicionId,
  //     };
  //   });
  //   if (estadoPlanificacion.nombre === "Planificacion inicial") {
  //     try {
  //       startTransition(async () => {
  //         await updateBloquesListFirstTime(bloquesListToInsert);
  //         const newEstadoPlanificacion =
  //           await listarEstadoPlanificacionPorExposicion(exposicionId);
  //         setEstadoPlan(newEstadoPlanificacion);
  //       });
  //     } catch (err) {
  //       console.error("Error al actualizar los bloques:", err);
  //     } finally {
  //       setIsLoading(false); // ✅ Siempre oculta el loading
  //     }
  //   }

  //   console.log(
  //     "Lista final de bloques con expos asignadas:",
  //     bloquesListToInsert,
  //   );
  // };

  const onAvanzarPlanificacionClick = (origen: OrigenBoton) => {
    if (temasSinBloque.length > 0) {
      console.log("No puede dejar temas sin asignar");
      return;
    }
    setIsLoading(true);
    const bloquesListToInsert: TimeSlot[] = bloquesMapeados.map((bloque) => {
      const temaAsignado = temasAsignados[bloque.key];
      return {
        ...bloque,
        expo: temaAsignado ? temaAsignado : undefined,
        idExposicion: exposicionId,
        esBloqueReservado: temaAsignado ? true : false,
      };
    });

    try {
      startTransition(async () => {
        await updateBloquesNextPhase(bloquesListToInsert);
        if (origen === "terminar") {
          await finishPlanning(exposicionId);
        }
        const newEstadoPlanificacion =
          await listarEstadoPlanificacionPorExposicion(exposicionId);
        setEstadoPlan(newEstadoPlanificacion);
      });
    } catch (err) {
      console.error("Error al actualizar los bloques:", err);
    } finally {
      setIsLoading(false);
    }
    return;
  };

  const sensors = useSensors(mouseSensor);
  const [isDragging, setIsDragging] = useState(false);
  return (
    <>
      {isPending && <AppLoading />}
      <DragContext.Provider value={isDragging}>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <DragMonitor setIsDragging={setIsDragging} />
          <div className="flex flex-col md:flex-row w-full h-full gap-4">
            <div className="w-full md:w-1/4 h-full">
              <ExposList freeExpos={temasSinBloque} topics={topics} />
            </div>
            <div className="bg-gray-300 w-full h-px md:w-px md:h-auto"></div>
            <div className="flex flex-col w-full md:w-3/4">
              <PlanificationPanel
                days={days}
                assignedExpos={temasAsignados}
                removeExpo={removeExpo}
                onAvanzarPlanificacionClick={onAvanzarPlanificacionClick}
                bloquesList={bloquesMapeados}
                estadoPlan={estadoPlan}
                actualizarBloque={actualizarBloque}
              />
            </div>
          </div>
        </DndContext>
      </DragContext.Provider>
    </>
  );
};

export default GeneralPlanificationExpo;
