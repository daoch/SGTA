package pucp.edu.pe.sgta.service.imp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.converters.models.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto.AprobarCambioAsesorAsignacionDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto.CambioAsignacionDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto.AsignacionDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.SolicitudRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoXTemaRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.SolicitudService;
import pucp.edu.pe.sgta.service.inter.TemaService;

@Service
public class SolicitudServiceImpl implements SolicitudService {
    private static final Logger log = LoggerFactory.getLogger(SolicitudServiceImpl.class);
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;
    @Autowired
    private UsuarioXTemaRepository usuarioXTemaRepository;
    @Autowired
    private SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;

    @Autowired
    private TemaService temaService;

    public SolicitudCeseDto findAllSolicitudesCese(int page, int size) {
        List<Solicitud> allSolicitudes = solicitudRepository.findByTipoSolicitudNombre("Cese Asesoria");

        int totalElements = allSolicitudes.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);

        if (fromIndex >= totalElements) {
            return new SolicitudCeseDto(Collections.emptyList(), totalPages);
        }

        List<Solicitud> solicitudesPage = allSolicitudes.subList(fromIndex, toIndex);

        List<SolicitudCeseDto.RequestTermination> requestList = solicitudesPage.stream().map(solicitud -> {
            List<UsuarioXSolicitud> relaciones = usuarioXSolicitudRepository.findBySolicitud(solicitud);

            var asesor = relaciones.stream()
                .filter(uxs -> Boolean.FALSE.equals(uxs.getDestinatario()))
                .map(uxs -> uxs.getUsuario())
                .findFirst()
                .map(u -> new SolicitudCeseDto.Assessor(
                    u.getId(),
                    u.getNombres(),
                    u.getPrimerApellido(),
                    u.getCorreoElectronico(),
                    usuarioXTemaRepository.findByUsuarioIdAndRolNombreAndActivoTrue(u.getId(), "asesor").size(),
                    u.getFotoPerfil() // URL foto
                ))
                .orElse(null);
        
            var students = relaciones.stream()
                .filter(uxs -> Boolean.TRUE.equals(uxs.getDestinatario()))
                .map(uxs -> new SolicitudCeseDto.Estudiante(
                    uxs.getUsuario().getId(),
                    uxs.getUsuario().getNombres(),
                    uxs.getUsuario().getPrimerApellido(),
                    new SolicitudCeseDto.Tema(solicitud.getTema().getTitulo())
                ))
                .toList();
        
            String estado = switch (solicitud.getEstado()) {
                case 0 -> "approved";
                case 1 -> "pending";
                case 2 -> "rejected";
                default -> "unknown";
            };
        
            return new SolicitudCeseDto.RequestTermination(
                solicitud.getId(),
                solicitud.getFechaCreacion().toLocalDate(),
                estado,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(), // respuesta
                solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                asesor,
                students
            );
        }).toList();
        
