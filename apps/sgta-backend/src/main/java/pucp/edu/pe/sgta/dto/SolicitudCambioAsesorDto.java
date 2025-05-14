package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pucp.edu.pe.sgta.model.AreaConocimiento;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCambioAsesorDto {
    private List<RequestChange> assesorChangeRequests;
    private int totalPages;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestChange {
        private int id;
        private LocalDate registerTime;
        private String status;
        private String reason;
        private String response;
        private LocalDate responseTime;
        private List<Assessor> assessors;
        private Estudiante student;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Assessor {
        private int id;
        private String name;
        private String lastName;
        private String email;
        private byte[] urlPhoto;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Estudiante {
        private int id;
        private String name;
        private String lastName;
        private String email;
        private byte[] urlPhoto;
        private Tema topic;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tema {
        private int id;
        private String name;
        private AreaConocimiento thematicArea;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AreaConocimiento {
        private int id;
        private String name;
    }
}
