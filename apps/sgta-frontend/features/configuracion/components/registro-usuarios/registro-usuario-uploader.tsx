"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, UploadCloud } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";
import { Usuario } from "./registro-usuario-client";

interface Props {
  onUsuariosCargados: (usuarios: Usuario[]) => void;
}

export function RegistroUsuariosUploader({ onUsuariosCargados }: Props) {
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivoNombre(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Usuario>(sheet);

      const headers = Object.keys(json[0] || {});
      const expected = ["codigo", "correo", "rol", "especialidad"];
      const esValido = expected.every((col) => headers.includes(col));
      if (!esValido) {
        alert("El archivo no tiene el formato correcto. Verifique las columnas.");
        return;
      }

      onUsuariosCargados(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const descargarPlantilla = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        codigo: "12345",
        correo: "usuario@ejemplo.com",
        rol: "estudiante",
        especialidad: "Ingeniería de Software",
      },
      {
        codigo: "67890",
        correo: "asesor@ejemplo.com",
        rol: "asesor",
        especialidad: "Inteligencia Artificial",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "plantilla_usuarios.xlsx");
  };

  return (
    <div className="px-8 py-6">
      <div className="flex items-center gap-2 mt-5 mb-4">
        <Link
          href="/coordinador/configuracion"
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={11} />
        </Link>
        <h1 className="text-2xl font-bold text-[#042354]">
        Registro de Usuarios
        </h1>
      </div>

      {/* Contenido central */}
      <div className="flex flex-col items-center p-8 bg-white border rounded-md shadow-sm">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-6">Importar Usuarios desde CSV</h2>
          <UploadCloud className="mx-auto w-12 h-12 text-gray-400 mb-4" />

          <p className="text-gray-600 mb-2">
            Suba un archivo CSV con el formato:{" "}
            <strong>código, correo, rol y especialidad</strong> para importar múltiples usuarios a la vez.
          </p>

          <div className="flex items-center justify-center mt-4 text-sm text-gray-600 gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span>Formato esperado del CSV:</span>
          </div>

          <pre className="bg-gray-100 border border-gray-300 rounded-md p-4 text-sm mt-2 text-left overflow-x-auto max-w-full">
{`codigo,correo,rol,especialidad
12345,usuario@ejemplo.com,estudiante,Ingeniería de Software
67890,asesor@ejemplo.com,asesor,Inteligencia Artificial`}
          </pre>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex gap-4 items-center">
            <label htmlFor="fileInput" className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-900 text-sm font-medium">
              Seleccionar Archivo CSV
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" onClick={descargarPlantilla}>
              Descargar Plantilla CSV
            </Button>
          </div>

          {archivoNombre && (
            <p className="text-sm text-gray-500">
              Archivo seleccionado: <strong>{archivoNombre}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
