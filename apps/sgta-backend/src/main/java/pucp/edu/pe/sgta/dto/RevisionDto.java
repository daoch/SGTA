package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevisionDto {

	private String id;

	private String titulo;

	private String estudiante;

	private Integer estudianteId;

	private String codigo;

	private String curso;

	private Integer cursoId;

	private LocalDate fechaEntrega;

	private LocalDate fechaLimite;

	private String estado;

	private Integer porcentajePlagio;

	private Boolean formatoValido;

	private Boolean entregaATiempo;

	private Boolean citadoCorrecto;

	private Integer observaciones;

}