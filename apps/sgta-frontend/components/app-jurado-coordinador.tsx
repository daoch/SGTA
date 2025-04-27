"use client";
import * as React from "react";
//import { Sidebar } from "./Sidebar";
import { JuradosTable } from "@/components/ui/juradoTable";
import { SearchFilters } from "@/components/ui/searchFilter";

export function AppJuradoCoordinador() {
  return (
    <main >
      
      <section >
        <h1  className="self-stretch px-5 pt-4 pb-3 w-full text-2xl font-semibold tracking-normal leading-none min-h-[60px] text-sky-950 max-md:max-w-full">
          Miembros de Jurado
        </h1>

        <div className="flex-1 p-4 w-full max-md:max-w-full">
          <SearchFilters />
          <JuradosTable />
        </div>
      </section>
    </main>
  );
}