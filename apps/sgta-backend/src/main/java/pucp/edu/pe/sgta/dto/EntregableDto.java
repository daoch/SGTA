package pucp.edu.pe.sgta.dto;

import lombok.*;
import pucp.edu.pe.sgta.util.EstadoActividad;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntregableDto {

    private Integer id;
    private Integer etapaFormativaXCicloId;
    private String nombre;
    private String descripcion;
    private OffsetDateTime fechaInicio;
    private OffsetDateTime fechaFin;
    private EstadoActividad estado;
    private boolean esEvaluable;
    private Integer maximoDocumentos;
    private String extensionesPermitidas;
    private Integer pesoMaximoDocumento;
}