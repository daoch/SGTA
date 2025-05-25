package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListBloqueHorarioExposicionSimpleDTO {

	private String key;

	private String range;

	private Integer idBloque;

	private Integer idJornadaExposicionSala;

	private Integer idExposicion;

	private TemaConAsesorJuradoDTO expo;

	private Boolean esBloqueReservado;

	private Boolean esBloqueBloqueado;

}
