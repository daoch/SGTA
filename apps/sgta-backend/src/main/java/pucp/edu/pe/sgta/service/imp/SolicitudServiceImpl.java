package pucp.edu.pe.sgta.service.imp;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto.AprobarCambioAsesorAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto.CambioAsignacionDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto.AsignacionDto;
import pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.SolicitudService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.util.*;

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
    private EstadoTemaRepository estadoTemaRepository;
    @Autowired
    private TemaRepository temaRepository;
    @Autowired
    private UsuarioXCarreraRepository usuarioXCarreraRepository;
    @Autowired
    private TemaService temaService;
    @Autowired
    private TipoSolicitudRepository tipoSolicitudRepository;
    @Autowired
    private UsuarioXCarreraRepository usuarioCarreraRepository;
    @Autowired
    private AccionSolicitudRepository accionSolicitudRepository;
    @Autowired
    private RolSolicitudRepository rolSolicitudRepository;
    @Autowired
    private EstadoSolicitudRepository estadoSolicitudRepository;
    @Autowired
    private UsuarioXRolRepository usuarioXRolRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private UsuarioServiceImpl usuarioServiceImpl;

    public SolicitudCeseDto findAllSolicitudesCese(int coordinatorId, int page, int size) {
        List<UsuarioXCarrera> coordinadorCarreras = usuarioXCarreraRepository
                .findByUsuarioIdAndActivoTrue(coordinatorId);
        List<Carrera> carreras = new ArrayList<>();
        for (UsuarioXCarrera coordinadorCarrera : coordinadorCarreras) {
            Carrera carrera = coordinadorCarrera.getCarrera();
            carreras.add(carrera);
        }
        List<Solicitud> allSolicitudes = solicitudRepository.findByTipoSolicitudNombre("Cese Asesoria");

        List<Solicitud> allSolicitudesCarrera = new ArrayList<>();

        for (Solicitud solicitud : allSolicitudes) {
            for (Carrera carrera : carreras) {
                if (solicitud.getTema().getCarrera().getId() == carrera.getId()) {
                    allSolicitudesCarrera.add(solicitud);
                }
            }
        }

        int totalElements = allSolicitudesCarrera.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);

        if (fromIndex >= totalElements) {
            return new SolicitudCeseDto(Collections.emptyList(), totalPages);
        }

        List<Solicitud> solicitudesPage = allSolicitudesCarrera.subList(fromIndex, toIndex);

        List<SolicitudCeseDto.RequestTermination> requestList = solicitudesPage.stream().map(solicitud -> {
            UsuarioXTema asesorRelacion = usuarioXTemaRepository
                    .findFirstByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Asesor");
            List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository
                    .findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

            var asesor = new SolicitudCeseDto.Assessor(
                    asesorRelacion.getUsuario().getId(),
                    asesorRelacion.getUsuario().getNombres(),
                    asesorRelacion.getUsuario().getPrimerApellido(),
                    asesorRelacion.getUsuario().getCorreoElectronico(),
                    usuarioXTemaRepository
                            .findByUsuarioIdAndRolNombreAndActivoTrue(asesorRelacion.getUsuario().getId(), "Asesor")
                            .size(),
                    asesorRelacion.getUsuario().getFotoPerfil() // URL foto
            );

            List<SolicitudCeseDto.Estudiante> students = new ArrayList<>();

            for (UsuarioXTema estudianteRelacion : estudiantesRelacion) {
                students.add(new SolicitudCeseDto.Estudiante(
                        estudianteRelacion.getUsuario().getId(),
                        estudianteRelacion.getUsuario().getNombres(),
                        estudianteRelacion.getUsuario().getPrimerApellido(),
                        new SolicitudCeseDto.Tema(solicitud.getTema().getTitulo())));
            }

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
                    students);
        }).toList();

        return new SolicitudCeseDto(requestList, totalPages);
    }

    @Override
    public DetalleSolicitudCeseDto getDetalleSolicitudCese(Integer solicitudId) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        UsuarioXTema asesorRelacion = usuarioXTemaRepository
                .findFirstByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository
                .findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

        var asesor = new DetalleSolicitudCeseDto.Assessor(
                asesorRelacion.getUsuario().getId(),
                asesorRelacion.getUsuario().getNombres(),
                asesorRelacion.getUsuario().getPrimerApellido(),
                asesorRelacion.getUsuario().getCorreoElectronico(),
                usuarioXTemaRepository
                        .findByUsuarioIdAndRolNombreAndActivoTrue(asesorRelacion.getUsuario().getId(), "asesor").size(),
                asesorRelacion.getUsuario().getFotoPerfil() // URL foto
        );

        List<DetalleSolicitudCeseDto.Estudiante> students = new ArrayList<>();

        for (UsuarioXTema estudianteRelacion : estudiantesRelacion) {
            students.add(new DetalleSolicitudCeseDto.Estudiante(
                    estudianteRelacion.getUsuario().getId(),
                    estudianteRelacion.getUsuario().getNombres(),
                    estudianteRelacion.getUsuario().getPrimerApellido(),
                    estudianteRelacion.getUsuario().getCorreoElectronico(),
                    estudianteRelacion.getUsuario().getFotoPerfil(),
                    new DetalleSolicitudCeseDto.Tema(solicitud.getTema().getTitulo())));
        }

        String estado = switch (solicitud.getEstado()) {
            case 0 -> "approved";
            case 1 -> "pending";
            case 2 -> "rejected";
            default -> "unknown";
        };

        return new DetalleSolicitudCeseDto(
                solicitud.getId(),
                solicitud.getFechaCreacion().toLocalDate(),
                estado,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(), // respuesta
                solicitud.getFechaModificacion() != null ? solicitud.getFechaModificacion().toLocalDate() : null,
                asesor,
                students);

    }

    @Override
    public RechazoSolicitudResponseDto rechazarSolicitud(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada")); // Check that the request is in
                                                                                     // pending status (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type termination (tipoSolicitud.nombre == Cese
        // Asesoria)
        if (solicitud.getTipoSolicitud() == null
                || !solicitud.getTipoSolicitud().getNombre().equalsIgnoreCase("Cese Asesoria")) {
            throw new RuntimeException("Request is not of termination type");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(2); // Rechazado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud);

        List<UsuarioXTema> asesoresActivos = usuarioXTemaRepository
                .findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> tesistasActivos = usuarioXTemaRepository
                .findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

        List<AsignacionDto> asignaciones = new ArrayList<>();

        for (UsuarioXTema tesista : tesistasActivos) {
            for (UsuarioXTema asesor : asesoresActivos) {
                asignaciones.add(new AsignacionDto(
                        tesista.getUsuario().getId(),
                        asesor.getUsuario().getId()));
            }
        }

        RechazoSolicitudResponseDto dto = new RechazoSolicitudResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignations(asignaciones);

        return dto;
    }

    @Override
    public AprobarSolicitudResponseDto aprobarSolicitud(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type termination (tipoSolicitud.nombre == Cese
        // Asesoria)
        if (solicitud.getTipoSolicitud() == null
                || !solicitud.getTipoSolicitud().getNombre().equalsIgnoreCase("Cese Asesoria")) {
            throw new RuntimeException("Request is not of termination type");
        }

        solicitud.setRespuesta(response);
        solicitud.setEstado(0); // Aprobado
        solicitud.setFechaModificacion(OffsetDateTime.now());
        solicitudRepository.save(solicitud); // Simulate assignments
        List<UsuarioXTema> asesoresActivos = usuarioXTemaRepository
                .findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Asesor");
        List<UsuarioXTema> tesistasActivos = usuarioXTemaRepository
                .findByTemaIdAndRolNombreAndActivoTrue(solicitud.getTema().getId(), "Tesista");

        List<AprobarAsignacionDto> asignaciones = new ArrayList<>();

        for (UsuarioXTema tesista : tesistasActivos) {
            for (UsuarioXTema asesor : asesoresActivos) {
                asignaciones.add(new AprobarAsignacionDto(
                        tesista.getUsuario().getId(),
                        asesor.getUsuario().getId()));
            }
        }

        for (UsuarioXTema usuarioXTema : asesoresActivos) {
            // usuarioXTema.setActivo(false);
            usuarioXTemaRepository.save(usuarioXTema);
        }
        for (UsuarioXTema usuarioXTema : tesistasActivos) {
            Tema tema = usuarioXTema.getTema();
            EstadoTema estadoTema = estadoTemaRepository.findByNombre("PAUSADO")
                    .orElseThrow(() -> new RuntimeException("EstadoTema '" + "PAUSADO" + "' no encontrado"));
            ;
            tema.setEstadoTema(estadoTema);
            temaRepository.save(tema);
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
                                            subAreaConocimientoXTemaRepository
                                                    .findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId())
                                                    .getSubAreaConocimiento().getId(),
                                            subAreaConocimientoXTemaRepository
                                                    .findFirstByTemaIdAndActivoTrue(solicitud.getTema().getId())
                                                    .getSubAreaConocimiento().getNombre()))))
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
                    students);
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

        // Check that the request is of type advisor change (tipoSolicitud.nombre ==
        // Cambio Asesor)
        if (solicitud.getTipoSolicitud() == null
                || !solicitud.getTipoSolicitud().getNombre().equalsIgnoreCase("Cambio Asesor")) {
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
                asesor.getUsuario().getId());

        RechazoSolicitudCambioAsesorResponseDto dto = new RechazoSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("rejected");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignation(asignacion);

        return dto;
    }

    @Override
    public AprobarSolicitudCambioAsesorResponseDto aprobarSolicitudCambioAsesor(Integer solicitudId, String response) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Check that the request is in pending status (1)
        if (solicitud.getEstado() != 1) {
            throw new RuntimeException("Request is not in pending status");
        }

        // Check that the request is of type advisor change (tipoSolicitud.nombre ==
        // Cambio Asesor)
        if (solicitud.getTipoSolicitud() == null
                || !solicitud.getTipoSolicitud().getNombre().equalsIgnoreCase("Cambio Asesor")) {
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
                asesor.getUsuario().getId());

        AprobarSolicitudCambioAsesorResponseDto dto = new AprobarSolicitudCambioAsesorResponseDto();
        dto.setIdRequest(solicitud.getId());
        dto.setStatus("approved");
        dto.setResponse(response); // se usa lo que viene del request
        dto.setAssignation(asignacion);

        return dto;
    }

    @Override
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
            // solicitud_id, fecha_creacion, estado, descripcion, respuesta,
            // fecha_modificacion,
            // tipo_solicitud_id, tipo_solicitud_nombre, tipo_solicitud_descripcion,
            // usuario_id, usuario_nombres, usuario_primer_apellido,
            // usuario_segundo_apellido,
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
            }; // Create DTOs
            var tipoSolicitudDto = new SolicitudTemaDto.TipoSolicitud(
                    tipoSolicitudId,
                    tipoSolicitudNombre,
                    tipoSolicitudDescripcion);

            var usuarioDto = new SolicitudTemaDto.Usuario(
                    usuarioId,
                    usuarioNombres,
                    usuarioPrimerApellido,
                    usuarioSegundoApellido,
                    usuarioCorreo,
                    null);

            // In this implementation we're not getting asesor data from the procedure
            // But we can fetch it from another repository call if needed
            SolicitudTemaDto.Asesor asesorDto = null;

            // Business logic for solicitudCompletada and aprobado
            boolean solicitudCompletada = (Boolean) row[14];
            boolean aprobado = determinarAprobadoFromData(estado); // For students, we could fetch from a separate query
                                                                   // or include in the procedure
            // For now, using a simple representation with the current user as the student
            SolicitudTemaDto.Tema tema = new SolicitudTemaDto.Tema("Tema de Tesis", "Resumen del tema"); // This should
                                                                                                         // be replaced
                                                                                                         // with actual
                                                                                                         // topic title
                                                                                                         // and summary
            SolicitudTemaDto.Tesista tesista = new SolicitudTemaDto.Tesista(
                    usuarioId,
                    usuarioNombres,
                    usuarioPrimerApellido,
                    tema);
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
                    students);
        }).toList();

        return new SolicitudTemaDto(requestList, totalPages);
    }

    /**
     * Process a thesis topic request by invoking a database stored procedure.
     * This method extracts the necessary information from the DTO and calls
     * the database procedure to update the topic and request status.
     *
     * @param solicitudAtendida DTO containing the request information
     * @throws RuntimeException if the request is invalid or processing fails
     */
    @Override
    @Transactional
    public void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida) {
        if (solicitudAtendida == null || solicitudAtendida.getChangeRequests() == null
                || solicitudAtendida.getChangeRequests().isEmpty()) {
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

            // Get the tipo de solicitud to determine if it's a title or summary change
            // request
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

    @Transactional
    @Override
    public pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto registrarSolicitudCambioAsesor(
            pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud) {
        //validar que no se cambie un asesor por el mismo
        if(Objects.equals(solicitud.getAsesorActualId(), solicitud.getNuevoAsesorId()))
            throw new RuntimeException("El asesor a cambiar no puede ser igual al asesor actual");
        if (!validarExistenEstadosAccionesRoles())
            throw new RuntimeException("Faltan registrar estados, roles o acciones");
        boolean validacion;
        // Validar que el tema exista y se pueda cambiar de asesor 'INSCRITO', 'REGISTRADO', 'EN_PROGRESO', 'PAUSADO'
        validacion = Utils.validarTrueOrFalseDeQuery(
                temaRepository.validarTemaExisteYSePuedeCambiarAsesor(solicitud.getTemaId()));
        if (!validacion)
            throw new RuntimeException("Tema no valido para cambio de asesor");
        // Validar los roles de los otros asesores
        validacion = (Utils
                .validarTrueOrFalseDeQuery(usuarioXRolRepository.esProfesorAsesor(solicitud.getNuevoAsesorId()))
                && Utils.validarTrueOrFalseDeQuery(
                        usuarioXRolRepository.esProfesorAsesor(solicitud.getAsesorActualId())));
        if (!validacion)
            throw new RuntimeException("Asesor elegido no valido para cambio de asesor");

        //Ya no validamos el alumno, cómo es él quien llama al api, es una validación previa

        //Ya no se obtiene el usuario del coordinador, cómo pueden haber varios coordinadores le puede llegar a cualquiera
        //Cambiando validación a obtenerIdCoordinadorPorUsuario -> obtenerCantidadDeCoordinadoresPorUsuario
        int cantidad = (int) usuarioRepository.obtenerCantidadDeCoordinadoresPorUsuario(solicitud.getAlumnoId()).get(0)[0];
        if (cantidad == 0)
            throw new RuntimeException(
                    "No se han registrado Coordinadores para la carrera del alumno" + solicitud.getAlumnoId());
        // Tipo Solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
                .findByNombre("Cambio de asesor (por asesor)")
                .orElseThrow(
                        () -> new RuntimeException("Tipo de solicitud no configurado: Cambio de asesor (por asesor)"));
        // Estado solicitud
        EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
                .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
                .orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));

        // Tema
        Tema tema = temaRepository
                .findById(solicitud.getTemaId())
                .orElseThrow(() -> new RuntimeException("Tema no encontrado"));

        // Solicitud
        Solicitud nuevaSolicitud = new Solicitud();
        nuevaSolicitud.setDescripcion(solicitud.getMotivo());
        nuevaSolicitud.setTipoSolicitud(tipoSolicitud);
        nuevaSolicitud.setTema(tema);
        nuevaSolicitud.setEstadoSolicitud(estadoSolicitud);
        nuevaSolicitud.setFechaCreacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        solicitudRepository.save(nuevaSolicitud);

        // Llenamos el idSolicitud
        solicitud.setSolicitudId(nuevaSolicitud.getId());

        // Tabla UsuarioSolicitud
            //Primero los usuarios
        Usuario alumno = usuarioServiceImpl.buscarUsuarioPorId(solicitud.getAlumnoId(), "Alumno no encontrado");
        Usuario asesorActual = usuarioServiceImpl.buscarUsuarioPorId(solicitud.getAsesorActualId(), "Asesor actual no encontrado");
        Usuario asesorNuevo = usuarioServiceImpl.buscarUsuarioPorId(solicitud.getNuevoAsesorId(), "Asesor entrante no encontrado");
            //Luego las acciones
        AccionSolicitud accionPendiente = buscarPorNombreAccion(AccionSolicitudEnum.PENDIENTE_ACCION, "Accion pendiente_aprobacion no encontrado");
        AccionSolicitud sinAccion = buscarPorNombreAccion(AccionSolicitudEnum.SIN_ACCION, "Accion sin_accion no encontrado");
            //Luego los roles
        RolSolicitud rolRemitente = buscarPorNombreRol(RolSolicitudEnum.REMITENTE, "Rol remitente no encontrado");
        RolSolicitud rolAsesorEntrada = buscarPorNombreRol(RolSolicitudEnum.ASESOR_ENTRADA, "Rol asesor_entrada no encontrado");
        RolSolicitud rolAsesorActual = buscarPorNombreRol(RolSolicitudEnum.ASESOR_ACTUAL, "Rol asesor_actual no encontrado");
        //Vamos a registrar a las personas involucradas
        UsuarioXSolicitud nuevoRemitente = new UsuarioXSolicitud();
        nuevoRemitente.setUsuario(alumno);
        nuevoRemitente.setSolicitud(nuevaSolicitud);
        nuevoRemitente.setAccionSolicitud(sinAccion);
        nuevoRemitente.setRolSolicitud(rolRemitente);
        nuevoRemitente.setDestinatario(false);

        UsuarioXSolicitud nuevoAsesor = new UsuarioXSolicitud();
        nuevoAsesor.setUsuario(asesorNuevo);
        nuevoAsesor.setSolicitud(nuevaSolicitud);
        nuevoAsesor.setAccionSolicitud(accionPendiente);
        nuevoAsesor.setRolSolicitud(rolAsesorEntrada);
        nuevoAsesor.setDestinatario(false);

        UsuarioXSolicitud actualAsesor = new UsuarioXSolicitud();
        actualAsesor.setUsuario(asesorActual);
        actualAsesor.setSolicitud(nuevaSolicitud);
        actualAsesor.setAccionSolicitud(sinAccion);
        actualAsesor.setRolSolicitud(rolAsesorActual);
        actualAsesor.setDestinatario(false);

        usuarioXSolicitudRepository.save(nuevoRemitente);
        usuarioXSolicitudRepository.save(nuevoAsesor);
        usuarioXSolicitudRepository.save(actualAsesor);

        return solicitud;
    }

