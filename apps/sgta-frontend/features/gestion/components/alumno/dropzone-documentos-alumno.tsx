import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface DropzoneDocumentosAlumnoProps {
  onFilesChange: (files: File[]) => void;
  accept: string;
  maxFiles: number;
  maxSizeMB: number;
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

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    let newFiles = Array.from(fileList);
    // Filtrar por tamaño y cantidad
    newFiles = newFiles.filter(
      (file) =>
        file.size <= maxSizeMB * 1024 * 1024 &&
        !files.some((f) => f.name === file.name)
    );
    const allFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(allFiles);
    onFilesChange?.(allFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
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
          Máximo {maxFiles} archivos, {maxSizeMB}MB cada uno. <br />
          Tipos permitidos: {accept}
        </p>
      </div>
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