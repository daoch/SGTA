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
        private Integer id;
        private LocalDate registerTime;
        private String status;
        private String reason; // descripcion from Solicitud
        private String response;
        private LocalDate responseTime;
        private Boolean solicitudCompletada;
        private Boolean aprobado;
        private SolicitudTemaDto.TipoSolicitud tipoSolicitud;
        private SolicitudTemaDto.Usuario usuario;
        private SolicitudTemaDto.Asesor asesor;
        private List<SolicitudTemaDto.Tesista> students;
    }    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TipoSolicitud {
        private Integer id;
        private String nombre;
        private String descripcion;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Usuario {
        private Integer id;
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
        private Integer id;
        private String name;
        private String lastName;
        private String email;
        private String status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tesista {
        private Integer id;
        private String name;
        private String lastName;
        private SolicitudTemaDto.Tema topic;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tema {
        private String titulo;
        private String resumen;
        private String objetivos;
    }
}
