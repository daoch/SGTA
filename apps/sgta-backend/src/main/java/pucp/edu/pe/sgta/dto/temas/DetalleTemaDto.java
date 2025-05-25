package pucp.edu.pe.sgta.dto.temas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleTemaDto {

	private List<ParticipanteDto> estudiantes;

	private List<ParticipanteDto> asesores;

	private List<ParticipanteDto> miembrosJurado;

	private List<EtapaFormativaTemaDto> etapasFormativas;

}
