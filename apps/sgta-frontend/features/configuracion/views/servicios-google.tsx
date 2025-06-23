"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Calendar, Info, Mail, Settings } from "lucide-react";
import { useState } from "react";
export default function ServiciosGoogle() {
    const { idToken } = useAuthStore.getState();
    const [correo, setCorreo] = useState("");
    
      
    const onGuardarConfiguracionClick = (): void => {
        console.log("Correo guardado:", correo);
       
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
        const scope = encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_SCOPE!);
        const currentPath = window.location.pathname;
      
        const stateObj = {
            path: currentPath,
            cognitoId: idToken,
          };
        const state = encodeURIComponent(JSON.stringify(stateObj));
        const authUrl = 
  `https://accounts.google.com/o/oauth2/auth?` +
  `response_type=code&client_id=${clientId}` +
  `&redirect_uri=${redirectUri}` +
  `&scope=${scope}` +
  `&access_type=offline` +
  `&prompt=consent` +
  `&state=${state}` +
  `&login_hint=${encodeURIComponent(correo)}`;
            console.log(authUrl);
            window.location.href = authUrl;
          
      };
      

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Configuración de Servicios de Google</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Configura tu cuenta de Google para enviar correos y gestionar eventos de calendario
          </p>
        </div>

        {/* Main Configuration Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Cuenta de Google
            </CardTitle>
            <CardDescription>
              Ingresa tu correo de Google que se utilizará para todas las funciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>¿Para qué se usa tu correo?</strong>
                <br />• Enviar correos electrónicos desde la aplicación
                <br />• Crear y gestionar eventos en tu Google Calendar
                <br />• Sincronizar datos con tus servicios de Google
              </AlertDescription>
            </Alert>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="google-email" className="text-base font-medium">
                Correo de Google *
              </Label>
              <Input id="google-email" type="email" placeholder="tu-correo@gmail.com" className="text-base" required onChange={(e) => setCorreo(e.target.value)}/>
              <p className="text-sm text-gray-500">
                Este será el correo principal para enviar mensajes y crear eventos
              </p>
            </div>

            {/* Service Options */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium text-gray-900">Servicios a activar:</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-500" />
                    <div>
                      <Label htmlFor="enable-gmail" className="font-medium">
                        Gmail
                      </Label>
                      <p className="text-sm text-gray-600">Enviar correos electrónicos</p>
                    </div>
                  </div>
                 
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="enable-calendar" className="font-medium">
                        Google Calendar
                      </Label>
                      <p className="text-sm text-gray-600">Crear y gestionar eventos</p>
                    </div>
                  </div>
                
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Instrucciones importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                <span>Asegúrate de que el correo ingresado sea una cuenta de Gmail válida</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                <span>Debes tener permisos para enviar correos desde esta cuenta</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                <span>Los eventos de calendario se crearán en el calendario principal de esta cuenta</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-blue-600">4.</span>
                <span>Puedes cambiar esta configuración en cualquier momento</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg">
            Cancelar
          </Button>
          <Button size="lg" className="px-8" onClick={onGuardarConfiguracionClick}>
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
