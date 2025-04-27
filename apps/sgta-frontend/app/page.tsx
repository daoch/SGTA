// export default function Home() {
//   return (
//     <div>
//       Prueba
//     </div>
//   )
// }
//<Sidebar />

"use client";
import * as React from "react";
//import { Sidebar } from "./Sidebar";
import {AppJuradoCoordinador} from "@/components/app-jurado-coordinador";


export default function Home() {
  return (
    <main className="flex overflow-hidden flex-wrap justify-between w-full rounded-lg bg-[color:var(--background)] min-h-[900px] max-md:max-w-full">
      
        <div>
          <AppJuradoCoordinador />
        </div>
      
    </main>
  );
}
