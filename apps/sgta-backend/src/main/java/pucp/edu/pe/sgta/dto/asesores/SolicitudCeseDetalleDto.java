package pucp.edu.pe.sgta.dto.asesores;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCeseDetalleDto { // Similar a tu ICessationRequestDataViewDetailFetched
    private int id;
    private String registerTime; // String ISO 8601
    private String status;       // "pendiente", "aprobada", "rechazada"
    private String reason;
    private String response;     // Respuesta del coordinador
    private String responseTime; // String ISO 8601 o null
    private AssessorDetails assessor;
    private List<EstudianteDetails> students;
    // Puedes añadir más campos específicos del detalle aquí si es necesario

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessorDetails { // Puede ser igual a SolicitudCeseDto.Assessor o tener más campos
        private int id;
        private String name;
        private String lastName;
        private String email;
        private int quantityCurrentProyects;
        private String urlPhoto; // String Base64 o URL
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EstudianteDetails { // Puede ser igual a SolicitudCeseDto.Estudiante o tener más campos
        private int id;
        private String name;
        private String lastName;
        private String code; // Código PUCP del estudiante (ejemplo de campo adicional)
        private String email; // Email del estudiante (ejemplo)
        private TemaDetails topic;
        // private String urlPhoto; // Si tienes foto del estudiante
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemaDetails { // Puede ser igual a SolicitudCeseDto.Tema o tener más campos
        private String name; // Título del tema
        // private String areaConocimiento; // Ejemplo
    }
}
