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

    public EntregableEstudianteDto() {
        // Constructor vacío requerido por Jackson
    }

     public EntregableEstudianteDto(
            String nombreEntregable,
            String estadoEntregable,
            String estadoXTema,
            LocalDateTime fechaEnvio,
            Double nota,
            Boolean esEvaluable,
            List<CriterioEntregableDto> criterios
    ) {
        this.nombreEntregable = nombreEntregable;
        this.estadoEntregable = estadoEntregable;
        this.estadoXTema = estadoXTema;
        this.fechaEnvio = fechaEnvio;
        this.nota = nota;
        this.esEvaluable = esEvaluable;
        this.criterios = criterios;
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

}