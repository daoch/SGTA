"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Jurado, Tema } from "@/features/jurado/types/jurado.types";
import React from "react";

interface Props {
  exposicion: Tema;
}

const CardTemaExposicion: React.FC<Props> = ({ exposicion }) => {
  return (
    <Card>
      <CardHeader className="select-none">
        <CardTitle>
          {exposicion.codigo} - {exposicion.titulo}
        </CardTitle>
        <CardDescription>
          <strong>Asesor :</strong>
          {exposicion?.usuarios
            ?.filter((u) => u.rol?.nombre === "Asesor")
            .map((a) => (
              <p className="ml-4" key={a.idUsario}>
                {a.nombres} {a.apellidos}
              </p>
            ))}
          <br />
          <span className="font-semibold"> Jurados: </span>
          {exposicion?.usuarios
            ?.filter((u) => u.rol?.nombre === "Jurado")
            .map((j) => (
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
