package pucp.edu.pe.sgta.dto.temas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudTemaDto {
    private List<SolicitudTemaDto.RequestChange> changeRequests;
    private int totalPages;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestChange {
        private int id;
        private LocalDate registerTime;
        private String status;
        private String reason; // descripcion from Solicitud
        private String response;
        private LocalDate responseTime;
        private boolean solicitudCompletada;
        private boolean aprobado;
        private SolicitudTemaDto.TipoSolicitud tipoSolicitud;
        private SolicitudTemaDto.Usuario usuario;
        private SolicitudTemaDto.Asesor asesor;
        private List<SolicitudTemaDto.Tesista> students;
    }    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TipoSolicitud {
        private int id;
        private String nombre;
        private String descripcion;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Usuario {
        private int id;
        private String nombres;
        private String primerApellido;
        private String segundoApellido;
        private String correoElectronico;
        private String fotoPerfil;
    }
      @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Asesor {
        private int id;
        private String name;
        private String lastName;
        private String email;
        private String status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tesista {
        private int id;
        private String name;
        private String lastName;
        private SolicitudTemaDto.Tema topic;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tema {
        private String name;
    }
}
