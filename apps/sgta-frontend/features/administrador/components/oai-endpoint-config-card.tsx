"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Save, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentOAIEndpoint, updateOAIEndpoint } from "../services/oai-service";

export function OAIEndpointConfigCard() {
  const [currentEndpoint, setCurrentEndpoint] = useState<string>("");
  const [editingEndpoint, setEditingEndpoint] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentEndpoint();
  }, []);

  const fetchCurrentEndpoint = async () => {
    try {
      setIsLoading(true);
      const endpoint = await getCurrentOAIEndpoint();
      setCurrentEndpoint(endpoint);
      setEditingEndpoint(endpoint);
    } catch (error: unknown) {
      console.error('Error fetching OAI endpoint:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración del endpoint OAI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditingEndpoint(currentEndpoint);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingEndpoint(currentEndpoint);
  };

  const handleSave = async () => {
    if (!editingEndpoint.trim()) {
      toast({
        title: "Error",
        description: "El endpoint no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await updateOAIEndpoint(editingEndpoint.trim());
      setCurrentEndpoint(editingEndpoint.trim());
      setIsEditing(false);
      toast({
        title: "Éxito",
        description: "Endpoint OAI actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el endpoint OAI",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingEndpoint(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0F1A3A]">
            <Settings size={20} />
          </div>
          <div className="flex-1">
            <CardTitle>Configuración de Endpoint OAI</CardTitle>
            <CardDescription>
              Configure el endpoint para la integración con el sistema OAI (Open Archives Initiative)
            </CardDescription>
          </div>
        </div>
        <CardAction>
          {!isEditing && (
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Editar
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oai-endpoint">Endpoint OAI</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="oai-endpoint"
                  type="url"
                  value={editingEndpoint}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="https://ejemplo.com/oai/request"
                  className="flex-1"
                  disabled={isSaving}
                />
                <Button
                  onClick={handleSave}
                  size="sm"
                  disabled={isSaving || !editingEndpoint.trim()}
                >
                  <Save size={16} />
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                {isLoading ? (
                  <div className="text-sm text-gray-500">Cargando...</div>
                ) : currentEndpoint ? (
                  <div className="text-sm font-mono break-all">{currentEndpoint}</div>
                ) : (
                  <div className="text-sm text-gray-500 italic">No configurado</div>
                )}
              </div>
            )}
          </div>
          {!isEditing && (
            <div className="text-xs text-gray-500">
              El endpoint OAI se utiliza para importar metadatos y sincronizar información con repositorios externos.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}