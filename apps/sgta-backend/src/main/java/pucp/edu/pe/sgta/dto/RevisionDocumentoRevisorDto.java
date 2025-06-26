package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

public class RevisionDocumentoRevisorDto {
    private Integer id;
    private String titulo;
    private String entregable;
    private String estudiante;
    private String codigo;
    private String curso;
    private OffsetDateTime fechaEntrega;
    private OffsetDateTime fechaLimiteEntrega;
    private OffsetDateTime fechaRevision;
    private OffsetDateTime fechaLimiteRevision;
    private String ultimoCiclo;
    private String estado;
    private String urlDescarga;

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getEntregable() { return entregable; }
    public void setEntregable(String entregable) { this.entregable = entregable; }
    public String getEstudiante() { return estudiante; }
    public void setEstudiante(String estudiante) { this.estudiante = estudiante; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public OffsetDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(OffsetDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }
    public OffsetDateTime getFechaLimiteEntrega() { return fechaLimiteEntrega; }
    public void setFechaLimiteEntrega(OffsetDateTime fechaLimiteEntrega) { this.fechaLimiteEntrega = fechaLimiteEntrega; }
    public OffsetDateTime getFechaRevision() { return fechaRevision; }
    public void setFechaRevision(OffsetDateTime fechaRevision) { this.fechaRevision = fechaRevision; }
    public OffsetDateTime getFechaLimiteRevision() { return fechaLimiteRevision; }
    public void setFechaLimiteRevision(OffsetDateTime fechaLimiteRevision) { this.fechaLimiteRevision = fechaLimiteRevision; }
    public String getUltimoCiclo() { return ultimoCiclo; }
    public void setUltimoCiclo(String ultimoCiclo) { this.ultimoCiclo = ultimoCiclo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getUrlDescarga() { return urlDescarga; }
    public void setUrlDescarga(String urlDescarga) { this.urlDescarga = urlDescarga; }
}
