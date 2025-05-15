import Configuracion from "@/features/configuracion/views/Configuracion";
import { BookOpen, Settings } from "lucide-react";
import Link from "next/link";

export default function ConfiguracionPage() {
  return (
    <Configuracion/>
    // <div className="px-2 py-6 ">
    //   <h1 className="text-2xl font-bold mb-6">Configuración</h1>

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     <Link
    //       href="/coordinador/configuracion/proceso"
    //       className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
    //     >
    //       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
    //         <BookOpen size={24} />
    //       </div>
    //       <div>
    //         <h2 className="font-semibold text-lg mb-1">Configuración de Proceso</h2>
    //         <p className="text-gray-500 text-sm">
    //           Configure las fases, cursos, entregables y exposiciones del proyecto de fin de carrera.
    //         </p>
    //       </div>
    //     </Link>

    //     <Link
    //       href="/coordinador/configuracion/general"
    //       className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
    //     >
    //       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
    //         <Settings size={24} />
    //       </div>
    //       <div>
    //         <h2 className="font-semibold text-lg mb-1">Configuración General</h2>
    //         <p className="text-gray-500 text-sm">
    //           Configure los parámetros generales del sistema y las opciones de la facultad.
    //         </p>
    //       </div>
    //     </Link>
    //   </div>
    // </div>
  );
}
