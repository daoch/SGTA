package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.Duration;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EtapaFormativaDTO {

    private Integer id;

    private String nombre;

    private BigDecimal creditajePorTema;

    private Duration duracionExposicion;

    private boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
