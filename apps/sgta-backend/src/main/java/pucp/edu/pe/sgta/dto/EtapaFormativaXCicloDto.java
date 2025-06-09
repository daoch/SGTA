package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Data;
import java.math.BigDecimal;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class EtapaFormativaXCicloDto {

    private Integer id;

    private Integer etapaFormativaId;

    private Integer cicloId;

    private Integer carreraId;

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;

    // Información detallada de la etapa formativa
    private String nombreEtapaFormativa;

    private BigDecimal creditajePorTema;

    private String duracionExposicion;

    private String nombreCiclo;
    //private String descripcionEtapaFormativa;
}