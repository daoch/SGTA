// components/PerfilAsesorCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Linkedin, Mail } from "lucide-react";
import type { Asesor } from "../types/perfil/entidades";

interface Props {
  asesor: Asesor;
  editedData: Asesor;
  isEditing: boolean;
  setEditedData: (data: Asesor) => void;
  avatar?: string;
}

export default function PerfilAsesorCard({
  asesor,
  editedData,
  isEditing,
  setEditedData,
  avatar,
}: Props) {
  const tesisEnProceso = (asesor.tesis ?? []).filter(
    (t) => t.estado === "en_proceso",
  ).length;

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

      <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
        {asesor.disponible ? "Disponible" : "No disponible"}
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
                value={editedData.linkedin ?? "Sin registro"}
                onChange={(e) =>
                  setEditedData({ ...editedData, linkedin: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="repositorio" className="mb-2 block">
              Texto del repositorio
            </Label>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              <Input
                id="repositorio"
                value={
                  editedData.repositorio?.trim()
                    ? editedData.repositorio
                    : "Sin registro"
                }
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
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <a
              href={`mailto:${editedData.email}`}
              className="text-blue-600 hover:underline truncate"
            >
              {editedData.email}
            </a>
          </div>

          {editedData.linkedin ? (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2 text-gray-500" />
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
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <Linkedin className="h-4 w-4 mr-2" />
              <span>No registrado</span>
            </div>
          )}

          {editedData.repositorio?.trim() ? (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-500" />
              <a
                href={editedData.repositorio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {editedData.repositorio.replace("https://", "")}
              </a>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <FileText className="h-4 w-4 mr-2" />
              <span>No registrado</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full bg-gray-200 h-2 rounded-full mt-6">
        <div
          className={`${barraColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${porcentaje * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Tesistas asignados: {tesisEnProceso}/{asesor.limiteTesis}
      </p>
    </div>
  );
}
