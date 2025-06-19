package pucp.edu.pe.sgta.dto;

import java.time.LocalDateTime;
import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import java.util.List;

public class EntregableEstudianteDto {
    private String nombreEntregable;
    
    private String estadoEntregable;
    private String estadoXTema;

    private LocalDateTime fechaEnvio;
    private Double nota;
    private Boolean esEvaluable;
    private List<CriterioEntregableDto> criterios;
    private Integer entregableId; 
    private Integer temaId;
    private Integer entregableXTemaId;

    private Integer revisionDocumentoId;
    private String estadoRevision;


    public EntregableEstudianteDto() {
        // Constructor vacío requerido por Jackson
    }

     public EntregableEstudianteDto(
            Integer entregableXTemaId,
            Integer entregableId,
            Integer temaId,
            String nombreEntregable,
            String estadoEntregable,
            String estadoXTema,
            LocalDateTime fechaEnvio,
            Double nota,
            Boolean esEvaluable,
            List<CriterioEntregableDto> criterios,
            Integer revisionDocumentoId,
            String estadoRevision
            
    ) {
        this.entregableXTemaId = entregableXTemaId;
        this.entregableId = entregableId;
        this.temaId = temaId;
        this.nombreEntregable = nombreEntregable;
        this.estadoEntregable = estadoEntregable;
        this.estadoXTema = estadoXTema;
        this.fechaEnvio = fechaEnvio;
        this.nota = nota;
        this.esEvaluable = esEvaluable;
        this.criterios = criterios;
        this.revisionDocumentoId = revisionDocumentoId;
        this.estadoRevision = estadoRevision;
    }

    public String getNombreEntregable() {
        return nombreEntregable;
    }

    public void setNombreEntregable(String nombreEntregable) {
        this.nombreEntregable = nombreEntregable;
    }

    public String getEstadoEntregable() {
        return estadoEntregable;
    }

    public void setEstadoEntregable(String estadoEntregable) {
        this.estadoEntregable = estadoEntregable;
    }

    public String getEstadoXTema() {
        return estadoXTema;
    }

    public void setEstadoXTema(String estadoXTema) {
        this.estadoXTema = estadoXTema;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public Boolean getEsEvaluable() {
        return esEvaluable;
    }

    public void setEsEvaluable(Boolean esEvaluable) {
        this.esEvaluable = esEvaluable;
    }

    public List<CriterioEntregableDto> getCriterios() {
        return criterios;
    }

    public void setCriterios(List<CriterioEntregableDto> criterios) {
        this.criterios = criterios;
    }

    public Integer getEntregableId() {
        return entregableId;
    }

    public void setEntregableId(Integer entregableId) {
        this.entregableId = entregableId;
    }

    public Integer getTemaId() {
        return temaId;
    }

    public void setTemaId(Integer temaId) {
        this.temaId = temaId;
    }

    public Integer getEntregableXTemaId() {
        return entregableXTemaId;
    }

    public void setEntregableXTemaId(Integer entregableXTemaId) {
        this.entregableXTemaId = entregableXTemaId;
    }

    public Integer getRevisionDocumentoId() {
        return revisionDocumentoId;
    }

    public void setRevisionDocumentoId(Integer revisionDocumentoId) {
        this.revisionDocumentoId = revisionDocumentoId;
    }

    public String getEstadoRevision() {
        return estadoRevision;
    }

    public void setEstadoRevision(String estadoRevision) {
        this.estadoRevision = estadoRevision;
    }




}