package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;

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

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
