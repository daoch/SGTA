"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, FileText, Linkedin, Mail } from "lucide-react";
import type { Asesor, Tesis } from "../types/perfil/entidades";
import { ItemCopiable } from "./item-copia";

interface Props {
  asesor: Asesor;
  tesis: Tesis[];
  editedData: Asesor;
  isEditing: boolean;
  setEditedData: (data: Asesor) => void;
  avatar?: string;
}

export default function PerfilAsesorCard({
  asesor,
  tesis,
  editedData,
  isEditing,
  setEditedData,
  avatar,
}: Props) {
  const tesisEnProceso = asesor.tesistasActuales ?? 3;

  const limite = asesor.limiteTesis ?? 0;

  const porcentaje = limite === 0 ? 0 : tesisEnProceso / limite;

  const barraColor =
    porcentaje >= 1
      ? "bg-red-500"
      : porcentaje >= 0.5
        ? "bg-yellow-400"
        : "bg-green-500";

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col items-center space-y-4">
      <Avatar className="w-32 h-32 rounded-lg mb-2">
        <AvatarImage src={avatar} alt={asesor.nombre} />
        <AvatarFallback className="rounded-lg">
          {asesor.nombre
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <h2 className="text-xl font-bold">{asesor?.nombre}</h2>
      <p className="text-gray-600">{asesor?.especialidad}</p>

      <div
        className={`mt-2 px-3 py-1 rounded-full text-sm
        ${asesor.estado ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {asesor.estado ? "Disponible" : "No disponible"}
      </div>

      {isEditing ? (
        <div className="w-full space-y-4 mt-4">
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Correo electrónico
            </Label>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                id="email"
                value={editedData.email}
                onChange={(e) =>
                  setEditedData({ ...editedData, email: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin" className="mb-2 block">
              LinkedIn
            </Label>
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                id="linkedin"
                value={editedData.linkedin ?? ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, linkedin: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="linkedin" className="mb-2 block">
              Enlace a repositorio
            </Label>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                id="repositorio"
                value={editedData.repositorio ?? ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, repositorio: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-2 mt-4">
          <div className="flex items-center gap-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <ItemCopiable
              valor={editedData.email}
              nombre="correo electrónico"
            />
          </div>

          <div className="flex items-center gap-x-2">
            <Linkedin className="h-4 w-4 text-gray-500" />
            {editedData.linkedin ? (
              <a
                href={editedData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {editedData.linkedin.replace(
                  "https://www.linkedin.com/in/",
                  "",
                )}
              </a>
            ) : (
              <span className="text-gray-400">No registrado</span>
            )}
          </div>

          <div className="flex items-center gap-x-2 mt-3">
            <FileText className="h-4 w-4 text-gray-500" />
            {editedData.repositorio?.trim() ? (
              <a
                href={editedData.repositorio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate inline-flex items-center"
              >
                Ver repositorio externo
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            ) : (
              <span className="text-gray-400">No registrado</span>
            )}
          </div>
        </div>
      )}

      <div className="w-full bg-gray-200 h-2 rounded-full mt-6">
        <div
          className={`${barraColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${porcentaje * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-800 mt-1 font-semibold">
        Tesistas asignados: {tesisEnProceso}/{limite}
      </p>
    </div>
  );
}
