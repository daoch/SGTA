package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RechazoSolicitudCambioAsesorResponseDto {
    private Integer idRequest;
    private String response;
    private String status;
    private CambioAsignacionDto assignation;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CambioAsignacionDto {
        private Integer idStudent;
        private Integer idAssessor;
    }
}
