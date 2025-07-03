package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

public class RevisionDocumentoRevisorDto {
    private Integer revisionId;
    private String tema;
    private String entregable;
    private String estudiante;
    private String codigo;
    private String curso;
    private OffsetDateTime fechaCarga;
    private String estadoRevision;
    private Boolean entregaATiempo;
    private OffsetDateTime fechaLimite;
    private OffsetDateTime fechaRevision;
    private String linkArchivo;
    private OffsetDateTime fechaEnvio;
    private OffsetDateTime fechaFin;
    private Integer numeroObservaciones;

    // Getters y setters
    public Integer getRevisionId() { return revisionId; }
    public void setRevisionId(Integer revisionId) { this.revisionId = revisionId; }
    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }
    public String getEntregable() { return entregable; }
    public void setEntregable(String entregable) { this.entregable = entregable; }
    public String getEstudiante() { return estudiante; }
    public void setEstudiante(String estudiante) { this.estudiante = estudiante; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public OffsetDateTime getFechaCarga() { return fechaCarga; }
    public void setFechaCarga(OffsetDateTime fechaCarga) { this.fechaCarga = fechaCarga; }
    public String getEstadoRevision() { return estadoRevision; }
    public void setEstadoRevision(String estadoRevision) { this.estadoRevision = estadoRevision; }
    public Boolean getEntregaATiempo() { return entregaATiempo; }
    public void setEntregaATiempo(Boolean entregaATiempo) { this.entregaATiempo = entregaATiempo; }
    public OffsetDateTime getFechaLimite() { return fechaLimite; }
    public void setFechaLimite(OffsetDateTime fechaLimite) { this.fechaLimite = fechaLimite; }
    public OffsetDateTime getFechaRevision() { return fechaRevision; }
    public void setFechaRevision(OffsetDateTime fechaRevision) { this.fechaRevision = fechaRevision; }
    public String getLinkArchivo() { return linkArchivo; }
    public void setLinkArchivo(String linkArchivo) { this.linkArchivo = linkArchivo; }
    public OffsetDateTime getFechaEnvio() { return fechaEnvio; }
    public void setFechaEnvio(OffsetDateTime fechaEnvio) { this.fechaEnvio = fechaEnvio; }
    public OffsetDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(OffsetDateTime fechaFin) { this.fechaFin = fechaFin; }
    public Integer getNumeroObservaciones() { return numeroObservaciones; }
    public void setNumeroObservaciones(Integer numeroObservaciones) { this.numeroObservaciones = numeroObservaciones; }
}
