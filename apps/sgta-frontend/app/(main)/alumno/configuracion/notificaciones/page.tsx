"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useReminderConfig } from "@/hooks/use-reminder-config";
import { AlertCircle, Bell, Loader2, RotateCcw, Save } from "lucide-react";

export default function NotificacionesPage() {
  const {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    updateAutoReminders,
    saveConfig,
    resetConfig,
  } = useReminderConfig();

  const { toast } = useToast();

  const handleSave = async () => {
    const success = await saveConfig();
    if (success) {
      toast({
        title: "Configuración guardada",
        description: "Tu configuración de notificaciones se ha guardado exitosamente.",
      });
    }
  };

  const handleReset = async () => {
    const success = await resetConfig();
    if (success) {
      toast({
        title: "Configuración restablecida",
        description: "La configuración se ha restablecido a los valores predeterminados.",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando configuración...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Configuración de Notificaciones</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-0">
          Personaliza cómo y cuándo recibir notificaciones sobre tu proyecto de tesis.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4 sm:mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Preferencias de Notificaciones
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Configura tus preferencias para recibir recordatorios y notificaciones importantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Configuración general */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex-1">
                <h4 className="text-sm font-medium">Activar recordatorios automáticos</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Recibe notificaciones antes de cada fecha de entrega
                </p>
              </div>
              <div className="flex justify-end sm:justify-start">
                <Switch
                  checked={settings.autoReminders}
                  onCheckedChange={updateAutoReminders}
                  disabled={saving}
                />
              </div>
            </div>

            <Separator />

            <div className={`space-y-3 ${!settings.autoReminders ? 'opacity-50' : ''}`}>
              <h4 className={`text-sm font-medium ${!settings.autoReminders ? 'text-muted-foreground' : ''}`}>
                Días de anticipación para recordatorios
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seven-days" className="text-sm">7 días antes</Label>
                  <Switch
                    id="seven-days"
                    checked={settings.daysAdvance.sevenDays}
                    onCheckedChange={(checked) => 
                      updateSetting("daysAdvance", "sevenDays", checked)
                    }
                    disabled={saving || !settings.autoReminders}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="three-days" className="text-sm">3 días antes</Label>
                  <Switch
                    id="three-days"
                    checked={settings.daysAdvance.threeDays}
                    onCheckedChange={(checked) => 
                      updateSetting("daysAdvance", "threeDays", checked)
                    }
                    disabled={saving || !settings.autoReminders}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="one-day" className="text-sm">1 día antes</Label>
                  <Switch
                    id="one-day"
                    checked={settings.daysAdvance.oneDay}
                    onCheckedChange={(checked) => 
                      updateSetting("daysAdvance", "oneDay", checked)
                    }
                    disabled={saving || !settings.autoReminders}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="same-day" className="text-sm">El día de la entrega</Label>
                  <Switch
                    id="same-day"
                    checked={settings.daysAdvance.sameDay}
                    onCheckedChange={(checked) => 
                      updateSetting("daysAdvance", "sameDay", checked)
                    }
                    disabled={saving || !settings.autoReminders}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className={`space-y-3 ${!settings.autoReminders ? 'opacity-50' : ''}`}>
              <h4 className={`text-sm font-medium ${!settings.autoReminders ? 'text-muted-foreground' : ''}`}>
                Canales de notificación
              </h4>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
                    <p className="text-xs text-muted-foreground">usuario@pucp.edu.pe</p>
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    <Switch
                      id="email"
                      checked={settings.channels.email}
                      onCheckedChange={(checked) => 
                        updateSetting("channels", "email", checked)
                      }
                      disabled={saving || !settings.autoReminders}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1">
                    <Label htmlFor="system" className="text-sm font-medium">Notificaciones en el sistema</Label>
                    <p className="text-xs text-muted-foreground">Aparecerán en tu dashboard</p>
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    <Switch
                      id="system"
                      checked={settings.channels.system}
                      onCheckedChange={(checked) => 
                        updateSetting("channels", "system", checked)
                      }
                      disabled={saving || !settings.autoReminders}
                    />
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto order-2 sm:order-1"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Restablecer
            </Button>
            
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
