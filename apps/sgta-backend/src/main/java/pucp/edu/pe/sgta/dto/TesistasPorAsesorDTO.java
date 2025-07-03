package pucp.edu.pe.sgta.dto;

import java.time.ZonedDateTime;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TesistasPorAsesorDTO {
    private Integer temaId;
    private Integer tesistaId;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;
    private String tituloTema;
    private String etapaFormativaNombre;
    private String carrera;
    private Integer entregableActualId;
    private String entregableActualNombre;
    private String entregableActualDescripcion;
    private ZonedDateTime entregableActualFechaInicio;
    private ZonedDateTime entregableActualFechaFin;
    private String entregableActualEstado;
    private String entregableEnvioEstado;
    private Date entregableEnvioFecha;
    private Double porcentajeEntregablesEnviados;
} 