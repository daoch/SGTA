package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EtapaFormativaDto {

    private Integer id;

    private String nombre;

    private BigDecimal creditajePorTema;

    private String duracionExposicion;

    private Integer carreraId;

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
