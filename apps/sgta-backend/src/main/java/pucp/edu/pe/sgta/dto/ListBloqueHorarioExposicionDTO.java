package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListBloqueHorarioExposicionDTO {
    private Integer bloqueHorarioExposicionId;
    private Integer jornadaExposicionXSalaId;
    private Integer exposicionXTemaId;
    private Boolean esBloqueReservado;
    private Boolean esBloqueBloqueado;
    private OffsetDateTime datetimeInicio;
    private OffsetDateTime datetimeFin;
    private String salaNombre;
}
