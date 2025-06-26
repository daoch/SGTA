"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

export interface ExportConfig {
  sections: {
    topics: boolean;
    distribution: boolean;
    performance: boolean;
  };
  content: "tables" | "charts" | "both";
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [config, setConfig] = useState<ExportConfig>({
    sections: {
      topics: true,
      distribution: true,
      performance: true,
    },
    content: "both",
  });

  const handleSectionChange = (section: keyof ExportConfig["sections"], checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: checked,
      },
    }));
  };

  const handleContentChange = (content: ExportConfig["content"]) => {
    setConfig(prev => ({
      ...prev,
      content,
    }));
  };

  const handleExport = () => {
    // Verificar que al menos una sección esté seleccionada
    const hasSelectedSections = Object.values(config.sections).some(Boolean);
    if (!hasSelectedSections) {
      alert("Debes seleccionar al menos una sección para exportar.");
      return;
    }

    onExport(config);
    onClose();
  };

  const selectedSectionsCount = Object.values(config.sections).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Exportar Reporte a Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Secciones a exportar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Secciones a exportar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topics"
                  checked={config.sections.topics}
                  onCheckedChange={(checked) => handleSectionChange("topics", checked as boolean)}
                />
                <Label htmlFor="topics" className="text-sm font-medium">
                  Temas y Áreas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="distribution"
                  checked={config.sections.distribution}
                  onCheckedChange={(checked) => handleSectionChange("distribution", checked as boolean)}
                />
                <Label htmlFor="distribution" className="text-sm font-medium">
                  Distribución de Jurados y Asesores
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performance"
                  checked={config.sections.performance}
                  onCheckedChange={(checked) => handleSectionChange("performance", checked as boolean)}
                />
                <Label htmlFor="performance" className="text-sm font-medium">
                  Desempeño de Asesores
                </Label>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Tipo de contenido */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tipo de contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={config.content} onValueChange={handleContentChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tables" id="tables" />
                  <Label htmlFor="tables" className="text-sm">
                    Solo tablas de datos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="charts" id="charts" />
                  <Label htmlFor="charts" className="text-sm">
                    Solo gráficos embebidos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="text-sm">
                    Tablas y gráficos
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Resumen */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Se exportarán <strong>{selectedSectionsCount}</strong> sección{selectedSectionsCount !== 1 ? "es" : ""} con{" "}
              <strong>
                {config.content === "tables" && "solo tablas"}
                {config.content === "charts" && "solo gráficos embebidos"}
                {config.content === "both" && "tablas y gráficos embebidos"}
              </strong>
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleExport} className="flex-1" disabled={selectedSectionsCount === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 