// Metodos de Solicitud Cambio Asesor
    @Override
    public List<SolicitudCeseAsesoriaResumenDto> listarResumenSolicitudCambioAsesorUsuario(Integer idUsuario,
            String rolSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCambioAsesorUsuario(idUsuario,
                rolSolicitud);
        List<SolicitudCeseAsesoriaResumenDto> solicitudes = new ArrayList<>();
        for (Object[] row : queryResult) {
            SolicitudCeseAsesoriaResumenDto solicitud = SolicitudCeseAsesoriaResumenDto.fromResultQuery(row);
            solicitudes.add(solicitud);
        }
        return solicitudes;
    }

    @Override
    public List<SolicitudCeseAsesoriaResumenDto> listarResumenSolicitudCambioAsesorCoordinador(Integer idUsuario,
                                                                                           String rolSolicitud) {
        //Esto solo lo puede llamar un usuario que tiene el rol de coordinador, es una validación en controller
        List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCambioAsesorUsuario(idUsuario,
                rolSolicitud);
        List<SolicitudCeseAsesoriaResumenDto> solicitudes = new ArrayList<>();
        for (Object[] row : queryResult) {
            SolicitudCeseAsesoriaResumenDto solicitud = SolicitudCeseAsesoriaResumenDto.fromResultQuery(row);
            solicitudes.add(solicitud);
        }
        return solicitudes;
    }

    @Override
    public DetalleSolicitudCambioAsesorDto listarDetalleSolicitudCambioAsesorUsuario(Integer idSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleSolicitudCambioAsesor(idSolicitud);
        if (queryResult.isEmpty())
            return null;
        Object[] result = queryResult.get(0);
        DetalleSolicitudCambioAsesorDto detalle = DetalleSolicitudCambioAsesorDto.fromResultQuery(result);
        int idRemitente = (int) result[6];
        UsuarioSolicitudCambioAsesorDto remitente = getUsuarioSolicitudFromId(idRemitente, idSolicitud);
        int idAsesorActual = (int) result[7];
        UsuarioSolicitudCambioAsesorDto asesorActual = getUsuarioSolicitudFromId(idAsesorActual, idSolicitud);
        int idAsesorEntrada = (int) result[8];
        UsuarioSolicitudCambioAsesorDto asesorEntrada = getUsuarioSolicitudFromId(idAsesorEntrada, idSolicitud);
        int idDetinatario = (int) result[9];
        UsuarioSolicitudCambioAsesorDto destinatario = getUsuarioSolicitudFromId(idDetinatario, idSolicitud);

        detalle.setSolicitante(remitente);
        detalle.setAsesorActual(asesorActual);
        detalle.setAsesorNuevo(asesorEntrada);
        detalle.setCoordinador(destinatario);

        return detalle;

    }

    @Transactional
    @Override
    public void aprobarRechazarSolicitudCambioAsesor(Integer idSolicitud, Integer idUsuario, String rolSolictud,
            boolean aprobar) {
        // validar Solicitud se puede aprobar o rechazar verifica que haya una solcitud
        // con ese if y estado pendiente
        boolean validar = solicitudRepository.existsSolicitudByIdAndEstadoSolicitud_Nombre(idSolicitud,
                EstadoSolicitudEnum.PENDIENTE.name());
        if (!validar)
            throw new RuntimeException("Solicitud no puede ser modificada");
        // validar que el usuario con ese rol puede aprobar o rechazar esa solicitud
        List<Object[]> result = usuarioXSolicitudRepository.puedeUsuarioCambiarSolicitud(idUsuario, rolSolictud,
                idSolicitud);
        validar = Utils.validarTrueOrFalseDeQuery(result);
        if (!validar)
            throw new RuntimeException("El usuario no puede modificar la solicitud");
        // El procedure se encarga de all
        usuarioXSolicitudRepository.procesarSolicitudCambio(idUsuario, rolSolictud, idSolicitud, aprobar);
    }

    private UsuarioSolicitudCambioAsesorDto getUsuarioSolicitudFromId(int idUsuario, int idSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleUsuarioSolicitudCambioAsesor(idUsuario,
                idSolicitud);
        Object[] result = queryResult.get(0);
        return UsuarioSolicitudCambioAsesorDto.fromQueryResult(result);
    }

    private boolean determinarSolicitudCompletadaFromData(Integer estado) {
        // Business logic based on procedure data
        return estado == 0 || estado == 2; // approved or rejected
    }

    private boolean determinarAprobadoFromData(Integer estado) {
        // Simple implementation for now - approved if status is 0 (approved)
        return estado != null && estado == 0;
    }

    /**
     * Crea una solicitud de aprobación de tema y la asigna a todos los
     * coordinadores
     * activos de la carrera asociada.
     *
     * @param tema Tema recién creado al que se asociará la solicitud.
     */
    public void crearSolicitudAprobacionTema(Tema tema) {
        // 1) Obtener el tipo de solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
                .findByNombre("Aprobación de tema (por coordinador)")
                .orElseThrow(() -> new RuntimeException(
                        "Tipo de solicitud no configurado: Aprobación de tema (por coordinador)"));

        // 2) Construir y guardar la solicitud
        Solicitud solicitud = new Solicitud();
        solicitud.setDescripcion("Solicitud de aprobación de tema por coordinador");
        solicitud.setTipoSolicitud(tipoSolicitud);
        solicitud.setTema(tema);
        solicitud.setEstado(0); // Ajusta según tu convención (p.ej. 0 = PENDIENTE)
        Solicitud savedSolicitud = solicitudRepository.save(solicitud);
		RolSolicitud rolDestinatario = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.DESTINATARIO.name()).
				orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		AccionSolicitud accionPendiente = accionSolicitudRepository
                .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
                .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));
        // 3) Buscar los usuarios-coordinador de la carrera del tema
        List<UsuarioXSolicitud> asignaciones = usuarioCarreraRepository
				.findByCarreraIdAndActivoTrue(tema.getCarrera().getId()).stream()
				.filter(rel -> Boolean.TRUE.equals(rel.getEs_coordinador()))
				.map(rel -> {
					Usuario coord = rel.getUsuario();
					UsuarioXSolicitud us = new UsuarioXSolicitud();
					us.setUsuario(coord);
					us.setSolicitud(savedSolicitud);
					us.setRolSolicitud(rolDestinatario);
					us.setAccionSolicitud(accionPendiente);
					return us;
				})
				.collect(Collectors.toList());

        if (asignaciones.isEmpty()) {
            throw new RuntimeException(
                    "No hay coordinador activo para la carrera con id " + tema.getCarrera().getId());
        }

        // 4) Guardar todas las asignaciones de la solicitud
        usuarioXSolicitudRepository.saveAll(asignaciones);
    }

    private boolean validarExistenEstadosAccionesRoles() {
        boolean exists;
        for (EstadoSolicitudEnum estado : EstadoSolicitudEnum.values()) {
            exists = estadoSolicitudRepository.existsByNombre(estado.name());
            if (!exists) {
                System.out.println("falta " + estado.name());
                return false;
            }
        }
        for (AccionSolicitudEnum accion : AccionSolicitudEnum.values()) {
            exists = accionSolicitudRepository.existsByNombre(accion.name());
            if (!exists) {
                System.out.println("falta " + accion.name());
                return false;
            }
        }
        for (RolSolicitudEnum rol : RolSolicitudEnum.values()) {
            exists = rolSolicitudRepository.existsByNombre(rol.name());
            if (!exists) {
                System.out.println("falta " + rol.name());
                return false;
            }
        }
        for (EstadoTemaEnum estado : EstadoTemaEnum.values()) {
            exists = estadoTemaRepository.existsByNombre(estado.name());
            if (!exists) {
                System.out.println("falta " + estado.name());
                return false;
            }
        }
        return true;
    }
