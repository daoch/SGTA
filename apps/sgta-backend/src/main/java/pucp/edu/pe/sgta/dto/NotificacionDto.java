package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

public class NotificacionDto {
    private Integer id;
    private String mensaje;
    private String canal;
    private OffsetDateTime fechaCreacion; // Mantener como OffsetDateTime para el backend
    private OffsetDateTime fechaLectura;
    private boolean activo; // No es necesario 'getActivo' con Lombok @Getter
    private String moduloNombre;
    private String tipoNotificacionNombre;
    private Integer tipoNotificacionPrioridad; // Añadido
    private String enlaceRedireccion;

    // Constructor, Getters, Setters (Lombok o manuales)
    public NotificacionDto(Integer id, String mensaje, String canal, OffsetDateTime fechaCreacion,
                           OffsetDateTime fechaLectura, boolean activo, String moduloNombre,
                           String tipoNotificacionNombre, Integer tipoNotificacionPrioridad, String enlaceRedireccion) {
        this.id = id;
        this.mensaje = mensaje;
        this.canal = canal;
        this.fechaCreacion = fechaCreacion;
        this.fechaLectura = fechaLectura;
        this.activo = activo;
        this.moduloNombre = moduloNombre;
        this.tipoNotificacionNombre = tipoNotificacionNombre;
        this.tipoNotificacionPrioridad = tipoNotificacionPrioridad;
        this.enlaceRedireccion = enlaceRedireccion;
    }
    // Getters y Setters generados por Lombok o manuales
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public String getCanal() { return canal; }
    public void setCanal(String canal) { this.canal = canal; }
    public OffsetDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(OffsetDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public OffsetDateTime getFechaLectura() { return fechaLectura; }
    public void setFechaLectura(OffsetDateTime fechaLectura) { this.fechaLectura = fechaLectura; }

    public boolean isActivo() { return activo; }

    public void setActivo(boolean activo) { this.activo = activo; }
    public String getModuloNombre() { return moduloNombre; }
    public void setModuloNombre(String moduloNombre) { this.moduloNombre = moduloNombre; }
    public String getTipoNotificacionNombre() { return tipoNotificacionNombre; }
    public void setTipoNotificacionNombre(String tipoNotificacionNombre) { this.tipoNotificacionNombre = tipoNotificacionNombre; }
    public Integer getTipoNotificacionPrioridad() { return tipoNotificacionPrioridad; }
    public void setTipoNotificacionPrioridad(Integer tipoNotificacionPrioridad) { this.tipoNotificacionPrioridad = tipoNotificacionPrioridad; }
    public String getEnlaceRedireccion() { return enlaceRedireccion; }
    public void setEnlaceRedireccion(String enlaceRedireccion) { this.enlaceRedireccion = enlaceRedireccion; }
}