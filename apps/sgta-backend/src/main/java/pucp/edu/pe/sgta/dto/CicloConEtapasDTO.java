package pucp.edu.pe.sgta.dto;
import lombok.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CicloConEtapasDTO {
    private Integer id;

    private String semestre;

    private Integer anio;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;

    private List<String> etapasFormativas;

    private Integer cantidadEtapas;
}
