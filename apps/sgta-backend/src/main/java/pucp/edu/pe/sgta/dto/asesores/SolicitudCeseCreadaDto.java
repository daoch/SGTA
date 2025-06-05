package pucp.edu.pe.sgta.dto.asesores;

import java.time.OffsetDateTime;

public class SolicitudCeseCreadaDto {

    private Integer id; // ID de la nueva solicitud creada
    private String descripcionMotivo; // El motivo que dio el asesor
    private Integer temaId;
    private String temaTitulo;
    private String estadoSolicitudNombre; // Nombre del estado (ej. "PENDIENTE")
    private OffsetDateTime fechaCreacion;

    // Constructor vacío (útil para algunas librerías de mapeo)
    public SolicitudCeseCreadaDto() {
    }

    // Constructor con todos los campos (opcional, pero útil)
    public SolicitudCeseCreadaDto(Integer id, String descripcionMotivo, Integer temaId, String temaTitulo, String estadoSolicitudNombre, OffsetDateTime fechaCreacion) {
        this.id = id;
        this.descripcionMotivo = descripcionMotivo;
        this.temaId = temaId;
        this.temaTitulo = temaTitulo;
        this.estadoSolicitudNombre = estadoSolicitudNombre;
        this.fechaCreacion = fechaCreacion;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescripcionMotivo() {
        return descripcionMotivo;
    }

    public void setDescripcionMotivo(String descripcionMotivo) {
        this.descripcionMotivo = descripcionMotivo;
    }

    public Integer getTemaId() {
        return temaId;
    }

    public void setTemaId(Integer temaId) {
        this.temaId = temaId;
    }

    public String getTemaTitulo() {
        return temaTitulo;
    }

    public void setTemaTitulo(String temaTitulo) {
        this.temaTitulo = temaTitulo;
    }

    public String getEstadoSolicitudNombre() {
        return estadoSolicitudNombre;
    }

    public void setEstadoSolicitudNombre(String estadoSolicitudNombre) {
        this.estadoSolicitudNombre = estadoSolicitudNombre;
    }

    public OffsetDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(OffsetDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}