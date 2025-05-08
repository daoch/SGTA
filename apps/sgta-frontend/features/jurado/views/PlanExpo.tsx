
import { AreaEspecialidad, Dispo, Tema } from "../types/jurado.types";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ExposList from "@/features/jurado/components/ExposList";
import PlanificationPanel from "@/features/jurado/components/PlanificationPanel";
import GeneralPlanificationExpo from "@/features/jurado/components/GeneralPlanificationExpo";
import { listarTemasCicloActulXEtapaFormativa } from "@/features/jurado/services/data";
type Props = {
  etapaFormativaId : number
};
 export default async function PlanExpo({ etapaFormativaId }: Props) {
  const expos = await listarTemasCicloActulXEtapaFormativa(etapaFormativaId);
  const topics: AreaEspecialidad[] = [];
  const roomAvailList: Dispo[] = [];
  console.log({expos});
  /*const roomAvailList: Dispo[] = [
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
  ]);*/



 
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
      <GeneralPlanificationExpo expos={expos} topics={topics} roomAvailList={roomAvailList}></GeneralPlanificationExpo>
    </main>
  );
};

