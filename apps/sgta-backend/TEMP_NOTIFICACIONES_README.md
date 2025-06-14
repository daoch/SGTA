# Sistema de Notificaciones Automáticas - HU07

## Descripción General

Este documento describe la implementación del **HU07: Sistema de recordatorios automáticos para entregables** que permite alertar en el tab de reportes de alumnos y asesores sobre los próximos entregables más cercanos, con programación automática cada 7, 3 y 1 día antes de cada fecha prevista.

## Funcionalidades Implementadas

### RF1 - Recordatorios Automáticos
- ✅ **Recordatorios 7 días antes**: Notificación automática una semana antes del vencimiento
- ✅ **Recordatorios 3 días antes**: Notificación automática tres días antes del vencimiento  
- ✅ **Recordatorios 1 día antes**: Notificación automática un día antes del vencimiento
- ✅ **Alertas de vencimiento**: Notificación inmediata cuando un entregable ya venció sin ser entregado

### Características del Sistema
- **Programación automática**: Tareas ejecutadas por Spring Scheduler
- **Prevención de duplicados**: No se generan múltiples notificaciones del mismo tipo en el mismo día
- **Filtrado por rol**: Solo se notifica a usuarios con rol "Tesista"
- **Persistencia**: Todas las notificaciones se almacenan en base de datos
- **API REST**: Endpoints para consultar y gestionar notificaciones desde el frontend

## Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    SCHEDULER                            │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ Recordatorios   │    │ Alertas Vencidos            │ │
│  │ (Diario 08:00)  │    │ (Cada hora)                 │ │
│  └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ NotificacionServiceImpl                             │ │
│  │ - generarRecordatoriosAutomaticos()                 │ │
│  │ - generarAlertasVencidos()                          │ │
│  │ - getUnreadNotifications()                          │ │
│  │ - markAsRead()                                      │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                 REPOSITORY LAYER                        │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ NotificacionRepo│  │ EntregableRepo  │              │
│  │ ModuloRepo      │  │ UsuarioXTemaRepo│              │
│  │ TipoNotifRepo   │  │ UsuarioRepo     │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE                             │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ notificacion    │  │ entregable      │              │
│  │ modulo          │  │ entregable_x_tema│             │
│  │ tipo_notificacion│ │ usuario_tema    │              │
│  │ usuario         │  │ tema            │              │
│  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Configuración de Tareas Programadas

### Recordatorios Diarios
- **Horario**: Todos los días a las 08:00 AM
- **Cron Expression**: `0 0 8 * * *`
- **Función**: Genera recordatorios para entregables que vencen en 7, 3 y 1 día

### Alertas de Vencimiento
- **Horario**: Cada hora en punto
- **Cron Expression**: `0 0 * * * *`
- **Función**: Genera alertas para entregables que ya vencieron sin ser entregados

## API Endpoints

### Notificaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/notifications/unread` | Obtiene todas las notificaciones no leídas del usuario |
| GET | `/api/notifications/all` | **NUEVO** - Obtiene todas las notificaciones (leídas y no leídas) del usuario |
| GET | `/api/notifications/unread/{moduloId}` | Obtiene notificaciones no leídas de un módulo específico |
| GET | `/api/notifications/all/{moduloId}` | **NUEVO** - Obtiene todas las notificaciones de un módulo específico |
| GET | `/api/notifications/count-unread` | Cuenta todas las notificaciones no leídas |
| GET | `/api/notifications/count-unread/{moduloId}` | Cuenta notificaciones no leídas por módulo |
| POST | `/api/notifications/mark-read/{notificacionId}` | Marca una notificación como leída |
| GET | `/api/notifications/overdue-summary` | Obtiene resumen de entregables vencidos |
| POST | `/api/notifications/test/generate-reminders` | Genera recordatorios manualmente (testing) |

### Ejemplos de Respuesta

