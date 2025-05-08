package pucp.edu.pe.sgta.dto;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarreraXParametroConfiguracionDto {

	private Integer id;

	private Object valor;

	private boolean activo;

	private Integer carreraId;

	private ParametroConfiguracionDto parametroConfiguracion;

}
