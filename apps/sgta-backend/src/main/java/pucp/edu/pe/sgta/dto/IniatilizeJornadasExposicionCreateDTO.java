package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IniatilizeJornadasExposicionCreateDTO {
    private Integer etapaFormativaId;
    private Integer exposicionId;
    private List<FechaDto> fechas;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FechaDto {
        private OffsetDateTime fechaHoraInicio;
        private OffsetDateTime fechaHoraFin;
        private List<Integer> salas;
    }
}
