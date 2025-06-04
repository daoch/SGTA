package pucp.edu.pe.sgta.dto;

import lombok.*;

import pucp.edu.pe.sgta.util.TipoDatoEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParametroConfiguracionDto {

	private Integer id;

	private String nombre;

	private String descripcion;

	private Integer moduloId;

	private Boolean activo;

	private TipoDatoEnum tipoDato;

}
