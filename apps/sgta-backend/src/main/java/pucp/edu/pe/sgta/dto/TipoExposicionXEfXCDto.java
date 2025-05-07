package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoExposicionXEfXCDto {

    private Integer id;

    private Integer etapaFormativaXCicloId;

    private Integer tipoExposicionId;

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