        return new SolicitudCeseDto(requestList, totalPages);
    }

    @Override
    public RechazoSolicitudResponseDto rechazarSolicitud(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));        // Check that the request is in pending status (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type termination (tipoSolicitud.nombre == Cese Asesoria)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cese Asesoria") {
            throw new RuntimeException("Request is not of termination type");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(2); // Rechazado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        List<UsuarioXTema> asesoresActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue( solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> tesistasActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

        List<AsignacionDto> asignaciones = new ArrayList<>();

        for (UsuarioXTema tesista : tesistasActivos) {
            for (UsuarioXTema asesor : asesoresActivos) {
                asignaciones.add(new AsignacionDto(
                        tesista.getUsuario().getId(),
                        asesor.getUsuario().getId()
                ));
            }
        }
        
        RechazoSolicitudResponseDto dto = new RechazoSolicitudResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignations(asignaciones);

        return dto;
    }    @Override
    public AprobarSolicitudResponseDto aprobarSolicitud(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type termination (tipoSolicitud.nombre == Cese Asesoria)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cese Asesoria") {
            throw new RuntimeException("Request is not of termination type");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(0); // Aprobado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);        // Simulate assignments
        List<UsuarioXTema> asesoresActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue( solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> tesistasActivos = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");
        
        List<AprobarAsignacionDto> asignaciones = new ArrayList<>();

        for (UsuarioXTema tesista : tesistasActivos) {
            for (UsuarioXTema asesor : asesoresActivos) {
                asignaciones.add(new AprobarAsignacionDto(
                        tesista.getUsuario().getId(),
                        asesor.getUsuario().getId()
                ));
            }
        }

        for (UsuarioXTema usuarioXTema : asesoresActivos) {
            usuarioXTema.setActivo(false);
            usuarioXTemaRepository.save(usuarioXTema);
        }
        for (UsuarioXTema usuarioXTema : tesistasActivos) {
            usuarioXTema.setActivo(false);
            usuarioXTemaRepository.save(usuarioXTema);
        }

        AprobarSolicitudResponseDto dto = new AprobarSolicitudResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("approved");
        dto.setResponse(response);
        dto.setAssignations(asignaciones);

        return dto;
    }

    public SolicitudCambioAsesorDto findAllSolicitudesCambioAsesor(int page, int size) {
        List<Solicitud> allSolicitudes = solicitudRepository.findByTipoSolicitudNombre("Cambio Asesor");

        int totalElements = allSolicitudes.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);

        if (fromIndex >= totalElements) {
            return new SolicitudCambioAsesorDto(Collections.emptyList(), totalPages);
        }

        List<Solicitud> solicitudesPage = allSolicitudes.subList(fromIndex, toIndex);

        List<SolicitudCambioAsesorDto.RequestChange> requestList = solicitudesPage.stream().map(solicitud -> {
            List<UsuarioXSolicitud> relaciones = usuarioXSolicitudRepository.findBySolicitud(solicitud);

            var asesor = relaciones.stream()
                .filter(uxs -> Boolean.FALSE.equals(uxs.getDestinatario()))
                .map(uxs -> uxs.getUsuario())
                .map(u -> new SolicitudCambioAsesorDto.Assessor(
                    u.getId(),
                    u.getNombres(),
                    u.getPrimerApellido(),
                    u.getCorreoElectronico(),
                    u.getFotoPerfil() // URL foto
                ))
                .toList();
        
            var students = relaciones.stream()
                .filter(uxs -> Boolean.TRUE.equals(uxs.getDestinatario()))
                .findFirst()
                .map(uxs -> new SolicitudCambioAsesorDto.Estudiante(
                    uxs.getUsuario().getId(),
                    uxs.getUsuario().getNombres(),
                    uxs.getUsuario().getPrimerApellido(),
                    uxs.getUsuario().getCorreoElectronico(),
                    uxs.getUsuario().getFotoPerfil(),
                    new SolicitudCambioAsesorDto.Tema(
                        solicitud.getTema().getId(),
                        solicitud.getTema().getTitulo(),
                        new SolicitudCambioAsesorDto.AreaConocimiento(
                            subAreaConocimientoXTemaRepository.findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId()).getSubAreaConocimiento().getId(),
                            subAreaConocimientoXTemaRepository.findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId()).getSubAreaConocimiento().getNombre()
                        ))
                ))
                .orElse(null);
        
            String estado = switch (solicitud.getEstado()) {
                case 0 -> "approved";
                case 1 -> "pending";
                case 2 -> "rejected";
                default -> "unknown";
            };
        
            return new SolicitudCambioAsesorDto.RequestChange(
                solicitud.getId(),
                solicitud.getFechaCreacion().toLocalDate(),
                estado,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(),
                solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                asesor,
                students
            );
        }).toList();
        
        return new SolicitudCambioAsesorDto(requestList, totalPages);
    }
      @Override
    public RechazoSolicitudCambioAsesorResponseDto rechazarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Check that the request is in pending status (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type advisor change (tipoSolicitud.nombre == Cambio Asesor)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cambio Asesor") {
            throw new RuntimeException("Request is not of advisor change type");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(0); // Rechazado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        UsuarioXSolicitud asesor = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud);
        UsuarioXSolicitud tesista = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud);

        CambioAsignacionDto asignacion = new CambioAsignacionDto(
                tesista.getUsuario().getId(),
                asesor.getUsuario().getId()
        );

        
        RechazoSolicitudCambioAsesorResponseDto dto = new RechazoSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignation(asignacion);

        return dto;
    }    @Override
    public AprobarSolicitudCambioAsesorResponseDto aprobarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Check that the request is in pending status (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type advisor change (tipoSolicitud.nombre == Cambio Asesor)
        if (solicitud.getTipoSolicitud() == null || solicitud.getTipoSolicitud().getNombre() != "Cambio Asesor") {
            throw new RuntimeException("Request is not of advisor change type");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(2); // Aprobado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        UsuarioXSolicitud asesor = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud);
        UsuarioXSolicitud tesista = usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud);

        AprobarCambioAsesorAsignacionDto asignacion = new AprobarCambioAsesorAsignacionDto(
                tesista.getUsuario().getId(),
                asesor.getUsuario().getId()
        );

        
        AprobarSolicitudCambioAsesorResponseDto dto = new AprobarSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("approved");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignation(asignacion);

        return dto;
    }    @Override
    public SolicitudTemaDto findAllSolicitudesByTema(Integer temaId, int page, int size) {
        // Calculate offset for pagination
        int offset = page * size;
        
        // Call PostgreSQL function to get solicitudes data
        List<Object[]> solicitudesData = solicitudRepository.findSolicitudesByTemaWithProcedure(temaId, offset, size);
        
        // Get total count for pagination
        Integer totalElements = solicitudRepository.countSolicitudesByTema(temaId);
        int totalPages = (int) Math.ceil((double) totalElements / size);
        
        if (solicitudesData.isEmpty()) {
            return new SolicitudTemaDto(Collections.emptyList(), totalPages);
        }

        List<SolicitudTemaDto.RequestChange> requestList = solicitudesData.stream().map(row -> {
            // Map the database procedure result to our DTO
            // The procedure returns fields in the following order:
            // solicitud_id, fecha_creacion, estado, descripcion, respuesta, fecha_modificacion,
            // tipo_solicitud_id, tipo_solicitud_nombre, tipo_solicitud_descripcion,
            // usuario_id, usuario_nombres, usuario_primer_apellido, usuario_segundo_apellido, 
            // usuario_correo, usuario_foto_perfil
            
            Integer solicitudId = (Integer) row[0];
            java.time.LocalDate fechaCreacion = row[1] != null ? ((java.sql.Date) row[1]).toLocalDate() : null;
            Integer estado = (Integer) row[2];
            String descripcion = (String) row[3];
            String respuesta = (String) row[4];
            java.time.LocalDate fechaModificacion = row[5] != null ? ((java.sql.Date) row[5]).toLocalDate() : null;
              // TipoSolicitud data
            Integer tipoSolicitudId = (Integer) row[6];
            String tipoSolicitudNombre = (String) row[7];
            String tipoSolicitudDescripcion = (String) row[8];
            
            // Usuario data
            Integer usuarioId = (Integer) row[9];
            String usuarioNombres = (String) row[10];
            String usuarioPrimerApellido = (String) row[11];
            String usuarioSegundoApellido = (String) row[12];
            String usuarioCorreo = (String) row[13];
            
            // Map status
            String estadoStr = switch (estado) {
                case 0 -> "approved";
                case 1 -> "pending";
                case 2 -> "rejected";
                default -> "unknown";
            };            // Create DTOs
            var tipoSolicitudDto = new SolicitudTemaDto.TipoSolicitud(
                tipoSolicitudId,
                tipoSolicitudNombre,
                tipoSolicitudDescripcion
            );

            var usuarioDto = new SolicitudTemaDto.Usuario(
                usuarioId,
                usuarioNombres,
                usuarioPrimerApellido,
                usuarioSegundoApellido,
                usuarioCorreo,
                null            );
            
            // In this implementation we're not getting asesor data from the procedure
            // But we can fetch it from another repository call if needed
            SolicitudTemaDto.Asesor asesorDto = null;
            
            // Business logic for solicitudCompletada and aprobado
            boolean solicitudCompletada = determinarSolicitudCompletadaFromData(estado);
            boolean aprobado = determinarAprobadoFromData(estado);            // For students, we could fetch from a separate query or include in the procedure
            // For now, using a simple representation with the current user as the student
            SolicitudTemaDto.Tema tema = new SolicitudTemaDto.Tema("Tema de Tesis", "Resumen del tema"); // This should be replaced with actual topic title and summary
            SolicitudTemaDto.Tesista tesista = new SolicitudTemaDto.Tesista(
                usuarioId,
                usuarioNombres,
                usuarioPrimerApellido,
                tema
            );
            List<SolicitudTemaDto.Tesista> students = Collections.singletonList(tesista);

            return new SolicitudTemaDto.RequestChange(
                solicitudId,
                fechaCreacion,
                estadoStr,
                descripcion,
                respuesta,
                fechaModificacion,
                solicitudCompletada,
                aprobado,
                tipoSolicitudDto,
                usuarioDto,
                asesorDto,
                students
            );
        }).toList();

        return new SolicitudTemaDto(requestList, totalPages);
    }    /**
     * Process a thesis topic request by invoking a database stored procedure.
     * This method extracts the necessary information from the DTO and calls
     * the database procedure to update the topic and request status.
     *
     * @param solicitudAtendida DTO containing the request information
     * @throws RuntimeException if the request is invalid or processing fails
     */    @Override
    @Transactional
    public void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida) {
        if (solicitudAtendida == null || solicitudAtendida.getChangeRequests() == null || solicitudAtendida.getChangeRequests().isEmpty()) {
            throw new RuntimeException("Request doesn't contain valid information");
        }

        for (SolicitudTemaDto.RequestChange requestChange : solicitudAtendida.getChangeRequests()) {
            if (requestChange == null || requestChange.getId() == null) {
                throw new RuntimeException("Invalid request change data");
            }

            // Get the request ID
            Integer solicitudId = requestChange.getId();

            // Get the response message if available
            String response = requestChange.getResponse();

            // Retrieve the full solicitud to determine its type
            Solicitud solicitud = solicitudRepository.findById(solicitudId)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

            // Check if it's in pending status
            if (solicitud.getEstado() != 1) {
                log.error("Request is not in pending status");
                continue;
            }

            // Get the tipo de solicitud to determine if it's a title or summary change request
            String tipoSolicitudNombre = solicitud.getTipoSolicitud().getNombre();

            // Handle the solicitud based on its type
            if ("Solicitud de cambio de título".equals(tipoSolicitudNombre)) {
                // Get title from DTO
                String title = null;
                if (requestChange.getStudents() != null && !requestChange.getStudents().isEmpty() &&
                        requestChange.getStudents().get(0).getTopic() != null) {
                    title = requestChange.getStudents().get(0).getTopic().getTitulo();

                    // Handle empty string
                    if (title != null && title.isEmpty()) {
                        title = null;
                    }
                }

                // Call TemaService to update the title and handle the solicitud
                temaService.updateTituloTemaSolicitud(solicitudId, title, response);

            }

            else if ("Solicitud de cambio de resumen".equals(tipoSolicitudNombre)) {
                // Get summary from DTO
                String summary = null;
                if (requestChange.getStudents() != null && !requestChange.getStudents().isEmpty() &&
                        requestChange.getStudents().get(0).getTopic() != null) {
                    summary = requestChange.getStudents().get(0).getTopic().getResumen();

                    // Handle empty string
                    if (summary != null && summary.isEmpty()) {
                        summary = null;
                    }
                }

                // Call TemaService to update the summary and handle the solicitud
                temaService.updateResumenTemaSolicitud(solicitudId, summary, response);

            } else {
                // For other types of solicitudes, use the general method
                // You can decide what to do here
                log.warn("Unhandled solicitud type: {}", tipoSolicitudNombre);
                throw new RuntimeException("Unsupported request type: " + tipoSolicitudNombre);
            }

            log.info("Processed request {}", solicitudId);
        }


    }

    private boolean determinarSolicitudCompletadaFromData(Integer estado) {
        // Business logic based on procedure data
        return estado == 0 || estado == 2; // approved or rejected
    }    private boolean determinarAprobadoFromData(Integer estado) {
        // Simple implementation for now - approved if status is 0 (approved)
        return estado != null && estado == 0;
    }
}
