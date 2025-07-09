import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DocumentoConVersionDto } from "../../dtos/DocumentoConVersionDto";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DropzoneDocumentosAlumnoProps {
  readonly onFilesChange: (files: File[]) => void;
  readonly accept: string;
  readonly maxFiles: number;
  readonly maxSizeMB: number;
  readonly archivosSubidos?: DocumentoConVersionDto[];
  readonly documentoPrincipalNombre?: string | null;
  readonly setDocumentoPrincipalNombre?: (nombre: string) => void;
}

export function DropzoneDocumentosAlumno({
  onFilesChange,
  accept,
  maxFiles,
  maxSizeMB,
  archivosSubidos,
  documentoPrincipalNombre,
  setDocumentoPrincipalNombre,
}: DropzoneDocumentosAlumnoProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sincroniza archivos locales si archivosSubidos cambia (por ejemplo, tras eliminar)
  useEffect(() => {
    if (archivosSubidos) {
      const nombresSubidos = archivosSubidos.map((f) =>
        f.documentoNombre.toLowerCase(),
      );
      // Elimina de files los archivos que ya no están en archivosSubidos
      const nuevosFiles = files.filter(
        (f) => !nombresSubidos.includes(f.name.toLowerCase()),
      );
      if (nuevosFiles.length !== files.length) {
        setFiles(nuevosFiles);
        onFilesChange?.(nuevosFiles);
      }
      // Además, si archivosSubidos se vacía, limpia files
      if (archivosSubidos.length === 0 && files.length > 0) {
        setFiles([]);
        onFilesChange?.([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archivosSubidos]);

  const getAllowedExtensions = (accept: string) =>
    accept
      ? accept
          .split(",")
          .map((ext) => ext.trim().toLowerCase())
          .filter((ext) => ext.startsWith("."))
      : []; // Si accept es vacío, no filtra por extensión

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setErrorMsg(null);

    const allowedExtensions = getAllowedExtensions(accept);
    let newFiles = Array.from(fileList);

    // Validar extensiones solo si hay restricciones
    if (allowedExtensions.length > 0) {
      newFiles = newFiles.filter((file) => {
        const ext = file.name
          .substring(file.name.lastIndexOf("."))
          .toLowerCase();
        return allowedExtensions.includes(ext);
      });
    }

    // Obtener nombres de archivos ya subidos y en espera de subir
    const nombresExistentes = [
      ...files.map((f) => f.name.toLowerCase()),
      ...(archivosSubidos?.map((f) => f.documentoNombre.toLowerCase()) ?? []),
    ];

    // Verificar duplicados
    for (const file of newFiles) {
      if (nombresExistentes.includes(file.name.toLowerCase())) {
        setErrorMsg(
          `No se puede subir el archivo ${file.name}, primero debe borrar el archivo subido con el mismo nombre`,
        );
        return;
      }
    }

    // Filtrar por tamaño solo si hay restricción
    newFiles = newFiles.filter(
      (file) =>
        !maxSizeMB || maxSizeMB >= 1000 || file.size <= maxSizeMB * 1024 * 1024,
    );

    // Limitar cantidad solo si hay restricción
    const allFiles =
      !maxFiles || maxFiles >= 1000
        ? [...files, ...newFiles]
        : [...files, ...newFiles].slice(0, maxFiles);

    setFiles(allFiles);
    onFilesChange?.(allFiles);

    if (
      setDocumentoPrincipalNombre &&
      (!documentoPrincipalNombre ||
        !allFiles.some((f) => f.name === documentoPrincipalNombre)) &&
      allFiles.length > 0
    ) {
      setDocumentoPrincipalNombre(allFiles[0].name);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
    if (inputRef.current) inputRef.current.value = "";
  };

  const existePrincipal =
    archivosSubidos?.some((a) => a.documentoPrincipal) ?? false;

  return (
    <div>
      <button
        type="button"
        className={`w-full border-2 border-dashed rounded-md p-6 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: "pointer" }}
        aria-label="Seleccionar archivos"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="font-semibold mb-2">
          Arrastra y suelta archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-muted-foreground">
          {maxFiles >= 1000 && maxSizeMB >= 1000 ? (
            <>
              Puede subir cualquier cantidad y tamaño de archivos.
              <br />
              {accept
                ? `Tipos permitidos: ${accept}`
                : "Se permiten todos los tipos de archivo."}
            </>
          ) : (
            <>
              Por favor, seleccione
              {maxFiles < 1000 &&
                ` hasta ${maxFiles} archivo${maxFiles > 1 ? "s" : ""}`}
              {maxSizeMB < 1000 && `, máximo ${maxSizeMB}MB por cada archivo`}
              .
              <br />
              {accept
                ? `Tipos permitidos: ${accept}`
                : "Se permiten todos los tipos de archivo."}
            </>
          )}
        </p>
      </button>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {!existePrincipal && setDocumentoPrincipalNombre ? (
            <>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Por favor seleccione el documento principal <br />
                <span className="font-normal text-xs text-gray-500">
                  (Será sometido a pruebas de
                  similitud, los documentos adicionales serán tratados como anexos)
                </span>
              </div>
              <RadioGroup
                value={documentoPrincipalNombre ?? ""}
                onValueChange={setDocumentoPrincipalNombre}
                className="space-y-2"
              >
                {files.map((file, idx) => (
                  <div
                    key={file.name + idx}
                    className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value={file.name}
                        id={`principal-${file.name}-${idx}`}
                        aria-label="Marcar como documento principal"
                      />
                      <span className="truncate text-sm">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(idx);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>
            </>
          ) : (
            files.map((file, idx) => (
              <div
                key={file.name + idx}
                className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm">{file.name}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      )}
      {errorMsg && (
        <div className="text-sm text-red-600 font-medium py-2">{errorMsg}</div>
      )}
    </div>
  );
}
