package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DistribucionRequestDTO {
    private List<TemaConAsesorJuradoDTO> temas;
    private List<ListBloqueHorarioExposicionSimpleDTO> bloques;
}
