package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntregableDto {

    private Integer id;
    private String nombre;
    private String descripcion;
    private OffsetDateTime fechaInicio;
    private OffsetDateTime fechaFin;
    private boolean esEvaluable;

}