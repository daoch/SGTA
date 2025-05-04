"use client";

import { useState } from "react";
import { RegistroUsuariosPreview } from "./registro-usuario-preview";
import { RegistroUsuariosUploader } from "./registro-usuario-uploader";

export interface Usuario {
  codigo: string;
  correo: string;
  rol: string;
  especialidad: string;
}

export default function RegistroUsuariosClient() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);

  const handleImport = () => {
    console.log("Importando usuarios:", usuarios);
  };

  return usuarios === null ? (
    <RegistroUsuariosUploader onUsuariosCargados={setUsuarios} />
  ) : (
    <RegistroUsuariosPreview
      usuarios={usuarios}
      onCancel={() => setUsuarios(null)}
      onImport={handleImport}
    />
  );
}