// Metodos de Solicitud Cese Asesoria
    @Override
    @Transactional
    public pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto registrarSolicitudCeseAsesoria(
        pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto solicitud) {
        // Validaciones similares a registrarSolicitudCambioAsesor
        if (!validarExistenEstadosAccionesRoles())
        throw new RuntimeException("Faltan registrar estados, roles o acciones");

        // Validar que el tema exista y esté activo
        boolean validacion = Utils.validarTrueOrFalseDeQuery(
            temaRepository.validarTemaExisteYSePuedeCesarAsesoria(solicitud.getTemaId()));
        if (!validacion)
        throw new RuntimeException("Tema no válido para cese de asesoría");

        // Validar roles
        validacion = Utils.validarTrueOrFalseDeQuery(usuarioXRolRepository.esUsuarioAlumno(solicitud.getAlumnoId()));
        if (!validacion)
        throw new RuntimeException("Alumno no válido para cese de asesoría");

        int idCoordinador = (int) usuarioRepository.obtenerIdCoordinadorPorUsuario(solicitud.getAlumnoId()).get(0)[0];
        if (idCoordinador == -1)
        throw new RuntimeException("Coordinador de la carrera inexistente para el alumno " + solicitud.getAlumnoId());

        // Tipo Solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
            .findByNombre("Cese de asesoria (por alumno)")
            .orElseThrow(() -> new RuntimeException("Tipo de solicitud no configurado: Cese de asesoría (por alumno)"));

        // Estado solicitud
        EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
            .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
            .orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));

        // Tema
        Tema tema = temaRepository
            .findById(solicitud.getTemaId())
            .orElseThrow(() -> new RuntimeException("Tema no encontrado"));

        // Solicitud
        Solicitud nuevaSolicitud = new Solicitud();
        nuevaSolicitud.setDescripcion(solicitud.getMotivo());
        nuevaSolicitud.setTipoSolicitud(tipoSolicitud);
        nuevaSolicitud.setTema(tema);
        nuevaSolicitud.setEstadoSolicitud(estadoSolicitud);
        nuevaSolicitud.setFechaCreacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        solicitudRepository.save(nuevaSolicitud);

        solicitud.setSolicitudId(nuevaSolicitud.getId());

        // Tabla UsuarioSolicitud
        Usuario alumno = usuarioRepository
            .findById(solicitud.getAlumnoId())
            .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        Usuario asesor = usuarioRepository
            .findById(solicitud.getAsesorActualId())
            .orElseThrow(() -> new RuntimeException("Asesor no encontrado"));
        Usuario coordinador = usuarioRepository
            .findById(idCoordinador)
            .orElseThrow(() -> new RuntimeException("Coordinador de la carrera inexistente"));

        AccionSolicitud accionPendiente = accionSolicitudRepository
            .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
            .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));
        AccionSolicitud sinAccion = accionSolicitudRepository
            .findByNombre(AccionSolicitudEnum.SIN_ACCION.name())
            .orElseThrow(() -> new RuntimeException("Accion sin_accion no encontrado"));
        RolSolicitud rolRemitente = rolSolicitudRepository
            .findByNombre(RolSolicitudEnum.REMITENTE.name())
            .orElseThrow(() -> new RuntimeException("Rol remitente no encontrado"));
        RolSolicitud rolDestinatario = rolSolicitudRepository
            .findByNombre(RolSolicitudEnum.DESTINATARIO.name())
            .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
        RolSolicitud rolAsesor = rolSolicitudRepository
            .findByNombre(RolSolicitudEnum.ASESOR_ACTUAL.name())
            .orElseThrow(() -> new RuntimeException("Rol asesor actual no encontrado"));

        UsuarioXSolicitud nuevoRemitente = new UsuarioXSolicitud();
        nuevoRemitente.setUsuario(alumno);
        nuevoRemitente.setSolicitud(nuevaSolicitud);
        nuevoRemitente.setAccionSolicitud(sinAccion);
        nuevoRemitente.setRolSolicitud(rolRemitente);
        nuevoRemitente.setDestinatario(false);

        UsuarioXSolicitud nuevoDestinatario = new UsuarioXSolicitud();
        nuevoDestinatario.setUsuario(coordinador);
        nuevoDestinatario.setSolicitud(nuevaSolicitud);
        nuevoDestinatario.setAccionSolicitud(accionPendiente);
        nuevoDestinatario.setRolSolicitud(rolDestinatario);
        nuevoDestinatario.setDestinatario(true);

        UsuarioXSolicitud asesorActual = new UsuarioXSolicitud();
        asesorActual.setUsuario(asesor);
        asesorActual.setSolicitud(nuevaSolicitud);
        asesorActual.setAccionSolicitud(sinAccion);
        asesorActual.setRolSolicitud(rolAsesor);
        asesorActual.setDestinatario(false);

        usuarioXSolicitudRepository.save(nuevoRemitente);
        usuarioXSolicitudRepository.save(nuevoDestinatario);
        usuarioXSolicitudRepository.save(asesorActual);

        return solicitud;
    }

    @Override
    public List<pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto> listarResumenSolicitudCeseAsesoriaUsuario(
        Integer idUsuario, String rolSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCeseAsesoriaUsuario(idUsuario, rolSolicitud);
        List<pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto> solicitudes = new ArrayList<>();
        for (Object[] row : queryResult) {
        pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto solicitud =
            pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto.fromResultQuery(row);
        solicitudes.add(solicitud);
        }
        return solicitudes;
    }

    @Override
    public pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto listarDetalleSolicitudCeseAsesoriaUsuario(
        Integer idSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleSolicitudCeseAsesoria(idSolicitud);
        if (queryResult.isEmpty())
        return null;
        Object[] result = queryResult.get(0);
        pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto detalle =
            pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto.fromResultQuery(result);
        int idRemitente = (int) result[6];
        pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto remitente = getUsuarioSolicitudCeseAsesoriaFromId(idRemitente, idSolicitud);
        int idAsesor = (int) result[7];
        pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto asesor = getUsuarioSolicitudCeseAsesoriaFromId(idAsesor, idSolicitud);
        int idDestinatario = (int) result[8];
        pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto destinatario = getUsuarioSolicitudCeseAsesoriaFromId(idDestinatario, idSolicitud);

        detalle.setSolicitante(remitente);
        detalle.setAsesorActual(asesor);
        detalle.setCoordinador(destinatario);

        return detalle;
    }

    @Override
    @Transactional
    public void aprobarRechazarSolicitudCeseAsesoria(Integer idSolicitud, Integer idUsuario, String rolSolicitud, boolean aprobar) {
        boolean validar = solicitudRepository.existsSolicitudByIdAndEstadoSolicitud_Nombre(idSolicitud,
            EstadoSolicitudEnum.PENDIENTE.name());
        if (!validar)
        throw new RuntimeException("Solicitud no puede ser modificada");
        List<Object[]> result = usuarioXSolicitudRepository.puedeUsuarioCesarAsesoria(idUsuario, rolSolicitud, idSolicitud);
        validar = Utils.validarTrueOrFalseDeQuery(result);
        if (!validar)
        throw new RuntimeException("El usuario no puede modificar la solicitud");
        usuarioXSolicitudRepository.procesarCeseAsesoria(idUsuario, rolSolicitud, idSolicitud, aprobar);
    }

    private pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto getUsuarioSolicitudCeseAsesoriaFromId(int idUsuario, int idSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleUsuarioSolicitudCeseAsesoria(idUsuario, idSolicitud);
        Object[] result = queryResult.get(0);
        return pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto.fromQueryResult(result);
    }

    public AccionSolicitud buscarPorNombreAccion(AccionSolicitudEnum accion, String onErrorMsg){
        return accionSolicitudRepository
                .findByNombre(accion.name())
                .orElseThrow(() -> new RuntimeException(onErrorMsg));
    }
    public RolSolicitud buscarPorNombreRol(RolSolicitudEnum rol, String onErrorMsg){
        return rolSolicitudRepository
                .findByNombre(rol.name())
                .orElseThrow(() -> new RuntimeException(onErrorMsg));
    }
}
