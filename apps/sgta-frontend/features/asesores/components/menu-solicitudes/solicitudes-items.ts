import { FileText, Plus, User } from "lucide-react";
import { Solicitud } from "../../types/menu-solicitudes/entidades";

export const solicitudesItems: Solicitud[] = [
  {
    id: "cambio-asesor",
    nombre: "Solicitud de Cambio de Asesor",
    descripcion:
      "Gestiona solicitudes para cambiar de asesor académico: registra nuevas solicitudes y consulta el estado de las existentes.",
    icono: User,
    acciones: [
      {
        label: "Registrar solicitud de cambio de asesor",
        ruta: "/alumno/solicitudes-academicas/cambio-asesor/registrar",
        variante: "default",
        icono: Plus,
      },
      {
        label: "Ver mis solicitudes",
        ruta: "/alumno/solicitudes-academicas/cambio-asesor/mis-solicitudes",
        variante: "outline",
        icono: FileText,
      },
    ],
  },
  {
    id: "cese-tema",
    nombre: "Solicitud de Cese de Tema",
    descripcion:
      "Gestiona solicitudes para cesar un tema de tesis: registra nuevas solicitudes y consulta el estado de las existentes.",
    icono: FileText,
    acciones: [
      {
        label: "Registrar solicitud de cese de tema",
        ruta: "/alumno/solicitudes-academicas/cese-tema/registrar",
        variante: "default",
        icono: Plus,
      },
      {
        label: "Ver mis solicitudes",
        ruta: "/alumno/solicitudes-academicas/cese-tema/mis-solicitudes",
        variante: "outline",
        icono: FileText,
      },
    ],
  },
];
