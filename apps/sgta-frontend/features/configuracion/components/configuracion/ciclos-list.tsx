import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CicloEtapas } from "@/features/administrador/types/ciclo.type";
import { Edit } from "lucide-react";

// Datos de ejemplo
const ciclos = [
  {
    id: 1,
    nombre: "2023-1",
    semestre: "1",
    año: 2023,
    fechaInicio: "01/04/2023",
    fechaFin: "31/07/2023",
    estado: "Finalizado",
    etapasFormativas: 5,
  },
  {
    id: 2,
    nombre: "2023-2",
    semestre: "2",
    año: 2023,
    fechaInicio: "15/08/2023",
    fechaFin: "15/12/2023",
    estado: "Finalizado",
    etapasFormativas: 5,
  },
  {
    id: 3,
    nombre: "2024-1",
    semestre: "1",
    año: 2024,
    fechaInicio: "01/04/2024",
    fechaFin: "31/07/2024",
    estado: "En curso",
    etapasFormativas: 6,
  },
  {
    id: 4,
    nombre: "2025-2",
    semestre: "2",
    año: 2025,
    fechaInicio: "15/08/2025",
    fechaFin: "15/12/2025",
    estado: "En curso",
    etapasFormativas: 6,
  },
];

interface CiclosListProps {
  ciclos: CicloEtapas[];
  onEdit?: (ciclo: CicloEtapas) => void;
}

// export function CiclosList({ ciclos }: CiclosListProps) {
//   return (
//     <table className="w-full text-left">
//       <thead>
//         <tr>
//           <th className="border-b py-2">Nombre</th>
//           <th className="border-b py-2">Estado</th>
//           <th className="border-b py-2">Fecha Inicio</th>
//           <th className="border-b py-2">Fecha Fin</th>
//         </tr>
//       </thead>
//       <tbody>
//         {ciclos.map((ciclo) => (
//           <tr key={ciclo.id}>
//             <td className="py-2">{ciclo.nombre}</td>
//             <td className="py-2">{ciclo.estado}</td>
//             <td className="py-2">{ciclo.fechaInicio}</td>
//             <td className="py-2">{ciclo.fechaFin}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }


export function CiclosList({ ciclos, onEdit }: CiclosListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Ciclo</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Fecha Inicio</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Fecha Fin</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Estado</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Etapas Formativas</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Editar</th>
          </tr>
        </thead>
        <tbody className="divide-y">
            {ciclos.map((ciclo) => (
          <tr key={ciclo.id}>
            <td className="px-4 py-3 text-sm font-medium">{`${ciclo.anio}-${ciclo.semestre}`}</td>
            <td className="px-4 py-3 text-sm">{ciclo.fechaInicio}</td>
            <td className="px-4 py-3 text-sm">{ciclo.fechaFin}</td>
            <td className="px-4 py-3 text-sm">
                <Badge variant={ciclo.activo ? "default" : "secondary"}>{ciclo.activo ? "Activo" : "Inactivo"}</Badge>
            </td>
            <td className="px-4 py-3 text-sm">{ciclo.cantidadEtapas}</td>
            <td className="px-4 py-3 text-sm">
              <div className="flex gap-2">
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onEdit(ciclo)}
                  >
                    <Edit size={16} />
                  </Button>
                )}
              </div>
            </td>
            
          </tr>
        ))}
           {/* {ciclos.map((ciclo) => ( */}
{/* //             <tr key={ciclo.id} className="hover:bg-gray-50">
//               <td className="px-4 py-3 text-sm font-medium">{ciclo.nombre}</td>
//               <td className="px-4 py-3 text-sm">{ciclo.fechaInicio}</td>
//               <td className="px-4 py-3 text-sm">{ciclo.fechaFin}</td>
//               <td className="px-4 py-3 text-sm">
//                 <Badge variant={ciclo.estado === "En curso" ? "default" : "secondary"}>{ciclo.estado}</Badge>
//               </td>
//               <td className="px-4 py-3 text-sm">{ciclo.etapasFormativas}</td>
//               <td className="px-4 py-3 text-sm">
//                 <div className="flex gap-2">
//                   <Link href={`/administrador/configuracion/ciclos/${ciclo.id}`}>
//                     <Button variant="ghost" size="icon" className="h-8 w-8">
//                       <Eye size={16} />
//                     </Button>
//                   </Link>
//                   <Link href={`/administrador/configuracion/ciclos/${ciclo.id}/editar`}>
//                     <Button variant="ghost" size="icon" className="h-8 w-8">
//                       <Edit size={16} />
//                     </Button>
//                   </Link>
//                   <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
//                     <Trash2 size={16} />
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))} */}
         </tbody>
       </table>
     </div>
   );
 }
