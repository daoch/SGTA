package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListExposicionXCoordinadorDTO {

	private Integer exposicionId;

	private String nombre;

	private String descripcion;

	private Integer etapaFormativaId;

	private String etapaFormativaNombre;

	private Integer cicloId;

	private String cicloNombre;

	private Integer estadoPlanificacionId;

	private String estadoPlanificacionNombre;

}
