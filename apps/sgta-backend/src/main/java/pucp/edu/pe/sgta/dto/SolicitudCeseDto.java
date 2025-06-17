package pucp.edu.pe.sgta.dto; // Ajusta tu paquete

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCeseDto {
    private List<RequestTermination> requestTermmination;
    private int totalPages;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemaPrincipalDto { // NUEVA CLASE INTERNA o ajusta la existente 'Tema'
        private Integer id; // ID del tema
        private String name; // o titulo
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestTermination {
        private int id;
        private String registerTime;
        private String status;
        private String reason;
        private String response;
        private String responseTime;
        private Assessor assessor;
        private List<Estudiante> students;
        private TemaPrincipalDto tema; // <<--- CAMPO AÑADIDO PARA EL TEMA PRINCIPAL
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Assessor {
        private int id;
        private String name;
        private String lastName;
        private String email;
        private int quantityCurrentProyects;
        private byte[] urlPhoto; // Considera String Base64 o URL
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Estudiante { // El 'topic' aquí puede seguir siendo simple si solo es para display
        private int id;
        private String name;
        private String lastName;
        private TemaAnidadoEnEstudiante topic; // Renombrado para claridad, o usa la clase Tema original
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemaAnidadoEnEstudiante { // Esta es la que tenías como 'Tema'
        private String name; // Solo el nombre para el tema del estudiante
    }
}