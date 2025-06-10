import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DropzoneDocumentosAlumnoProps {
  readonly onFilesChange: (files: File[]) => void;
  readonly accept: string;
  readonly maxFiles: number;
  readonly maxSizeMB: number;
}

export function DropzoneDocumentosAlumno({
  onFilesChange,
  accept,
  maxFiles,
  maxSizeMB,
}: DropzoneDocumentosAlumnoProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getAllowedExtensions = (accept: string) =>
    accept
      ? accept
          .split(",")
          .map((ext) => ext.trim().toLowerCase())
          .filter((ext) => ext.startsWith("."))
      : []; // Si accept es vacío, no filtra por extensión

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
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

    // Filtrar por tamaño solo si hay restricción
    newFiles = newFiles.filter(
      (file) =>
        (!maxSizeMB ||
          maxSizeMB >= 1000 ||
          file.size <= maxSizeMB * 1024 * 1024) &&
        !files.some((f) => f.name === file.name),
    );

    // Limitar cantidad solo si hay restricción
    const allFiles =
      !maxFiles || maxFiles >= 1000
        ? [...files, ...newFiles]
        : [...files, ...newFiles].slice(0, maxFiles);

    setFiles(allFiles);
    onFilesChange?.(allFiles);
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
  };

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
          {files.map((file, idx) => (
            <div
              key={file.name + idx}
              className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
            >
              <span className="truncate text-sm">{file.name}</span>
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
        </div>
      )}
    </div>
  );
}
