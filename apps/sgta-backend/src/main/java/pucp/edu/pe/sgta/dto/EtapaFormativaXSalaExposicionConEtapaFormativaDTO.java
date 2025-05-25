package pucp.edu.pe.sgta.dto;

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
public class EtapaFormativaXSalaExposicionConEtapaFormativaDTO {

	private Integer etapaFormativaXSalaExposicionId;

	private Integer etapaFormativaId;

	private Integer salaExposicionId;

	private String nombreSalaExposicion;

	private String nombreEtapaFormativa;

}
