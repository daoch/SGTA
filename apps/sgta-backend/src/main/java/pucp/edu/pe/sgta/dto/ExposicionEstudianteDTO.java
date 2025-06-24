package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.dto.exposiciones.MiembroExposicionDto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExposicionEstudianteDTO {
    private Integer estudianteId;
    private Integer exposicionId;
    private Integer temaId;
    private String estado;
    private String linkExposicion;
    private String linkGrabacion;
    private OffsetDateTime datetimeInicio;
    private OffsetDateTime datetimeFin;
    private String sala;
    private String titulo;
    private String etapaFormativa;
    private String ciclo;
    private List<MiembroExposicionDto> miembrosJurado;
    private String tipoExposicion;
    private BigDecimal notaFinal;
}
