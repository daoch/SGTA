"use client";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import { JornadaExposicionDTO } from "../../dtos/JornadExposicionDTO";
import { listarEstadoPlanificacionPorExposicion } from "../../services/data";
import {
  finishPlanning,
  updateBloquesNextPhase,
} from "../../services/planificacion-service";
import { usePlanificationStore } from "../../store/use-planificacion-store";
import {
  AreaEspecialidad,
  EstadoPlanificacion,
  Tema,
  TimeSlot,
  TipoAccion,
} from "../../types/jurado.types";
import { DragContext } from "./DragContext";
import { DragMonitor } from "./DragMonitor";
import PlanificationPanel from "./planification-panel";
import TemasList from "./temas-list";
import { getFechaHoraFromKey } from "../../utils/get-fecha-hora-from-key";

interface Props {
  temas: Tema[];
  temasSinAsignar: Tema[];
  temasAsignados: Record<string, Tema>;
  areasEspecialidad: AreaEspecialidad[];
  days: JornadaExposicionDTO[];
  bloques: TimeSlot[];
  exposicionId: number;
  estado: EstadoPlanificacion;
}

const GeneralPlanificationExpo: React.FC<Props> = ({
  temas: temasRecibidos,
  temasSinAsignar: temasSinAsignarRecibidos,
  temasAsignados: temasAsignadosRecibidos,
  areasEspecialidad,
  bloques: bloquesRecibidos,
  days,
  exposicionId,
  estado: estadoRecibido,
}: Props) => {
  const {
    estadoPlanificacion,
    setEstadoPlanificacion,
    setTemas,
    temasSinAsignar,
    setTemasSinAsignar,
    temasAsignados,
    setTemasAsignados,
    bloques,
    setBloques,
    actualizarBloqueByKey,
  } = usePlanificationStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEstadoPlanificacion(estadoRecibido);
    setTemas(temasRecibidos);
    setTemasSinAsignar(temasSinAsignarRecibidos);
    setTemasAsignados(temasAsignadosRecibidos);
    setBloques(bloquesRecibidos);
  }, [
    estadoRecibido,
    setEstadoPlanificacion,
    setTemas,
    temasRecibidos,
    setBloques,
    bloquesRecibidos,
    setTemasSinAsignar,
    temasSinAsignarRecibidos,
    temasAsignadosRecibidos,
    setTemasAsignados,
  ]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const expoId = active.id;
      const spaceId = over.id;

      const bloqueDestino = bloques.find((b) => b.key === spaceId);

      // Encuentra el tema que se quiere asignar
      const temaEscogidoDesdeLista = temasSinAsignar.find(
        (e) => e.codigo === expoId,
      );

      // Usuarios del tema a asignar
      const usuariosTema = temaEscogidoDesdeLista?.usuarios ?? [];

      // Validación: ¿algún usuario ya tiene bloque en ese día y hora?
      const conflicto = Object.entries(temasAsignados).some(
        ([bloqueKey, temaAsignado]) => {
          if (!temaAsignado?.usuarios) return false;
          const bloqueAsignado = bloques.find((b) => b.key === bloqueKey);
          // Compara fecha y hora exacta
          return (
            bloqueAsignado &&
            bloqueDestino &&
            getFechaHoraFromKey(bloqueAsignado.key) ===
              getFechaHoraFromKey(bloqueDestino.key) &&
            temaAsignado.usuarios.some((u) =>
              usuariosTema.some((ut) => ut.idUsario === u.idUsario),
            )
          );
        },
      );

      if (conflicto) {
        console.warn(
          "No se puede asignar: uno de los usuarios ya tiene un bloque en ese horario.",
        );
        return;
      }

      if (temaEscogidoDesdeLista) {
        //si se asigna desde la lista de temas sin asignar
        if (spaceId in temasAsignados) return;
        const temaPorAsignar = { [spaceId]: temaEscogidoDesdeLista };
        setTemasAsignados({
          ...temasAsignados,
          ...temaPorAsignar,
        });
        setTemasSinAsignar(temasSinAsignar.filter((e) => e.codigo !== expoId));
        actualizarBloqueByKey(spaceId.toString(), {
          esBloqueReservado: true,
          expo: temaEscogidoDesdeLista,
        });
      } else {
        //si se asigna desde un bloque ya asignado
        const keyTemaEscogido = Object.keys(temasAsignados).find(
          (key) => temasAsignados[key].codigo === expoId,
        );
        const temaEscogidosDesdeBloque = keyTemaEscogido
          ? temasAsignados[keyTemaEscogido]
          : undefined;
        if (temaEscogidosDesdeBloque) {
          const temaPorAsignar = { [spaceId]: temaEscogidosDesdeBloque };
          const updatedAssignment = Object.keys(temasAsignados)
            .filter(
              (key) =>
                temasAsignados[key].codigo !== temaEscogidosDesdeBloque.codigo,
            )
            .reduce((acc: Record<string, Tema>, key) => {
              acc[key] = temasAsignados[key];
              return acc;
            }, {});
          setTemasAsignados({
            ...updatedAssignment,
            ...temaPorAsignar,
          });
          actualizarBloqueByKey(spaceId.toString(), {
            esBloqueReservado: true,
            expo: temaEscogidosDesdeBloque,
          });
          actualizarBloqueByKey(keyTemaEscogido || "", {
            esBloqueReservado: false,
            expo: {
              id: null,
              codigo: null,
              titulo: null,
              usuarios: null,
              areasConocimiento: undefined,
            },
          });
        }
      }
    },
    [
      setTemasAsignados,
      setTemasSinAsignar,
      temasAsignados,
      temasSinAsignar,
      actualizarBloqueByKey,
    ],
  );

  const removeExpo = useCallback(
    (tema: Tema) => {
      if (
        estadoPlanificacion === undefined ||
        estadoPlanificacion.nombre === "Cierre de planificacion"
      )
        return;
      const clickedExpo = Object.values(temasAsignados).find(
        (a) => a.id === tema.id,
      );
      if (clickedExpo) {
        setTemasSinAsignar([...temasSinAsignar, clickedExpo]);
        const updatedAssignment = { ...temasAsignados };
        const keyClicked = Object.keys(temasAsignados).find(
          (key) => temasAsignados[key] === clickedExpo,
        );
        Object.keys(updatedAssignment).forEach((key) => {
          if (updatedAssignment[key].id === tema.id) {
            delete updatedAssignment[key];
          }
        });
        setTemasAsignados(updatedAssignment);
        actualizarBloqueByKey(keyClicked || "", {
          esBloqueReservado: false,
          expo: {
            id: null,
            codigo: null,
            titulo: null,
            usuarios: null,
            areasConocimiento: undefined,
          },
        });
      }
    },
    [
      estadoPlanificacion,
      setTemasAsignados,
      setTemasSinAsignar,
      temasAsignados,
      temasSinAsignar,
      actualizarBloqueByKey,
    ],
  );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 20,
    },
  });

  const onAvanzarPlanificacionClick = async (origen: TipoAccion) => {
    if (temasSinAsignar.length > 0) {
      console.log("No puede dejar temas sin asignar");
      return;
    }

    setIsLoading(true);
    const bloquesListToInsert: TimeSlot[] = bloques.map((bloque) => {
      const temaAsignado = temasAsignados[bloque.key];
      return {
        ...bloque,
        expo: temaAsignado ? temaAsignado : undefined,
        idExposicion: exposicionId,
        esBloqueReservado: temaAsignado ? true : false,
        anteriorExpo: bloque.anteriorExpo,
      };
    });

    console.log("bloquesListToInsert", bloquesListToInsert);

    try {
      await updateBloquesNextPhase(bloquesListToInsert);
      if (origen == "terminar") await finishPlanning(exposicionId);
      const newEstadoPlanificacion =
        await listarEstadoPlanificacionPorExposicion(exposicionId);
      setEstadoPlanificacion(newEstadoPlanificacion);
    } catch (err) {
      console.error("Error al actualizar los bloques:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sensors = useSensors(mouseSensor);

  const [isDragging, setIsDragging] = useState(false);

  console.log("temasAsignados", temasAsignados);
  console.log("bloques", bloques);

  return (
    <DragContext.Provider value={isDragging}>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <DragMonitor setIsDragging={setIsDragging} />
        <div className="flex flex-col md:flex-row w-full h-full gap-4">
          {estadoPlanificacion?.nombre != "Cierre de planificacion" && (
            <>
              <div className="w-full h-full md:w-1/4 min-w-1/4">
                <TemasList areasEspecialidad={areasEspecialidad} />
              </div>
              <div className="bg-gray-300 w-full h-px md:w-px md:h-auto" />
            </>
          )}
          <div className="flex flex-col w-full">
            <PlanificationPanel
              days={days}
              assignedExpos={temasAsignados}
              removeExpo={removeExpo}
              onAvanzarPlanificacionClick={onAvanzarPlanificacionClick}
              bloquesList={bloques}
              estadoPlan={estadoPlanificacion}
              isLoading={isLoading}
            />
          </div>
        </div>
      </DndContext>
    </DragContext.Provider>
  );
};

export default GeneralPlanificationExpo;
