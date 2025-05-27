package pucp.edu.pe.sgta.dto;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HitoCronogramaDTO {
    private Integer hitoId;
    private String nombre;
    private String descripcion;
    private ZonedDateTime fechaInicio;
    private ZonedDateTime fechaFin;
    private String entregableEnvioEstado;
    private String entregableActividadEstado;
    private Boolean esEvaluable;
    private Integer temaId;
    private String temaTitulo;
} 