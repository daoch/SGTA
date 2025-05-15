package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AprobarSolicitudResponseDto {
    private Integer idRequest;
    private String response;
    private String status;
    private List<AprobarAsignacionDto> assignations;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AprobarAsignacionDto {
        private Integer idStudent;
        private Integer idAssessor;
    }
}
