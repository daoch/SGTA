"use client";
import * as React from "react";
import { TableComponents } from "./tableComponents";

const { TableHeader, TableCell, TableRow } = TableComponents;

export const JuradosTable = () => {
  return (
    <div className="overflow-hidden mt-5 w-full rounded-lg min-h-[695px] max-md:max-w-full">
      <div className="flex flex-wrap justify-center items-start w-full h-[232px] max-md:max-w-full">
        <table className="w-full">
          <thead>
            <tr>
              <TableHeader>Usuario</TableHeader>
              <TableHeader>Código</TableHeader>
              <TableHeader>Correo electrónico</TableHeader>
              <TableHeader>Tipo de Dedicación</TableHeader>
              <TableHeader>Asignados</TableHeader>
              <TableHeader>Área de Especialidad</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader>Acciones</TableHeader>
            </tr>
          </thead>
          <tbody>
            <TableRow
              user={{ name: "Fernando Contreras", avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/abdb2d05c6455956b278c46bfc7dc11bfc4502c7?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" }}
              code="19980925"
              email="fer.con@pucp.edu.pe"
              dedication="TPA"
              assigned="2"
              specialties={[
                "Sistemas de Información",
                "Ingeniería de Software",
              ]}
              status="Activo"
            />
            <TableRow
              user={{ name: "David Allasi", avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/abdb2d05c6455956b278c46bfc7dc11bfc4502c7?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" }}
              code="19990925"
              email="david.allasi@pucp.edu.pe"
              dedication="TC"
              assigned="12"
              specialties={["Sistema de Logística"]}
              status="Activo"
            />
            <TableRow
              user={{ name: "Luis Flores", avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/abdb2d05c6455956b278c46bfc7dc11bfc4502c7?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" }}
              code="20000925"
              email="l.flores@pucp.edu.pe"
              dedication="TC"
              assigned="15"
              specialties={["Gestión de Proyectos"]}
              status="Activo"
            />
          </tbody>
        </table>
      </div>

      <div className="flex items-center px-16 py-24 mt-96 w-full bg-[color:var(--background)] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-10 items-center self-stretch my-auto min-w-60">
          <span className="self-stretch my-auto text-sm leading-none text-[color:var(--foreground)]">
            Página 1 de 1
          </span>
          <div className="flex gap-2 items-center self-stretch my-auto">
            <PaginationButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/9dff491386d7cffd5d5dbaac27ad92c6407a59f5?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" />
            <PaginationButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/6f607164f53586e263695d24787059f3357213ee?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" />
            <PaginationButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/22e5f1c609db383e09a251ecd42f980d4818854b?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" />
            <PaginationButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/20253919518be5eeb4bc5512ada8f30accc60b31?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaginationButton: React.FC<{ icon: string }> = ({ icon }) => (
  <button className="flex gap-2 justify-center items-center self-stretch px-2.5 my-auto w-9 h-9 rounded-md bg-[color:var(--background)] min-h-9">
    <img
      src={icon}
      alt="Pagination"
      className="object-contain self-stretch my-auto w-4 h-4 aspect-square"
    />
  </button>
);
