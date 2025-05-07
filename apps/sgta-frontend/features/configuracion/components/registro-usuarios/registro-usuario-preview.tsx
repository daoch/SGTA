"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Usuario } from "./registro-usuario-client";

interface Props {
  usuarios: Usuario[];
  onCancel: () => void;
  onImport: () => void;
}

export function RegistroUsuariosPreview({ usuarios, onCancel, onImport }: Props) {
  const getBadgeClass = (rol: string) => {
    switch (rol.toLowerCase()) {
      case "estudiante":
        return "bg-blue-100 text-blue-700";
      case "asesor":
        return "bg-green-100 text-green-700";
      case "jurado":
        return "bg-purple-100 text-purple-700";
      case "coordinador":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl px-8 py-6 mx-auto">
      {/* Título principal */}
      <h1 className="text-2xl font-semibold mb-8">Registro de Usuarios</h1>

      {/* Título + botones */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-1">Vista previa de usuarios a importar</h2>
          <p className="text-sm text-muted-foreground">
            Se encontraron {usuarios.length} usuarios válidos en el archivo <code>plantilla_usuarios.csv</code>
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onImport}>Importar Usuarios</Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Especialidad</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u, i) => (
              <TableRow key={i}>
                <TableCell>{u.codigo}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeClass(u.rol)}`}>
                    {capitalize(u.rol)}
                  </span>
                </TableCell>
                <TableCell>{u.especialidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
