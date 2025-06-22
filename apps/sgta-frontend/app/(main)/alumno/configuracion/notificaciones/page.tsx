"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Save } from "lucide-react";
import { useState } from "react";

interface NotificationSettings {
  autoReminders: boolean;
  daysAdvance: {
    sevenDays: boolean;
    threeDays: boolean;
    oneDay: boolean;
    sameDay: boolean;
  };
  channels: {
    email: boolean;
    system: boolean;
    push: boolean;
  };
}

export default function NotificacionesPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    autoReminders: true,
    daysAdvance: {
      sevenDays: true,
      threeDays: true,
      oneDay: true,
      sameDay: true,
    },
    channels: {
      email: true,
      system: true,
      push: false,
    },
  });

  const handleSettingChange = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, boolean>),
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar las configuraciones
    console.log("Configuraciones guardadas:", settings);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuración de Notificaciones</h1>
        <p className="text-muted-foreground">
          Personaliza cómo y cuándo recibir notificaciones sobre tu proyecto de tesis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferencias de Notificaciones
          </CardTitle>
          <CardDescription>
            Configura tus preferencias para recibir recordatorios y notificaciones importantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración general */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Activar recordatorios automáticos</h4>
                <p className="text-xs text-muted-foreground">
                  Recibe notificaciones antes de cada fecha de entrega
                </p>
              </div>
              <Switch
                checked={settings.autoReminders}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoReminders: checked }))
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Días de anticipación para recordatorios</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="seven-days" className="text-sm">7 días antes</Label>
                  <Switch
                    id="seven-days"
                    checked={settings.daysAdvance.sevenDays}
                    onCheckedChange={(checked) => 
                      handleSettingChange("daysAdvance", "sevenDays", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="three-days" className="text-sm">3 días antes</Label>
                  <Switch
                    id="three-days"
                    checked={settings.daysAdvance.threeDays}
                    onCheckedChange={(checked) => 
                      handleSettingChange("daysAdvance", "threeDays", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="one-day" className="text-sm">1 día antes</Label>
                  <Switch
                    id="one-day"
                    checked={settings.daysAdvance.oneDay}
                    onCheckedChange={(checked) => 
                      handleSettingChange("daysAdvance", "oneDay", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="same-day" className="text-sm">El día de la entrega</Label>
                  <Switch
                    id="same-day"
                    checked={settings.daysAdvance.sameDay}
                    onCheckedChange={(checked) => 
                      handleSettingChange("daysAdvance", "sameDay", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Canales de notificación</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
                    <p className="text-xs text-muted-foreground">usuario@pucp.edu.pe</p>
                  </div>
                  <Switch
                    id="email"
                    checked={settings.channels.email}
                    onCheckedChange={(checked) => 
                      handleSettingChange("channels", "email", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system" className="text-sm font-medium">Notificaciones en el sistema</Label>
                    <p className="text-xs text-muted-foreground">Aparecerán en tu dashboard</p>
                  </div>
                  <Switch
                    id="system"
                    checked={settings.channels.system}
                    onCheckedChange={(checked) => 
                      handleSettingChange("channels", "system", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push" className="text-sm font-medium">Notificaciones push (móvil)</Label>
                    <p className="text-xs text-muted-foreground">Si tienes la app instalada</p>
                  </div>
                  <Switch
                    id="push"
                    checked={settings.channels.push}
                    onCheckedChange={(checked) => 
                      handleSettingChange("channels", "push", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
