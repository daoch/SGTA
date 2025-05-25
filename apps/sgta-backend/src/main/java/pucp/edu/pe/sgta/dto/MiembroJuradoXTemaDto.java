package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MiembroJuradoXTemaDto {

	private Integer id;

	private String titulo;

	private String codigo;

	private List<EstudiantesDto> estudiantes;

	private List<SubAreasConocimientoDto> sub_areas_conocimiento;

}
