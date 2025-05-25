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
public class EtapaFormativaXSalaExposicionDto {

	private Integer id;

	private Integer etapaFormativaId;

	private Integer salaExposicionId;

	private Boolean activo;

	private OffsetDateTime fechaCreacion;

	private OffsetDateTime fechaModificacion;

}
