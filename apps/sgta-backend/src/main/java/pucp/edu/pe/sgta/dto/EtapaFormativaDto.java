package pucp.edu.pe.sgta.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;
import pucp.edu.pe.sgta.util.DurationDeserializer;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EtapaFormativaDto {

    private Integer id;
    private String nombre;
    private BigDecimal creditajePorTema;
    
    @JsonDeserialize(using = DurationDeserializer.class)
    private Duration duracionExposicion;
    
    private Boolean activo;
    // private OffsetDateTime fechaCreacion;
    // private OffsetDateTime fechaModificacion;
    private Integer carreraId;
}
