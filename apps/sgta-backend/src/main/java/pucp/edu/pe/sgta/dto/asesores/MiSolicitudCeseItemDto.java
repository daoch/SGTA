package pucp.edu.pe.sgta.dto.asesores;

import java.time.OffsetDateTime;

public class MiSolicitudCeseItemDto {
    private Integer solicitudId;
    private String temaTitulo;
    private OffsetDateTime fechaSolicitud; // fecha_creacion de la solicitud
    private String estadoSolicitud;    // Nombre del estado (PENDIENTE, APROBADA, RECHAZADA)
    private String respuestaCoordinador; // solicitud.respuesta
    private OffsetDateTime fechaDecision;      // solicitud.fecha_resolucion

    // Constructor, Getters, Setters
    public MiSolicitudCeseItemDto(Integer solicitudId, String temaTitulo, OffsetDateTime fechaSolicitud, String estadoSolicitud, String respuestaCoordinador, OffsetDateTime fechaDecision) {
        this.solicitudId = solicitudId;
        this.temaTitulo = temaTitulo;
        this.fechaSolicitud = fechaSolicitud;
        this.estadoSolicitud = estadoSolicitud;
        this.respuestaCoordinador = respuestaCoordinador;
        this.fechaDecision = fechaDecision;
    }

    public Integer getSolicitudId() { return solicitudId; }
    public void setSolicitudId(Integer solicitudId) { this.solicitudId = solicitudId; }
    public String getTemaTitulo() { return temaTitulo; }
    public void setTemaTitulo(String temaTitulo) { this.temaTitulo = temaTitulo; }
    public OffsetDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(OffsetDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public String getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(String estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }
    public String getRespuestaCoordinador() { return respuestaCoordinador; }
    public void setRespuestaCoordinador(String respuestaCoordinador) { this.respuestaCoordinador = respuestaCoordinador; }
    public OffsetDateTime getFechaDecision() { return fechaDecision; }
    public void setFechaDecision(OffsetDateTime fechaDecision) { this.fechaDecision = fechaDecision; }
}