#### GET `/api/notifications/unread`
```json
[
  {
    "notificacionId": 1,
    "mensaje": "En 3 días vence tu entregable \"Metodología\" (fecha: 25/12/2024).",
    "canal": "UI",
    "fechaCreacion": "2024-12-22T08:00:00Z",
    "fechaLectura": null,
    "activo": true,
    "tipoNotificacion": "recordatorio",
    "prioridad": 2,
    "modulo": "Reportes",
    "usuarioId": 123,
    "nombreUsuario": "Juan Pérez"
  }
]
```

#### GET `/api/notifications/all` *(NUEVO)*
```json
[
  {
    "notificacionId": 1,
    "mensaje": "En 3 días vence tu entregable \"Metodología\" (fecha: 25/12/2024).",
    "canal": "UI",
    "fechaCreacion": "2024-12-22T08:00:00Z",
    "fechaLectura": null,
    "activo": true,
    "tipoNotificacion": "recordatorio",
    "prioridad": 2,
    "modulo": "Reportes",
    "usuarioId": 123,
    "nombreUsuario": "Juan Pérez"
  },
  {
    "notificacionId": 2,
    "mensaje": "Tu entregable \"Estado del Arte\" debió presentarse el 15/12/2024 (5 días de retraso).",
    "canal": "UI",
    "fechaCreacion": "2024-12-20T12:00:00Z",
    "fechaLectura": "2024-12-21T14:30:00Z",
    "activo": true,
    "tipoNotificacion": "error",
    "prioridad": 3,
    "modulo": "Reportes",
    "usuarioId": 123,
    "nombreUsuario": "Juan Pérez"
  }
]
```

#### GET `/api/notifications/overdue-summary`
```json
{
  "total": 2,
  "mensajes": [
    "Tienes 2 entregas con retraso: \"Estado del Arte\" (5 días), \"Marco Teórico\" (2 días)."
  ],
  "entregablesVencidos": [
    {
      "entregableId": 1,
      "nombreEntregable": "Estado del Arte",
      "fechaVencimiento": "15/12/2024",
      "diasAtraso": 5,
      "nombreTema": "Análisis de Sistemas de IA",
      "temaId": 10
    }
  ]
}
```

## Modelos de Datos

### Notificacion
```java
@Entity
@Table(name = "notificacion")
public class Notificacion {
    private Integer id;
    private String mensaje;
    private String canal;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaLectura;
    private Boolean activo;
    private Modulo modulo;
    private TipoNotificacion tipoNotificacion;
    private Usuario usuario;
}
```

### TipoNotificacion
```java
@Entity
@Table(name = "tipo_notificacion")
public class TipoNotificacion {
    private Integer id;
    private String nombre; // "recordatorio", "error", etc.
    private String descripcion;
    private Integer prioridad; // 0-3, mayor número = mayor prioridad
    private Boolean activo;
}
```

## Configuración de Base de Datos

### Script de Inicialización
Ejecutar el script `src/main/resources/sql/init_notificaciones.sql` para crear los datos básicos:

```sql
-- Módulo de Reportes
INSERT INTO modulo (nombre, descripcion, activo)
VALUES ('Reportes', 'Módulo de reportes y estadísticas del sistema', true);

-- Tipos de notificación
INSERT INTO tipo_notificacion (nombre, descripcion, prioridad, activo) VALUES
('informativa', 'Mensaje informativo para el usuario', 0, true),
('advertencia', 'Señal de posible problema o riesgo', 1, true),
('recordatorio', 'Recordatorio de acción pendiente', 2, true),
('error', 'Notificación de error crítico', 3, true);
```

## Lógica de Negocio

### Generación de Recordatorios
1. **Consulta de entregables**: Se buscan entregables que vencen en 7, 3 o 1 día
2. **Filtrado por estado**: Solo se consideran entregables no enviados (`EstadoEntrega.no_enviado`)
3. **Identificación de usuarios**: Se obtienen los tesistas asociados a cada tema
4. **Prevención de duplicados**: Se verifica que no exista ya una notificación del mismo tipo hoy
5. **Creación de notificación**: Se genera la notificación con mensaje personalizado

