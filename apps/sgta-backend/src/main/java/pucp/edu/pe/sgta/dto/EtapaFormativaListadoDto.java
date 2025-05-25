package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtapaFormativaListadoDto {

	private Integer id;

	private String nombre;

	private String carreraNombre;

	private String estado; // EN_CURSO o FINALIZADO

}