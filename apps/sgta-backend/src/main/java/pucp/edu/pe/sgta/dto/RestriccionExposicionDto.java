package pucp.edu.pe.sgta.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class RestriccionExposicionDto {
    private Integer id;
    private Integer exposicionXTemaId;
    private OffsetDateTime datetimeInicio;
    private OffsetDateTime datetimeFin;
    private boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}