### Generación de Alertas de Vencimiento
1. **Consulta de vencidos**: Se buscan entregables con fecha de fin anterior a "ahora"
2. **Filtrado por entrega**: Solo entregables no enviados
3. **Cálculo de atraso**: Se calcula los días transcurridos desde el vencimiento
4. **Notificación de error**: Se crea una notificación de tipo "error"

### Prevención de Duplicados
```java
private boolean yaExisteNotificacionHoy(Integer usuarioId, String tipoNotificacion) {
    return notificacionRepository.existsByUsuarioModuloTipoFecha(
        usuarioId, moduloId, tipoNotificacionId, OffsetDateTime.now()
    );
}
```

## Configuración del Proyecto

### Dependencias Requeridas
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- PostgreSQL Driver
- Lombok

### Configuración de Scheduling
```java
@SpringBootApplication
@EnableScheduling  // ← Habilita las tareas programadas
public class SgtaApplication {
    // ...
}
```

### Variables de Entorno
```properties
# Base de datos
DB_URL=jdbc:postgresql://localhost:5432/sgta
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# CORS
CORS_ALLOWED_ORIGIN=http://localhost:3000
```

## Testing y Debugging

### Endpoint de Testing
Para probar el sistema sin esperar a las tareas programadas:
```bash
POST /api/notifications/test/generate-reminders
```

### Logs del Sistema
El sistema genera logs detallados para monitoreo:
```
INFO  - === INICIANDO TAREA PROGRAMADA: Generación de recordatorios diarios ===
INFO  - Encontrados 3 entregables que vencen en 7 días
INFO  - Recordatorio creado para usuario 123 - entregable Metodología (7 días)
INFO  - === COMPLETADA TAREA PROGRAMADA: Generación de recordatorios diarios ===
```

### Verificación en Base de Datos
```sql
-- Ver notificaciones recientes
SELECT n.mensaje, tn.nombre as tipo, u.nombres, n.fecha_creacion
FROM notificacion n
JOIN tipo_notificacion tn ON n.tipo_notificacion_id = tn.tipo_notificacion_id
JOIN usuario u ON n.usuario_id = u.usuario_id
WHERE n.fecha_creacion >= CURRENT_DATE
ORDER BY n.fecha_creacion DESC;

-- Ver entregables próximos a vencer
SELECT e.nombre, e.fecha_fin, 
       EXTRACT(DAY FROM e.fecha_fin - CURRENT_TIMESTAMP) as dias_restantes
FROM entregable e
WHERE e.fecha_fin BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'
AND e.activo = true;
```

## Próximas Mejoras

### Funcionalidades Futuras
- [ ] **Notificaciones por email**: Para notificaciones de prioridad ≥ 2
- [ ] **Notificaciones push**: Para aplicaciones móviles
- [ ] **Configuración personalizada**: Permitir a usuarios configurar frecuencia de recordatorios
- [ ] **Notificaciones para asesores**: Alertas sobre entregables de sus tesistas
- [ ] **Dashboard de notificaciones**: Panel administrativo para gestionar notificaciones

### Optimizaciones
- [ ] **Paginación**: Para listas grandes de notificaciones
- [ ] **Cache**: Para consultas frecuentes de conteo
- [ ] **Batch processing**: Para generación masiva de notificaciones
- [ ] **Métricas**: Monitoreo de rendimiento y efectividad

## Troubleshooting

### Problemas Comunes

#### Las tareas programadas no se ejecutan
- Verificar que `@EnableScheduling` esté presente en la clase principal
- Revisar logs de Spring para errores de configuración
- Verificar zona horaria del servidor

#### No se generan notificaciones
- Verificar que existan datos en las tablas `modulo` y `tipo_notificacion`
- Ejecutar el script de inicialización
- Revisar logs del servicio para errores

#### Errores de autenticación en API
- Verificar configuración de seguridad
- Revisar formato del token JWT
- Verificar que el usuario existe en la base de datos

### Contacto y Soporte
Para dudas o problemas con el sistema de notificaciones, revisar los logs del sistema y consultar esta documentación. 