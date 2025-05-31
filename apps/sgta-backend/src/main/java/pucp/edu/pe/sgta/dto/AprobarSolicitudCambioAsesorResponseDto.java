package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AprobarSolicitudCambioAsesorResponseDto {
    private Integer idRequest;
    private String response;
    private String status;
    private AprobarCambioAsesorAsignacionDto assignation;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AprobarCambioAsesorAsignacionDto {
        private Integer idStudent;
        private Integer idAssessor;
    }
}
