package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CicloDto {
    private Integer id;

    private String semestre;

    private Integer anio;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}