package pucp.edu.pe.sgta.service.imp;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException; // De local
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter; // De local
import pucp.edu.pe.sgta.exception.ResourceNotFoundException; // De local
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto.AprobarCambioAsesorAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto.CambioAsignacionDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto.AsignacionDto;
import pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseDetalleDto;
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
    private RolRepository rolRepository;

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
        // validar que no se cambie un asesor por el mismo
        if (Objects.equals(solicitud.getAsesorActualId(), solicitud.getNuevoAsesorId()))
            throw new RuntimeException("El asesor a cambiar no puede ser igual al asesor actual");
        if (!validarExistenEstadosAccionesRoles())
            throw new RuntimeException("Faltan registrar estados, roles o acciones");
        boolean validacion;
        // Validar que el tema exista
        validacion = Utils.validarTrueOrFalseDeQuery(
                temaRepository.validarTemaExisteYSePuedeCambiarAsesor(solicitud.getTemaId()));
        if (!validacion)
            throw new RuntimeException("Tema no valido para cambio de asesor");
        // Validar los roles
        validacion = (Utils
                .validarTrueOrFalseDeQuery(usuarioXRolRepository.esProfesorAsesor(solicitud.getNuevoAsesorId()))
                && Utils.validarTrueOrFalseDeQuery(
                        usuarioXRolRepository.esProfesorAsesor(solicitud.getAsesorActualId())));
        if (!validacion)
            throw new RuntimeException("Asesor elegido no valido para cambio de asesor");

        validacion = Utils.validarTrueOrFalseDeQuery(usuarioXRolRepository.esUsuarioAlumno(solicitud.getAlumnoId()));
        if (!validacion)
            throw new RuntimeException("Alumno no valido para cambio de asesor");

        int idCoordinador = (int) usuarioRepository.obtenerIdCoordinadorPorUsuario(solicitud.getAlumnoId()).get(0)[0];
        if (idCoordinador == -1)
            throw new RuntimeException(
                    "Coordinador de la carrera inexistente para el alumno " + solicitud.getAlumnoId());
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
        Usuario alumno = usuarioRepository
                .findById(solicitud.getAlumnoId())
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
        Usuario asesorActual = usuarioRepository
                .findById(solicitud.getAsesorActualId())
                .orElseThrow(() -> new RuntimeException("Asesor actual no encontrado"));
        Usuario asesorNuevo = usuarioRepository
                .findById(solicitud.getNuevoAsesorId())
                .orElseThrow(() -> new RuntimeException("Asesor entrante no encontrado"));
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
        RolSolicitud rolAsesorEntrada = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.ASESOR_ENTRADA.name())
                .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
        RolSolicitud rolAsesorActual = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.ASESOR_ACTUAL.name())
                .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));

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
        usuarioXSolicitudRepository.save(nuevoDestinatario);
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
                .findByNombre(RolSolicitudEnum.DESTINATARIO.name())
                .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
        AccionSolicitud accionPendiente = accionSolicitudRepository
                .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
                .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));
        // 3) Buscar los usuarios-coordinador de la carrera del tema
        List<UsuarioXSolicitud> asignaciones = usuarioCarreraRepository
                .findByCarreraIdAndActivoTrue(tema.getCarrera().getId()).stream()
                .filter(rel -> Boolean.TRUE.equals(rel.getEsCoordinador()))
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
    // @Override
    // @Transactional
    // public pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto registrarSolicitudCeseAsesoria(
    //         pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto solicitud) {
    //     // Validaciones similares a registrarSolicitudCambioAsesor
    //     if (!validarExistenEstadosAccionesRoles())
    //         throw new RuntimeException("Faltan registrar estados, roles o acciones");

    //     // Validar que el tema exista y esté activo
    //     boolean validacion = Utils.validarTrueOrFalseDeQuery(
    //             temaRepository.validarTemaExisteYSePuedeCesarAsesoria(solicitud.getTemaId()));
    //     if (!validacion)
    //         throw new RuntimeException("Tema no válido para cese de asesoría");

    //     // Validar roles
    //     validacion = Utils.validarTrueOrFalseDeQuery(usuarioXRolRepository.esUsuarioAlumno(solicitud.getAlumnoId()));
    //     if (!validacion)
    //         throw new RuntimeException("Alumno no válido para cese de asesoría");

    //     int idCoordinador = (int) usuarioRepository.obtenerIdCoordinadorPorUsuario(solicitud.getAlumnoId()).get(0)[0];
    //     if (idCoordinador == -1)
    //         throw new RuntimeException(
    //                 "Coordinador de la carrera inexistente para el alumno " + solicitud.getAlumnoId());

    //     // Tipo Solicitud
    //     TipoSolicitud tipoSolicitud = tipoSolicitudRepository
    //             .findByNombre("Cese de asesoria (por alumno)")
    //             .orElseThrow(
    //                     () -> new RuntimeException("Tipo de solicitud no configurado: Cese de asesoría (por alumno)"));

    //     // Estado solicitud
    //     EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
    //             .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
    //             .orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));

    //     // Tema
    //     Tema tema = temaRepository
    //             .findById(solicitud.getTemaId())
    //             .orElseThrow(() -> new RuntimeException("Tema no encontrado"));

    //     // Solicitud
    //     Solicitud nuevaSolicitud = new Solicitud();
    //     nuevaSolicitud.setDescripcion(solicitud.getMotivo());
    //     nuevaSolicitud.setTipoSolicitud(tipoSolicitud);
    //     nuevaSolicitud.setTema(tema);
    //     nuevaSolicitud.setEstadoSolicitud(estadoSolicitud);
    //     nuevaSolicitud.setFechaCreacion(OffsetDateTime.now(ZoneId.of("America/Lima")));
    //     solicitudRepository.save(nuevaSolicitud);

    //     solicitud.setSolicitudId(nuevaSolicitud.getId());

    //     // Tabla UsuarioSolicitud
    //     Usuario alumno = usuarioRepository
    //             .findById(solicitud.getAlumnoId())
    //             .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
    //     Usuario asesor = usuarioRepository
    //             .findById(solicitud.getAsesorActualId())
    //             .orElseThrow(() -> new RuntimeException("Asesor no encontrado"));
    //     Usuario coordinador = usuarioRepository
    //             .findById(idCoordinador)
    //             .orElseThrow(() -> new RuntimeException("Coordinador de la carrera inexistente"));

    //     AccionSolicitud accionPendiente = accionSolicitudRepository
    //             .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
    //             .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));
    //     AccionSolicitud sinAccion = accionSolicitudRepository
    //             .findByNombre(AccionSolicitudEnum.SIN_ACCION.name())
    //             .orElseThrow(() -> new RuntimeException("Accion sin_accion no encontrado"));
    //     RolSolicitud rolRemitente = rolSolicitudRepository
    //             .findByNombre(RolSolicitudEnum.REMITENTE.name())
    //             .orElseThrow(() -> new RuntimeException("Rol remitente no encontrado"));
    //     RolSolicitud rolDestinatario = rolSolicitudRepository
    //             .findByNombre(RolSolicitudEnum.DESTINATARIO.name())
    //             .orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
    //     RolSolicitud rolAsesor = rolSolicitudRepository
    //             .findByNombre(RolSolicitudEnum.ASESOR_ACTUAL.name())
    //             .orElseThrow(() -> new RuntimeException("Rol asesor actual no encontrado"));

    //     UsuarioXSolicitud nuevoRemitente = new UsuarioXSolicitud();
    //     nuevoRemitente.setUsuario(alumno);
    //     nuevoRemitente.setSolicitud(nuevaSolicitud);
    //     nuevoRemitente.setAccionSolicitud(sinAccion);
    //     nuevoRemitente.setRolSolicitud(rolRemitente);
    //     nuevoRemitente.setDestinatario(false);

    //     UsuarioXSolicitud nuevoDestinatario = new UsuarioXSolicitud();
    //     nuevoDestinatario.setUsuario(coordinador);
    //     nuevoDestinatario.setSolicitud(nuevaSolicitud);
    //     nuevoDestinatario.setAccionSolicitud(accionPendiente);
    //     nuevoDestinatario.setRolSolicitud(rolDestinatario);
    //     nuevoDestinatario.setDestinatario(true);

    //     UsuarioXSolicitud asesorActual = new UsuarioXSolicitud();
    //     asesorActual.setUsuario(asesor);
    //     asesorActual.setSolicitud(nuevaSolicitud);
    //     asesorActual.setAccionSolicitud(sinAccion);
    //     asesorActual.setRolSolicitud(rolAsesor);
    //     asesorActual.setDestinatario(false);

    //     usuarioXSolicitudRepository.save(nuevoRemitente);
    //     usuarioXSolicitudRepository.save(nuevoDestinatario);
    //     usuarioXSolicitudRepository.save(asesorActual);

    //     return solicitud;
    // }

    // @Override
    // public List<pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto> listarResumenSolicitudCeseAsesoriaUsuario(
    //         Integer idUsuario, String rolSolicitud) {
    //     List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCeseAsesoriaUsuario(idUsuario,
    //             rolSolicitud);
    //     List<pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto> solicitudes = new ArrayList<>();
    //     for (Object[] row : queryResult) {
    //         pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto solicitud = pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto
    //                 .fromResultQuery(row);
    //         solicitudes.add(solicitud);
    //     }
    //     return solicitudes;
    // }

    // @Override
    // public pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto listarDetalleSolicitudCeseAsesoriaUsuario(
    //         Integer idSolicitud) {
    //     List<Object[]> queryResult = solicitudRepository.listarDetalleSolicitudCeseAsesoria(idSolicitud);
    //     if (queryResult.isEmpty())
    //         return null;
    //     Object[] result = queryResult.get(0);
    //     pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto detalle = pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto
    //             .fromResultQuery(result);
    //     int idRemitente = (int) result[6];
    //     pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto remitente = getUsuarioSolicitudCeseAsesoriaFromId(
    //             idRemitente, idSolicitud);
    //     int idAsesor = (int) result[7];
    //     pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto asesor = getUsuarioSolicitudCeseAsesoriaFromId(
    //             idAsesor, idSolicitud);
    //     int idDestinatario = (int) result[8];
    //     pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto destinatario = getUsuarioSolicitudCeseAsesoriaFromId(
    //             idDestinatario, idSolicitud);

    //     detalle.setSolicitante(remitente);
    //     detalle.setAsesorActual(asesor);
    //     detalle.setCoordinador(destinatario);

    //     return detalle;
    // }

    // @Override
    // @Transactional
    // public void aprobarRechazarSolicitudCeseAsesoria(Integer idSolicitud, Integer idUsuario, String rolSolicitud,
    //         boolean aprobar) {
    //     boolean validar = solicitudRepository.existsSolicitudByIdAndEstadoSolicitud_Nombre(idSolicitud,
    //             EstadoSolicitudEnum.PENDIENTE.name());
    //     if (!validar)
    //         throw new RuntimeException("Solicitud no puede ser modificada");
    //     List<Object[]> result = usuarioXSolicitudRepository.puedeUsuarioCesarAsesoria(idUsuario, rolSolicitud,
    //             idSolicitud);
    //     validar = Utils.validarTrueOrFalseDeQuery(result);
    //     if (!validar)
    //         throw new RuntimeException("El usuario no puede modificar la solicitud");
    //     usuarioXSolicitudRepository.procesarCeseAsesoria(idUsuario, rolSolicitud, idSolicitud, aprobar);
    // }

    // private pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto getUsuarioSolicitudCeseAsesoriaFromId(
    //         int idUsuario, int idSolicitud) {
    //     List<Object[]> queryResult = solicitudRepository.listarDetalleUsuarioSolicitudCeseAsesoria(idUsuario,
    //             idSolicitud);
    //     Object[] result = queryResult.get(0);
    //     return pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCeseAsesoriaDto.fromQueryResult(result);
    // }
    @Override
    public SolicitudCeseDto findAllSolicitudesCeseByCoordinatorCognitoSub(String coordinatorCognitoSub,
                                                                          int page, int size, String status) {
        log.info("findAllSolicitudesCese - page: {}, size: {}, status: {} para coordinador CognitoSub: '{}'",
                page, size, status, coordinatorCognitoSub);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinatorCognitoSub)
                .orElseThrow(() -> new UsernameNotFoundException("Coordinador no encontrado con ID de Cognito: " + coordinatorCognitoSub));

        List<UsuarioXCarrera> coordinadorCarreras = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId());
        if (coordinadorCarreras.isEmpty()) {
            log.warn("Coordinador ID {} no tiene carreras activas asignadas.", coordinador.getId());
            return new SolicitudCeseDto(Collections.emptyList(), 0);
        }

        List<Integer> idsCarrerasDelCoordinador = coordinadorCarreras.stream()
                .map(uc -> uc.getCarrera().getId())
                .distinct()
                .collect(Collectors.toList());
        log.info("IDs de Carrera para el Coordinador {}: {}", coordinador.getId(), idsCarrerasDelCoordinador);

        List<String> targetStatusNames = new ArrayList<>();
        if (status != null && !status.trim().isEmpty()) {
            if ("pending".equalsIgnoreCase(status)) {
                targetStatusNames.add("PENDIENTE");
            } else if ("history".equalsIgnoreCase(status)) {
                targetStatusNames.add("APROBADA");
                targetStatusNames.add("RECHAZADA");
            } else if ("approved".equalsIgnoreCase(status)) {
                targetStatusNames.add("APROBADA");
            } else if ("rejected".equalsIgnoreCase(status)) {
                targetStatusNames.add("RECHAZADA");
            }
        }
        if (targetStatusNames.isEmpty() && (status == null || status.trim().isEmpty())) {
            log.info("No se especificó filtro de estado o fue inválido. Se cargarán todos los estados (o según lógica de findSinFiltroEstado).");
        }

        log.info("Buscando solicitudes de tipo: '{}' para las carreras: {} y estados: {}",
                "Cese de asesoria (por alumno)", idsCarrerasDelCoordinador, targetStatusNames);

        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaCreacion").descending());

        Page<Solicitud> pageOfSolicitudes;
        if (!targetStatusNames.isEmpty()) {
            pageOfSolicitudes = solicitudRepository.findConFiltroEstado(
                    idsCarrerasDelCoordinador, "Cese de asesoria (por alumno)", targetStatusNames, pageable);
        } else {
            pageOfSolicitudes = solicitudRepository.findSinFiltroEstado(
                    idsCarrerasDelCoordinador, "Cese de asesoria (por alumno)", pageable);
        }

        log.info("Solicitudes encontradas en BD: {} (Total elementos: {})", pageOfSolicitudes.getNumberOfElements(), pageOfSolicitudes.getTotalElements());

        List<SolicitudCeseDto.RequestTermination> requestList = pageOfSolicitudes.getContent().stream().map(solicitud -> {
            List<Integer> remitentes = solicitudRepository.findRemitenteIdBySolicitudId(solicitud.getId());
            Integer remitenteId = remitentes.isEmpty() ? null : remitentes.get(0);
            Usuario asesorSolicitante = usuarioRepository.findById(remitenteId)
                    .orElse(null);

            SolicitudCeseDto.Assessor assessorDto = null;
            if (asesorSolicitante != null) {
                Integer activeProjectsCount = usuarioXTemaRepository.countByUsuarioAndRol_NombreAndActivoTrue(asesorSolicitante, "Asesor");
                assessorDto = new SolicitudCeseDto.Assessor(
                        asesorSolicitante.getId(),
                        asesorSolicitante.getNombres(),
                        asesorSolicitante.getPrimerApellido(),
                        asesorSolicitante.getCorreoElectronico(),
                        activeProjectsCount != null ? activeProjectsCount : 0,
                        asesorSolicitante.getFotoPerfil()
                );
            }

            List<SolicitudCeseDto.Estudiante> studentsDto = new ArrayList<>();
            Tema temaDeSolicitud = solicitud.getTema();
            if (temaDeSolicitud != null) {
                Rol rolTesista = rolRepository.findByNombre("Tesista").orElse(null);
                if (rolTesista != null) {
                    List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(temaDeSolicitud.getId(), rolTesista.getId());
                    studentsDto = estudiantesRelacion.stream()
                            .filter(er -> er.getUsuario() != null)
                            .map(er -> {
                                Usuario usuarioEstudiante = er.getUsuario();
                                return new SolicitudCeseDto.Estudiante(
                                        usuarioEstudiante.getId(),
                                        usuarioEstudiante.getNombres(),
                                        usuarioEstudiante.getPrimerApellido(),
                                        new SolicitudCeseDto.TemaAnidadoEnEstudiante(temaDeSolicitud.getTitulo())
                                );
                            }).collect(Collectors.toList());
                }
            }

            String estadoSolicitudStr = "unknown";
            if (solicitud.getEstadoSolicitud() != null && solicitud.getEstadoSolicitud().getNombre() != null) {
                estadoSolicitudStr = solicitud.getEstadoSolicitud().getNombre().toLowerCase();
            } else if (solicitud.getEstado() != null) {
                estadoSolicitudStr = switch (solicitud.getEstado()) {
                    case 0 -> "aprobada"; // MERGE-NOTE: Confirmar mapeo de int estado
                    case 1 -> "pendiente";
                    case 2 -> "rechazada";
                    default -> "unknown";
                };
            }

            String registerTimeString = (solicitud.getFechaCreacion() != null) ?
                    solicitud.getFechaCreacion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;
            String responseTimeString = (solicitud.getFechaResolucion() != null) ?
                    solicitud.getFechaResolucion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;

            SolicitudCeseDto.TemaPrincipalDto temaPrincipalDto = null;
            if (temaDeSolicitud != null) {
                temaPrincipalDto = new SolicitudCeseDto.TemaPrincipalDto(
                        temaDeSolicitud.getId(),
                        temaDeSolicitud.getTitulo()
                );
            }

            return new SolicitudCeseDto.RequestTermination(
                    solicitud.getId(),
                    registerTimeString,
                    estadoSolicitudStr,
                    solicitud.getDescripcion(),
                    solicitud.getRespuesta(),
                    responseTimeString,
                    assessorDto,
                    studentsDto,
                    temaPrincipalDto
            );
        }).collect(Collectors.toList());

        return new SolicitudCeseDto(requestList, pageOfSolicitudes.getTotalPages());
    }

    @Override
    @Transactional
    public void rejectSolicitudCese(Integer solicitudId, String responseText, String coordinatorCognitoSub) {
        log.info("Intentando rechazar solicitud ID: {} por coordinador Cognito Sub: {}", solicitudId, coordinatorCognitoSub);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinatorCognitoSub)
                .orElseThrow(() -> {
                    log.warn("Coordinador no encontrado con Cognito Sub: {}", coordinatorCognitoSub);
                    return new UsernameNotFoundException("Coordinador no encontrado con ID de Cognito: " + coordinatorCognitoSub);
                });

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> {
                    log.warn("Solicitud no encontrada con ID: {}", solicitudId);
                    return new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId);
                });
        
        // Validar permiso de carrera (simplificado, adaptar si es necesario)
        boolean perteneceACarreraDelCoordinador = false;
        if (solicitud.getTema() != null && solicitud.getTema().getCarrera() != null) {
            Integer carreraDeLaSolicitudId = solicitud.getTema().getCarrera().getId();
            perteneceACarreraDelCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId())
                    .stream()
                    .anyMatch(uc -> uc.getCarrera() != null && uc.getCarrera().getId().equals(carreraDeLaSolicitudId));
        }
        if (!perteneceACarreraDelCoordinador) {
             log.warn("Coordinador ID {} (Cognito Sub: {}) intentó rechazar solicitud ID {} que no pertenece a sus carreras.",
                    coordinador.getId(), coordinatorCognitoSub, solicitudId);
            throw new AccessDeniedException("No tiene permisos para gestionar esta solicitud.");
        }


        EstadoSolicitud estadoActual = solicitud.getEstadoSolicitud();
        if (estadoActual == null || !"PENDIENTE".equalsIgnoreCase(estadoActual.getNombre())) {
            String currentStatusName = (estadoActual != null) ? estadoActual.getNombre() : "DESCONOCIDO/NULL";
            log.warn("Intento de rechazar solicitud ID {} que no está PENDIENTE. Estado actual: {}", solicitudId, currentStatusName);
            throw new IllegalStateException("La solicitud solo puede ser rechazada si está en estado PENDIENTE. Estado actual: " + currentStatusName);
        }

        EstadoSolicitud estadoRechazada = estadoSolicitudRepository.findByNombre("RECHAZADA")
                .orElseThrow(() -> {
                    log.error("Estado '{}' no encontrado en la configuración de la base de datos.", "RECHAZADA");
                    return new RuntimeException("Configuración interna del sistema: Estado RECHAZADA no encontrado.");
                });

        solicitud.setEstadoSolicitud(estadoRechazada);
        solicitud.setEstado(2); // MERGE-NOTE: 2 para RECHAZADA, confirmar este mapeo.
        solicitud.setRespuesta(responseText);
        solicitud.setFechaResolucion(OffsetDateTime.now());
        solicitud.setFechaModificacion(OffsetDateTime.now()); // Actualizar también fecha_modificacion

        solicitudRepository.save(solicitud);

        log.info("Solicitud ID {} RECHAZADA exitosamente por coordinador ID {} (Cognito Sub: {})",
                solicitudId, coordinador.getId(), coordinatorCognitoSub);
        // TODO: Lógica de notificación.
    }

    @Override
    public SolicitudCeseDetalleDto findSolicitudCeseDetailsById(Integer solicitudId, String coordinatorCognitoSub) {
        log.info("Buscando detalles para solicitud ID: {} por coordinador Cognito Sub: {}", solicitudId, coordinatorCognitoSub);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinatorCognitoSub)
                .orElseThrow(() -> new UsernameNotFoundException("Coordinador no encontrado con ID de Cognito: " + coordinatorCognitoSub));

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId));

        // --- Validación de Permiso ---
        boolean perteneceACarreraDelCoordinador = false;
        if (solicitud.getTema() != null && solicitud.getTema().getCarrera() != null) {
            Integer carreraDeLaSolicitudId = solicitud.getTema().getCarrera().getId();
            // Asegúrate que coordinador.getId() devuelve el ID numérico y no el Cognito Sub
            perteneceACarreraDelCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId())
                    .stream()
                    .anyMatch(uc -> uc.getCarrera() != null && uc.getCarrera().getId().equals(carreraDeLaSolicitudId));
        }

        if (!perteneceACarreraDelCoordinador) {
            log.warn("Coordinador ID {} (Cognito Sub: {}) intentó acceder a detalles de solicitud ID {} que no pertenece a sus carreras.",
                    coordinador.getId(), coordinatorCognitoSub, solicitudId);
            throw new AccessDeniedException("No tiene permisos para ver los detalles de esta solicitud.");
        }

        // --- Mapeo a DTO de Detalle ---
        Usuario asesorSolicitante = null;

        RolSolicitud rolAsesorSolicitanteCese = rolSolicitudRepository.findByNombre("ASESOR_ENTRADA")
                .orElseThrow(() -> {
                    log.error("Configuración: Rol de solicitud 'ASESOR_ENTRADA' no encontrado en la BD.");
                    return new RuntimeException("Error de configuración interna: Rol ASESOR_ENTRADA no definido.");
                });

        // Usar el método que devuelve Optional y luego mapear, o manejar lista.
        Optional<UsuarioXSolicitud> optUsuarioSolicitud = usuarioXSolicitudRepository
                .findFirstBySolicitudIdAndRolSolicitud(solicitud.getId(), rolAsesorSolicitanteCese);
        // Asegúrate que este método exista en UsuarioSolicitudRepository y acepte (Integer, RolSolicitud)

        if (optUsuarioSolicitud.isPresent()) {
            asesorSolicitante = optUsuarioSolicitud.get().getUsuario();
        }

        SolicitudCeseDetalleDto.AssessorDetails asesorDto = null;

        if (asesorSolicitante != null) {
            long numProyectosAsesor = usuarioXTemaRepository.countByUsuarioIdAndRolNombreAndActivoTrue(
                    asesorSolicitante.getId(), "Asesor"
            );
            String urlPhotoBase64 = null;
            if (asesorSolicitante.getFotoPerfil() != null && asesorSolicitante.getFotoPerfil().length > 0) {
                urlPhotoBase64 = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(asesorSolicitante.getFotoPerfil());
                // Considera el tipo de imagen, PNG o JPEG
            }
            asesorDto = new SolicitudCeseDetalleDto.AssessorDetails(
                    asesorSolicitante.getId(),
                    asesorSolicitante.getNombres(),
                    asesorSolicitante.getPrimerApellido(),
                    asesorSolicitante.getCorreoElectronico(),
                    (int) numProyectosAsesor,
                    urlPhotoBase64
            );
        } else {
            log.warn("No se encontró un asesor solicitante para la solicitud ID: {}. El DTO de asesor será null.", solicitudId);
        }


        List<SolicitudCeseDetalleDto.EstudianteDetails> studentsDto = new ArrayList<>();
        if (solicitud.getTema() != null) {
            // Asegúrate de que las entidades referenciadas (Usuario, Tema) no sean null antes de acceder a sus propiedades
            List<UsuarioXTema> estudiantesRelacion = usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(
                    solicitud.getTema().getId(), "Tesista"
            );
            studentsDto = estudiantesRelacion.stream()
                    .filter(er -> er.getUsuario() != null)
                    .map(er -> {
                        Usuario uEstudiante = er.getUsuario();
                        return new SolicitudCeseDetalleDto.EstudianteDetails(
                                uEstudiante.getId(),
                                uEstudiante.getNombres(),
                                uEstudiante.getPrimerApellido(),
                                uEstudiante.getCodigoPucp(),
                                uEstudiante.getCorreoElectronico(),
                                (solicitud.getTema() != null ? new SolicitudCeseDetalleDto.TemaDetails(solicitud.getTema().getTitulo()) : null)
                        );
                    }).collect(Collectors.toList());
        }

        String estadoSolicitudStr = "desconocido";
        if (solicitud.getEstadoSolicitud() != null && solicitud.getEstadoSolicitud().getNombre() != null) {
            estadoSolicitudStr = solicitud.getEstadoSolicitud().getNombre().toLowerCase();
        } else if (solicitud.getEstado() != null) {
            estadoSolicitudStr = switch (solicitud.getEstado()) {
                case 0 -> "aprobada";
                case 1 -> "pendiente";
                case 2 -> "rechazada";
                default -> "desconocido";
            };
        }

        String registerTimeString = solicitud.getFechaCreacion() != null ?
                solicitud.getFechaCreacion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;
        String responseTimeString = solicitud.getFechaResolucion() != null ?
                solicitud.getFechaResolucion().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;

        return new SolicitudCeseDetalleDto(
                solicitud.getId(),
                registerTimeString,
                estadoSolicitudStr,
                solicitud.getDescripcion(),
                solicitud.getRespuesta(),
                responseTimeString,
                asesorDto, // Ahora debería ser visible
                studentsDto
        );
    }

}
