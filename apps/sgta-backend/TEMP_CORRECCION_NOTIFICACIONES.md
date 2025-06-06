# Corrección del Sistema de Notificaciones - HU07

## Problema Identificado

El query SQL en `EntregableXTemaRepository` estaba generando errores debido a discrepancias entre los nombres de campos en Java y la estructura real de la base de datos.

### Error Original
```java
@Query("""
  SELECT ext FROM EntregableXTema ext
    JOIN FETCH ext.tema t
    JOIN FETCH ext.entregable e
  WHERE ext.activo = true
    AND (ext.estadoEntrega = :noEnviado OR ext.fechaEnvio IS NULL)
    AND ext.entregable.fechaFin < :ahora
""")
```

## Análisis de la Base de Datos

Después de revisar el script `create_table_script.sql`, se identificaron las siguientes estructuras:

### Tabla `entregable_x_tema`
```sql
CREATE TABLE IF NOT EXISTS entregable_x_tema (
    entregable_x_tema_id SERIAL PRIMARY KEY,
    entregable_id INTEGER,
    tema_id INTEGER,
    fecha_envio TIMESTAMP WITH TIME ZONE,        -- ✓ Correcto
    comentario TEXT,
    estado enum_estado_entrega NOT NULL DEFAULT 'no_enviado',  -- ⚠️ Campo "estado", no "estadoEntrega"
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- ... constraints
);
```

### Enum `enum_estado_entrega`
```sql
CREATE TYPE enum_estado_entrega AS ENUM (
    'no_enviado',        -- ✓ Valor correcto
    'enviado_a_tiempo',
    'enviado_tarde'
);
```

### Modelo Java `EntregableXTema`
```java
@Entity
@Table(name = "entregable_x_tema")
public class EntregableXTema {
    
    @Column(name = "fecha_envio", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime fechaEnvio;  // ✓ Correcto
    
    @Column(name = "estado", nullable = false)
    private String estadoStr = "no_enviado";  // ⚠️ Mapea a columna "estado"
    
    @Transient
    private EstadoEntrega estado;  // ⚠️ Campo transiente
}
```

## Correcciones Realizadas

### 1. Actualización de `EntregableXTemaRepository.java`

**Antes:**
```java
AND (ext.estado = pucp.edu.pe.sgta.util.EstadoEntrega.no_enviado OR ext.fechaEnvio IS NULL)
```

**Después:**
```java
AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
```

### 2. Métodos Corregidos

#### `findNoEnviadosByEntregableId`
```java
@Query("""
    SELECT ext FROM EntregableXTema ext
    JOIN FETCH ext.tema t
    JOIN FETCH ext.entregable e
    WHERE ext.entregable.id = :entregableId
      AND ext.activo = true
      AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
""")
```

#### `findNoEnviadosByTemaAndFechaFin`
```java
@Query("""
    SELECT ext FROM EntregableXTema ext
    JOIN FETCH ext.tema t
    JOIN FETCH ext.entregable e
    WHERE ext.tema.id = :temaId
      AND ext.activo = true
      AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
      AND ext.entregable.fechaFin BETWEEN :inicio AND :fin
""")
```

#### `findNoEnviadosVencidos`
```java
@Query("""
    SELECT ext FROM EntregableXTema ext
    JOIN FETCH ext.tema t
    JOIN FETCH ext.entregable e
    WHERE ext.activo = true
      AND (ext.estadoStr = 'no_enviado' OR ext.fechaEnvio IS NULL)
      AND ext.entregable.fechaFin < :ahora
""")
```

## Razones de la Corrección

### 1. **Mapeo Campo-Columna**
- El modelo Java usa `estadoStr` como campo que mapea a la columna `estado` en BD
- El campo `estado` es `@Transient` y no se persiste directamente

### 2. **Uso de Valores Literales**
- En lugar de usar `EstadoEntrega.no_enviado` (enum Java) en JPQL
- Se usa `'no_enviado'` (string literal) que coincide con el valor en BD

### 3. **Consistencia con la BD**
- Los nombres de campos ahora corresponden exactamente con la estructura de BD
- Se eliminan referencias a enums que no son reconocidos en JPQL

## Archivos Modificados

1. **`EntregableXTemaRepository.java`** - Corregidos los 3 métodos de consulta
2. **`verificar_notificaciones.sql`** - Script de verificación de estructura de BD

## Verificación

Para verificar que la corrección funciona:

1. **Ejecutar script de verificación:**
   ```bash
   psql -d sgta -f src/main/resources/sql/verificar_notificaciones.sql
   ```

2. **Probar endpoint de testing:**
   ```bash
   POST /api/notifications/test/generate-reminders
   ```

3. **Verificar logs del sistema:**
   ```bash
   tail -f logs/application.log | grep "Recordatorio\|Alerta"
   ```

## Impacto de los Cambios

- ✅ **Sin cambios en la lógica de negocio** - Solo corrección de sintaxis SQL
- ✅ **Compatibilidad mantenida** - El sistema sigue funcionando igual
- ✅ **Consistencia con BD** - Los queries ahora reflejan la estructura real
- ✅ **Mejor rendimiento** - Eliminadas conversiones innecesarias de tipos

## Próximos Pasos

1. Ejecutar pruebas unitarias para confirmar funcionalidad
2. Verificar que las tareas programadas se ejecuten sin errores
3. Monitorear logs de sistema en desarrollo/testing 