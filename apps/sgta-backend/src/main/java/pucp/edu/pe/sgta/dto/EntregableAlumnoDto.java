package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntregableAlumnoDto {
    private Integer entregableId;
    private String entregableNombre;
    private String entregableDescripcion;
    private OffsetDateTime entregableFechaInicio;
    private OffsetDateTime entregableFechaFin;
    private String entregableEstado;
    private boolean entregableEsEvaluable;
    private Integer entregableMaximoDocumentos;
    private String entregableExtensionesPermitidas;
    private Integer entregablePesoMaximoDocumento;
    private Integer etapaFormativaId;
    private String etapaFormativaNombre;
    private Integer cicloId;
    private String cicloNombre;
    private Integer cicloAnio;
    private String cicloSemestre;
    private Integer temaId;
    private OffsetDateTime entregableFechaEnvio;
    private String entregableComentario;
    private Integer entregableXTemaId;
    private boolean corregido;
}
