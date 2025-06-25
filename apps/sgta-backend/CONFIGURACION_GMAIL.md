# Configuración de Gmail SMTP para Notificaciones por Correo

Este documento explica cómo configurar Gmail SMTP para el envío de notificaciones por correo electrónico en el sistema SGTA.

## Requisitos Previos

1. Una cuenta de Gmail
2. Habilitar la verificación en 2 pasos en tu cuenta de Google
3. Generar una "Contraseña de aplicación" específica para SGTA

## Pasos para Configurar Gmail SMTP

### 1. Habilitar la Verificación en 2 Pasos

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. En el panel izquierdo, selecciona **Seguridad**
3. En la sección "Cómo inicias sesión en Google", selecciona **Verificación en 2 pasos**
4. Sigue los pasos para habilitarla

### 2. Generar una Contraseña de Aplicación

1. En la misma página de Seguridad, busca **Contraseñas de aplicaciones**
2. Selecciona la aplicación: **Correo**
3. Selecciona el dispositivo: **Otro (nombre personalizado)**
4. Escribe: **SGTA Backend**
5. Haz clic en **Generar**
6. **IMPORTANTE**: Copia la contraseña de 16 caracteres que se genera (sin espacios)

### 3. Configurar Variables de Entorno

Agrega las siguientes variables de entorno a tu sistema o archivo `.env`:

```bash
# Configuración Gmail SMTP
GMAIL_USERNAME=tu-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # La contraseña de aplicación generada
APP_URL=http://localhost:3000          # URL de tu frontend
```

**IMPORTANTE**: 
- Usa tu email completo de Gmail como `GMAIL_USERNAME`
- Usa la contraseña de aplicación de 16 caracteres como `GMAIL_APP_PASSWORD` (NO tu contraseña normal de Gmail)

### 4. Configuración en el Servidor de Producción

Para producción, configura las variables de entorno en tu servidor:

```bash
export GMAIL_USERNAME="sistema.sgta@gmail.com"
export GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"
export APP_URL="https://sgta.tudominio.com"
```

## Pruebas

### 1. Endpoint de Prueba

Una vez configurado, puedes probar el envío de correos usando el endpoint:

```http
POST /notifications/test/send-email
Authorization: Bearer {tu-jwt-token}
```

### 2. Verificar Logs

Los logs del sistema mostrarán:
- Éxito: `"Recordatorio enviado por correo a usuario@ejemplo.com para entregable Test"`
- Error: `"Error al enviar recordatorio por correo para usuario X: [detalle del error]"`

## Funcionalidades Implementadas

### 1. Recordatorios Automáticos
- Se envían según la configuración personal de cada usuario
- Horario: Todos los días a las 8:00 AM (configurable en `NotificacionScheduler`)
- Días por defecto: 7, 3, 1 días antes y el día de vencimiento

### 2. Alertas de Vencimiento
- Se envían cada hora para entregables ya vencidos
- Solo si el usuario tiene activado el canal de correo

### 3. Templates HTML
- **Recordatorios**: Diseño azul con información del entregable y días restantes
- **Alertas**: Diseño rojo con advertencia de vencimiento y días de retraso
- Responsive y con estilos profesionales

## Configuración de Usuario

Los usuarios pueden configurar sus preferencias de notificación en:
- `/reminder-config` - Ver configuración actual
- `/reminder-config/default` - Ver configuración por defecto
- `/reminder-config/reset` - Restablecer a valores por defecto

### Opciones Disponibles:
- `activo`: Activar/desactivar recordatorios
- `diasAnticipacion`: Array de días (ej: [7, 3, 1, 0])
- `canalCorreo`: Recibir por correo electrónico
- `canalSistema`: Recibir notificación en el sistema

## Solución de Problemas

### Error: "Authentication failed"
- Verifica que usas la contraseña de aplicación, no la contraseña normal
- Confirma que la verificación en 2 pasos está habilitada

### Error: "Connection refused"
- Verifica la conectividad a internet del servidor
- Confirma que el puerto 587 no esté bloqueado por firewall

### No se envían correos
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs del sistema para errores específicos
- Confirma que el usuario tenga `canalCorreo: true` en su configuración

### Emails en spam
- Configura SPF records en tu dominio
- Considera usar un servicio de email transaccional para producción (SendGrid, AWS SES, etc.)

## Seguridad

- **NUNCA** commitees las credenciales de Gmail al repositorio
- Usa variables de entorno para todas las configuraciones sensibles
- Para producción, considera usar servicios de email transaccional más robustos
- Rota las contraseñas de aplicación regularmente 