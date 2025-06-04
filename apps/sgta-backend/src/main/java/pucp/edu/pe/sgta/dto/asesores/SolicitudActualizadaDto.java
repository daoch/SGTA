package pucp.edu.pe.sgta.dto.asesores;

import java.time.OffsetDateTime;

public class SolicitudActualizadaDto {
    private Integer solicitudId;
    private String nuevoEstadoNombre;
    private String respuestaCoordinador;
    private OffsetDateTime fechaResolucion;

    public SolicitudActualizadaDto(Integer solicitudId, String nuevoEstadoNombre, String respuestaCoordinador, OffsetDateTime fechaResolucion) {
        this.solicitudId = solicitudId;
        this.nuevoEstadoNombre = nuevoEstadoNombre;
        this.respuestaCoordinador = respuestaCoordinador;
        this.fechaResolucion = fechaResolucion;
    }

    public Integer getSolicitudId() {
        return solicitudId;
    }

    public void setSolicitudId(Integer solicitudId) {
        this.solicitudId = solicitudId;
    }

    public String getNuevoEstadoNombre() {
        return nuevoEstadoNombre;
    }

    public void setNuevoEstadoNombre(String nuevoEstadoNombre) {
        this.nuevoEstadoNombre = nuevoEstadoNombre;
    }

    public String getRespuestaCoordinador() {
        return respuestaCoordinador;
    }

    public void setRespuestaCoordinador(String respuestaCoordinador) {
        this.respuestaCoordinador = respuestaCoordinador;
    }

    public OffsetDateTime getFechaResolucion() {
        return fechaResolucion;
    }

    public void setFechaResolucion(OffsetDateTime fechaResolucion) {
        this.fechaResolucion = fechaResolucion;
    }
}
