"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tema } from "@/features/jurado/types/jurado.types";
import React from "react";

interface Props {
  exposicion: Tema;
}

const CardTemaExposicion: React.FC<Props> = ({ exposicion }) => {
  return (
    <Card
      className="border-2 border-gray-300 "
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <CardHeader className="">
        <CardTitle>
          {exposicion.codigo} - {exposicion.titulo}
        </CardTitle>
        <CardDescription className="text-black">
          <span>
            <strong>Asesor :</strong>
            {exposicion?.usuarios
                        ?.filter(u => u.rol?.nombre === "Asesor")
                        .map(a => (
                            <p className="ml-4" key={a.idUsario}>
                            {a.nombres} {a.apellidos}
                            </p>
                        ))}
          </span>
          <br />
          <strong > Jurados: </strong>
          {exposicion?.usuarios
                    ?.filter(u => u.rol?.nombre === "Jurado")
                    .map(j => (
                        <li className="ml-4" key={j.idUsario}>
                         {j.nombres} {j.apellidos}
                        </li>
                        ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CardTemaExposicion;
