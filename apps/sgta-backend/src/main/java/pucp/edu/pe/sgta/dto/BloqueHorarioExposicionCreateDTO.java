package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloqueHorarioExposicionCreateDTO {

	private Integer id;

	private Integer jornadaExposicionXSalaId;

	private OffsetDateTime datetimeInicio;

	private OffsetDateTime datetimeFin;

}
