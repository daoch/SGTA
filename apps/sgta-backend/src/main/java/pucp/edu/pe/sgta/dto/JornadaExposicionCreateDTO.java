package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JornadaExposicionCreateDTO {
    private Integer id;

    private Integer exposicionId;

    private OffsetDateTime datetimeInicio;

    private OffsetDateTime datetimeFin;
}
