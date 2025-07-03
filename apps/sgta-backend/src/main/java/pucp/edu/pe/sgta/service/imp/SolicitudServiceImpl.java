package pucp.edu.pe.sgta.service.imp;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter; // De local

import pucp.edu.pe.sgta.dto.asesores.*;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException; // De local

import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.EstudianteSimpleDto;
import pucp.edu.pe.sgta.dto.asesores.ReasignacionPendienteDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorResumenDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseDetalleDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.NotificacionService;
import pucp.edu.pe.sgta.service.inter.SolicitudService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.util.*;
import org.springframework.data.jpa.domain.Specification; // Para queries dinámicas

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate; // Para Criteria API
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

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
    @Autowired
    private RolRepository rolRepository;

    private static final String ROL_NOMBRE_TESISTA = "Tesista";
    @Autowired
    private TemaServiceImpl temaServiceImpl;
    @Autowired
    private UsuarioXSolicitudServiceImp usuarioXSolicitudServiceImp;
    @Autowired
    private NotificacionService notificacionService;

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
            SolicitudTemaDto.Tema tema = new SolicitudTemaDto.Tema("Tema de Tesis", "Resumen del tema", "Objetivos del tema"); // This should
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
    public void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida, String usuarioId) {
        if (solicitudAtendida == null || solicitudAtendida.getChangeRequests() == null
                || solicitudAtendida.getChangeRequests().isEmpty()) {
            throw new RuntimeException("Request doesn't contain valid information");
        }
        boolean allAttended = true;
        Integer temaId = null;

        for (SolicitudTemaDto.RequestChange requestChange : solicitudAtendida.getChangeRequests()) {
            if (requestChange == null || requestChange.getId() == null) {
                allAttended = false;
                break;
            }

            Integer solicitudId = requestChange.getId();
            String response = requestChange.getResponse();

            Solicitud solicitud = solicitudRepository.findById(solicitudId)
                    .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

            String tipoSolicitudNombre = solicitud.getTipoSolicitud().getNombre();

            try {
                if ("Solicitud de cambio de título".equals(tipoSolicitudNombre)) {
                    String title = null;
                    if (requestChange.getStudents() != null && !requestChange.getStudents().isEmpty() &&
                            requestChange.getStudents().get(0).getTopic() != null) {
                        title = requestChange.getStudents().get(0).getTopic().getTitulo();
                        if (title != null && title.isEmpty()) title = null;
                    }
                    temaService.updateTituloTemaSolicitud(solicitudId, title, response);
                } else if ("Solicitud de cambio de resumen".equals(tipoSolicitudNombre)) {
                    String summary = null;
                    if (requestChange.getStudents() != null && !requestChange.getStudents().isEmpty() &&
                            requestChange.getStudents().get(0).getTopic() != null) {
                        summary = requestChange.getStudents().get(0).getTopic().getResumen();
                        if (summary != null && summary.isEmpty()) summary = null;
                    }
                    temaService.updateResumenTemaSolicitud(solicitudId, summary, response);
                } else {
                    log.warn("Unhandled solicitud type: {}", tipoSolicitudNombre);
                    allAttended = false;
                    break;
                }
                if (temaId == null) {
                    temaId = solicitud.getTema().getId();
                }
                log.info("Processed request {}", solicitudId);
            } catch (Exception e) {
                allAttended = false;
                log.error("Failed to process request {}: {}", solicitudId, e.getMessage());
                break;
            }
        }

        if (allAttended && temaId != null) { //Only update to INSCRITO if all observations were attended
            TemaDto dto = new TemaDto();
            dto.setId(temaId);
            temaService.createInscripcionTemaV2(dto, usuarioId, true);
            temaService.actualizarTemaYHistorial(temaId, "INSCRITO", "Todas las observaciones fueron atendidas");
        }

    }

    @Transactional
    @Override
    public pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto registrarSolicitudCambioAsesor(
            pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud,
            String cognitoId) {
        //Obtener el Id del alumno //Si no existe ya tiene una validación interna
        Integer idAlumno = usuarioServiceImpl.obtenerIdUsuarioPorCognito(cognitoId);

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

        //Ya no se obtiene el usuario del coordinador, cómo pueden haber varios coordinadores le puede llegar a cualquiera
        //Cambiando validación a obtenerIdCoordinadorPorUsuario -> obtenerCantidadDeCoordinadoresPorTema
        int cantidad = (int) usuarioRepository.obtenerCantidadDeCoordinadoresPorTema(solicitud.getTemaId()).get(0)[0];
        if (cantidad == 0)
            throw new RuntimeException(
                    "No se han registrado Coordinadores para la carrera a la que pertenece el tema");
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
        Usuario alumno = usuarioServiceImpl.buscarUsuarioPorId(idAlumno, "Alumno no encontrado");
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
        //Si el asesor que quiero cambiar es el creador de la tesis entonces necesitamos su validación
        if(solicitud.getCreadorId().equals(solicitud.getAsesorActualId())){
            actualAsesor.setAccionSolicitud(accionPendiente);
        }else{
            actualAsesor.setAccionSolicitud(sinAccion);

        }
        actualAsesor.setRolSolicitud(rolAsesorActual);
        actualAsesor.setDestinatario(false);

        usuarioXSolicitudRepository.save(nuevoRemitente);
        usuarioXSolicitudRepository.save(nuevoAsesor);
        usuarioXSolicitudRepository.save(actualAsesor);

        //Una vez hecho toda la gestión del registro falta avisar a los asesores
        // Enviar notificación al nuevo asesor
        String mensajeNotificacion = String.format(
                "Estimado/a %s %s, se le ha propuesto para asumir la asesoría del tema '%s'. Por favor, revise sus 'Solicitudes de cambio de asesor' en el sistema.",
                asesorNuevo.getNombres(),
                asesorNuevo.getPrimerApellido(),
                tema.getTitulo()
        );

        notificacionService.crearNotificacionParaUsuario(
                asesorNuevo.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );

        // Enviar notificación al asesor actual
        if(!solicitud.getCreadorId().equals(solicitud.getAsesorActualId()))
            mensajeNotificacion = String.format(
                    "Estimado/a %s %s, el tema '%s' ha recibido una solicitud para cambio de asesor por parte del alumno. Puede revisar la solicitud en la sección 'Solicitudes de cambio de asesor' en el sistema.",
                    asesorActual.getNombres(),
                    asesorActual.getPrimerApellido(),
                    tema.getTitulo()
            );
        else
            mensajeNotificacion = String.format(
                    "Estimado/a %s %s, su tema '%s' ha recibido una solicitud para cambio de asesor por parte del alumno. Puede revisar y aprobar la solicitud en la sección 'Solicitudes de cambio de asesor' en el sistema.",
                    asesorActual.getNombres(),
                    asesorActual.getPrimerApellido(),
                    tema.getTitulo()
            );

        notificacionService.crearNotificacionParaUsuario(
                asesorActual.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );
        return solicitud;
    }

// Metodos de Solicitud Cambio Asesor
    @Override
    public List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorUsuario(Integer idUsuario,
                                                                                           String rolSolicitud) {
        //si el rolSolicitud es AsesorEntrada, entonces los roles a buscar es asesorEntrada y asesor actual, si array único
        List<String> roles = new ArrayList<>();
        if(Objects.equals(rolSolicitud, RolSolicitudEnum.ASESOR_ENTRADA.name())){
            roles.add(RolSolicitudEnum.ASESOR_ENTRADA.name());
            roles.add(RolSolicitudEnum.ASESOR_ACTUAL.name());
        }else{
            roles.add(RolSolicitudEnum.REMITENTE.name());
        }
        List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCambioAsesorUsuario(idUsuario,
                Utils.convertListToPostgresArray(roles));
        List<SolicitudCambioAsesorResumenDto> solicitudes = new ArrayList<>();
        for (Object[] row : queryResult) {
            SolicitudCambioAsesorResumenDto solicitud = SolicitudCambioAsesorResumenDto.fromResultQuery(row);
            solicitudes.add(solicitud);
        }
        return solicitudes;
    }

    @Override
    public List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorCoordinador(String idCognito) {
        //Esto solo lo puede llamar un usuario que tiene el rol de coordinador, es una validación en controller
        List<Object[]> queryResult = solicitudRepository.listarResumenSolicitudCambioAsesorCoordinador(idCognito);
        List<SolicitudCambioAsesorResumenDto> solicitudes = new ArrayList<>();
        for (Object[] row : queryResult) {
            SolicitudCambioAsesorResumenDto solicitud = SolicitudCambioAsesorResumenDto.fromResultQuery(row);
            solicitudes.add(solicitud);
        }
        return solicitudes;
    }

    @Transactional
    @Override
    public RegistroCeseTemaDto registrarSolicitudCeseTema(RegistroCeseTemaDto registroDto, String cognitoId) {
        //Revisamos que el estado tema llegue valido y corroboramos en la BD
        EstadoTemaEnum estado = temaServiceImpl.obtenerEstadoFromString(registroDto.getEstadoTema());

        //Validamos que el tema tenga el estado que llegó
        Tema tema = temaServiceImpl.validarTemaConEstado(registroDto.getTemaId(), estado);
        //Obtenemos el tipo de solicutud
        TipoSolicitud tipoSol =  tipoSolicitudRepository.findByNombre("Cese de tema")
                                        .orElseThrow(()-> new RuntimeException("No se encontró el tipo de solicitud"));
        //Obtenemos el estado de la solicitud
        EstadoSolicitud estadoSolicitud;
        if(estado == EstadoTemaEnum.INSCRITO){
            //Cuando el estado es inscrito la solicitud se auto aprueba
            estadoSolicitud = estadoSolicitudRepository
                    .findByNombre(EstadoSolicitudEnum.ACEPTACION_AUTOMATICA.name())
                    .orElseThrow(()->new RuntimeException("No se encontró el estadoSolictud"));
        }else{
            estadoSolicitud = estadoSolicitudRepository
                    .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
                    .orElseThrow(()->new RuntimeException("No se encontró el estadoSolictud"));
        }

        //Creamos la base de la solicitud
        Solicitud solicitud = new Solicitud();
        solicitud.setTema(tema);
        solicitud.setTipoSolicitud(tipoSol);
        solicitud.setDescripcion(registroDto.getMotivo());
        solicitud.setEstadoSolicitud(estadoSolicitud);
        //Si el tema es inscrito la aprobación es automática
        if(estado == EstadoTemaEnum.INSCRITO){
            solicitud.setFechaResolucion(OffsetDateTime.now(ZoneId.of("America/Lima")));
        }

        //Guardamos la solicitud
        solicitud = solicitudRepository.save(solicitud);
        registroDto.setSolicitudId(solicitud.getId());

        //Agregar al usuario remitente
        Usuario alumno = usuarioServiceImpl.buscarUsuarioPorCognito(cognitoId, "Usuario no encontrado");
        usuarioXSolicitudServiceImp.agregarUsuarioSolicitud(alumno, solicitud,AccionSolicitudEnum.SIN_ACCION,RolSolicitudEnum.REMITENTE);

        //Agregar al asesor actual para información relevante
        Usuario asesor = usuarioServiceImpl.buscarUsuarioPorId(registroDto.getAsesorId(), "Asesor no encontrado");
        usuarioXSolicitudServiceImp.agregarUsuarioSolicitud(asesor, solicitud,AccionSolicitudEnum.SIN_ACCION,RolSolicitudEnum.ASESOR_ACTUAL);

        //Si el tema es incrito luego de registrar se procede al retiro
        if(estado == EstadoTemaEnum.INSCRITO){
            solicitudRepository.procesarRetiroAlumnoAutomatico(alumno.getId(), registroDto.getTemaId(), registroDto.getCreadorId());
        }
        return registroDto;
    }

    @Override
    public List<SolicitudCeseTemaResumenDto> listarResumenSolicitudCeseTemaUsuario(String cognitoId, List<String> roles) {
        Integer usuarioId = usuarioServiceImpl.obtenerIdUsuarioPorCognito(cognitoId);

        List<Object[]> queryRes = solicitudRepository.listarResumenSolicitudCeseTemaUsuario(usuarioId, Utils.convertListToPostgresArray(roles));

        List<SolicitudCeseTemaResumenDto> solicitudes = new ArrayList<>();
        for(Object[] res : queryRes){
            SolicitudCeseTemaResumenDto sol = SolicitudCeseTemaResumenDto.fromQuery(res);
            solicitudes.add(sol);
        }

        return solicitudes;
    }

    @Override
    public DetalleSolicitudCeseTema listarDetalleSolicitudCeseTema(Integer idSolicitud) {
        List<Object[]> queryRes = solicitudRepository.listarDetalleSolicitudCeseTema(idSolicitud);
        Object[] result = queryRes.get(0);
        if(result == null) return null;
        DetalleSolicitudCeseTema detalle = DetalleSolicitudCeseTema.fromQuery(result);
        Integer idRemitente = (Integer) result[7];
        UsuarioSolicitudCambioAsesorDto remitente = getUsuarioSolicitudFromId(idRemitente, idSolicitud, RolSolicitudEnum.REMITENTE);
        Integer idDestinatario = (Integer) result[8];
        UsuarioSolicitudCambioAsesorDto destinatario = null;
        if (idDestinatario != null) {
            destinatario = getUsuarioSolicitudFromId(idDestinatario, idSolicitud, RolSolicitudEnum.DESTINATARIO);
        }
        Integer idAsesor = (Integer) result[9];
        AsesorSolicitudCeseDto asesor = getAsesorCeseFromId(idAsesor);

        detalle.setSolicitante(remitente);
        detalle.setAsesorActual(asesor);
        detalle.setCoordinador(destinatario);

        return detalle;
    }


    @Override
    public DetalleSolicitudCambioAsesorDto listarDetalleSolicitudCambioAsesorUsuario(Integer idSolicitud) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleSolicitudCambioAsesor(idSolicitud);
        if (queryResult.isEmpty())
            return null;
        Object[] result = queryResult.get(0);
        DetalleSolicitudCambioAsesorDto detalle = DetalleSolicitudCambioAsesorDto.fromResultQuery(result);
        int idRemitente = (int) result[6];
        UsuarioSolicitudCambioAsesorDto remitente = getUsuarioSolicitudFromId(idRemitente, idSolicitud, RolSolicitudEnum.REMITENTE);
        int idAsesorActual = (int) result[7];
        UsuarioSolicitudCambioAsesorDto asesorActual = getUsuarioSolicitudFromId(idAsesorActual, idSolicitud, RolSolicitudEnum.ASESOR_ACTUAL);
        int idAsesorEntrada = (int) result[8];
        UsuarioSolicitudCambioAsesorDto asesorEntrada = getUsuarioSolicitudFromId(idAsesorEntrada, idSolicitud , RolSolicitudEnum.ASESOR_ENTRADA);
        Integer idDestinatario = (Integer) result[9];
        UsuarioSolicitudCambioAsesorDto destinatario = null;
        if (idDestinatario != null) {
            destinatario = getUsuarioSolicitudFromId(idDestinatario.intValue(), idSolicitud, RolSolicitudEnum.DESTINATARIO);
        }

        detalle.setSolicitante(remitente);
        detalle.setAsesorActual(asesorActual);
        detalle.setAsesorNuevo(asesorEntrada);
        detalle.setCoordinador(destinatario);

        return detalle;

    }

    @Transactional
    @Override
    public void aprobarRechazarSolicitudCambioAsesorAsesor(Integer idSolicitud, String idCognito, String comentario,String rol, boolean aprobar){
        // validar Solicitud se puede aprobar o rechazar verifica que haya una solcitud
        // con ese if y estado pendiente
        boolean validar = solicitudRepository.existsSolicitudByIdAndEstadoSolicitud_Nombre(idSolicitud,
                EstadoSolicitudEnum.PENDIENTE.name());

        //Variables para las notificaciones
        String mensajeNotificacion;
        Usuario otroAsesor =  usuarioXSolicitudServiceImp.getOtroAsesor(idSolicitud,rol);
        Usuario alumno = usuarioXSolicitudServiceImp.getUsuarioByNombreRol(idSolicitud, RolSolicitudEnum.REMITENTE.name());
        Tema tema = temaServiceImpl.getTemaFromSolicitud(idSolicitud);
        String rolSolictud;
        if(rol.equals(RolSolicitudEnum.ASESOR_ACTUAL.name())){
            rolSolictud = "asesor principal";
        }else{
            rolSolictud = "nuevo asesor";
        }


        if (!validar)
            throw new RuntimeException("Solicitud no puede ser modificada");
        if(aprobar){
            usuarioXSolicitudRepository.aprobarSolicitudCambioAsesorAsesor(idCognito, idSolicitud, comentario, rol);
            //El mensaje de aprobación
            mensajeNotificacion = String.format(
                    "La solicitud de cambio de asesor para el tema '%s' ha sido aprobada por el %s.",
                    tema.getTitulo(),
                    rolSolictud
            );
        }else{
            usuarioXSolicitudRepository.rechazarSolicitudCambioAsesorAsesor(idCognito, idSolicitud, comentario, rol);
            //El mensaje de rechazo
            mensajeNotificacion = String.format(
                    "La solicitud de cambio de asesor para el tema '%s' ha sido rechazada por el %s.",
                    tema.getTitulo(),
                    rolSolictud
            );
        }

        // Las notificaciones se envian al alumno y al otro asesor
        notificacionService.crearNotificacionParaUsuario(
                otroAsesor.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );
        //Notificaciones al alumno
        notificacionService.crearNotificacionParaUsuario(
                alumno.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );
    }


    @Transactional
    @Override
    public void aprobarRechazarSolicitudCambioAsesorCoordinador(Integer idSolicitud, String idCognito, String comentario, boolean aprobar) {
        // validar Solicitud se puede aprobar o rechazar verifica que haya una solcitud
        // con ese if y estado pendiente

        //Variables para las notificaciones
        String mensajeNotificacion;
        Usuario asesorActual =  usuarioXSolicitudServiceImp.getOtroAsesor(idSolicitud,RolSolicitudEnum.ASESOR_ACTUAL.name());
        Usuario nuevoAsesor = usuarioXSolicitudServiceImp.getUsuarioByNombreRol(idSolicitud, RolSolicitudEnum.ASESOR_ENTRADA.name());
        Usuario alumno = usuarioXSolicitudServiceImp.getUsuarioByNombreRol(idSolicitud, RolSolicitudEnum.REMITENTE.name());
        Tema tema = temaServiceImpl.getTemaFromSolicitud(idSolicitud);


        boolean validar = solicitudRepository.existsSolicitudByIdAndEstadoSolicitud_Nombre(idSolicitud,
                EstadoSolicitudEnum.PENDIENTE.name());
        if (!validar)
            throw new RuntimeException("Solicitud no puede ser modificada");
        if(aprobar){
            usuarioXSolicitudRepository.aprobarSolicitudCambioAsesorCoordinador(idCognito, idSolicitud, comentario);
            //El mensaje de aprobación
            mensajeNotificacion = String.format(
                    "La solicitud de cambio de asesor para el tema '%s' ha sido aprobada por un coordinador de la carrera.",
                    tema.getTitulo()
            );
        }else{
            usuarioXSolicitudRepository.rechazarSolicitudCambioAsesorCoordinador(idCognito, idSolicitud, comentario);
            //El mensaje de rechazo
            mensajeNotificacion = String.format(
                    "La solicitud de cambio de asesor para el tema '%s' ha sido rechazada por un coordinador de la carrera.",
                    tema.getTitulo()
            );
        }

        // Las notificaciones se envian al alumno y los 2 asesores
        notificacionService.crearNotificacionParaUsuario(
                asesorActual.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );
        notificacionService.crearNotificacionParaUsuario(
                nuevoAsesor.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );
        //Notificaciones al alumno
        notificacionService.crearNotificacionParaUsuario(
                alumno.getId(),
                "Asesores", // O un módulo específico para "Propuestas de Asesoría"
                "informativa", // O un tipo específico "NuevaPropuestaAsesoria"
                mensajeNotificacion,
                "SISTEMA",
                null
        );
    }

    private UsuarioSolicitudCambioAsesorDto getUsuarioSolicitudFromId(int idUsuario, int idSolicitud, RolSolicitudEnum rol) {
        List<Object[]> queryResult = solicitudRepository.listarDetalleUsuarioSolicitudCambioAsesor(idUsuario,
                idSolicitud, rol.name());
        Object[] result = queryResult.get(0);
        return UsuarioSolicitudCambioAsesorDto.fromQueryResult(result);
    }

    private AsesorSolicitudCeseDto getAsesorCeseFromId(int idUsuario){
        List<Object[]> queryResult = solicitudRepository.obtenerPerfilAsesorCese(idUsuario);
        Object[] result = queryResult.get(0);
        return AsesorSolicitudCeseDto.fromQueryResult(result);
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
                targetStatusNames.add("ACEPTADA");
                targetStatusNames.add("RECHAZADA");
            } else if ("approved".equalsIgnoreCase(status)) {
                targetStatusNames.add("ACEPTADA");
            } else if ("rejected".equalsIgnoreCase(status)) {
                targetStatusNames.add("RECHAZADA");
            }
        }
        if (targetStatusNames.isEmpty() && (status == null || status.trim().isEmpty())) {
            log.info("No se especificó filtro de estado o fue inválido. Se cargarán todos los estados (o según lógica de findSinFiltroEstado).");
        }

        log.info("Buscando solicitudes de tipo: '{}' para las carreras: {} y estados: {}",
                "Cese de Asesoria (por alumno)", idsCarrerasDelCoordinador, targetStatusNames);

        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaCreacion").descending());

        Page<Solicitud> pageOfSolicitudes;
        if (!targetStatusNames.isEmpty()) {
            pageOfSolicitudes = solicitudRepository.findConFiltroEstado(
                    idsCarrerasDelCoordinador, "Cese de Asesoria (por alumno)", targetStatusNames, pageable);
        } else {
            pageOfSolicitudes = solicitudRepository.findSinFiltroEstado(
                    idsCarrerasDelCoordinador, "Cese de Asesoria (por alumno)", pageable);
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

        RolSolicitud rolAsesorSolicitanteCese = rolSolicitudRepository.findByNombre("ASESOR_ACTUAL")
                .orElseThrow(() -> {
                    log.error("Configuración: Rol de solicitud 'ASESOR_ACTUAL' no encontrado en la BD.");
                    return new RuntimeException("Error de configuración interna: Rol ASESOR_ACTUAL no definido.");
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

    @Override
    @org.springframework.transaction.annotation.Transactional (readOnly = true)
    public Page<ReasignacionPendienteDto> findReasignacionesPendientes(
            String coordinadorCognitoSub,
            String searchTerm,
            Pageable pageable
    ) {
        log.info("Buscando reasignaciones pendientes para coordinador CognitoSub: {}, searchTerm: '{}', page: {}",
                coordinadorCognitoSub, searchTerm, pageable.getPageNumber());

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinadorCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Coordinador no encontrado con CognitoSub: " + coordinadorCognitoSub));

        List<UsuarioXCarrera> asignacionesCarreraCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId());
        if (asignacionesCarreraCoordinador.isEmpty()) {
            log.warn("Coordinador ID {} no tiene carreras activas asignadas.", coordinador.getId());
            return Page.empty(pageable);
        }
        List<Integer> idsCarrerasDelCoordinador = asignacionesCarreraCoordinador.stream()
                .map(uc -> uc.getCarrera().getId())
                .distinct()
                .collect(Collectors.toList());

        // Obtener las entidades TipoSolicitud y EstadoSolicitud necesarias
        TipoSolicitud tipoCese = tipoSolicitudRepository.findByNombre("Cese de Asesoria (por alumno)")
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de solicitud '" + "Cese de Asesoria (por alumno)" + "' no encontrado."));

        EstadoSolicitud estadoAprobada = estadoSolicitudRepository.findByNombre("ACEPTADA")
                .orElseThrow(() -> new ResourceNotFoundException("Estado de solicitud '" + "ACEPTADA" + "' no encontrado."));

        // Lista de estados de reasignación que indican acción pendiente por el coordinador
        List<String> estadosReasignacionPendienteCoord = Arrays.asList(
                "PREACEPTADA",
                "PENDIENTE_ACEPTACION_ASESOR"
                // SgtaConstants.ESTADO_REASIGNACION_CANCELADA_POR_COORDINADOR // Si este requiere acción también
        );
        // También podríamos incluir PENDIENTE_ACEPTACION_ASESOR si queremos que el coordinador vea a quién propuso
        // y potencialmente pueda cancelar esa propuesta para proponer a otro.
        // Por ahora, nos enfocaremos en los que requieren que *él* proponga.

        // Usar Specification para construir la query dinámicamente
        Specification<Solicitud> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("tipoSolicitud"), tipoCese));
            predicates.add(root.get("tema").get("carrera").get("id").in(idsCarrerasDelCoordinador));
            predicates.add(cb.isTrue(root.get("activo")));
            predicates.add(root.get("estadoSolicitud").get("nombre").in(estadosReasignacionPendienteCoord));

            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String likePattern = "%" + searchTerm.toLowerCase() + "%";

                // Subquery para encontrar UsuarioXSolicitud con rol REMITENTE
                Subquery<UsuarioXSolicitud> subquery = query.subquery(UsuarioXSolicitud.class);
                Root<UsuarioXSolicitud> uxsRoot = subquery.from(UsuarioXSolicitud.class);
                Join<Object, Object> usuarioJoin = uxsRoot.join("usuario");
                Join<Object, Object> rolJoin = uxsRoot.join("rolSolicitud");

                Predicate solicitudMatch = cb.equal(uxsRoot.get("solicitud"), root);
                Predicate rolRemitente = cb.equal(cb.lower(rolJoin.get("nombre")), "remitente");

                Predicate nombreLike = cb.like(cb.lower(usuarioJoin.get("nombres")), likePattern);
                Predicate apellidoLike = cb.like(cb.lower(usuarioJoin.get("primerApellido")), likePattern);

                subquery.select(uxsRoot)
                    .where(
                        solicitudMatch,
                        rolRemitente,
                        cb.or(nombreLike, apellidoLike)
                    );

                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("tema").get("titulo")), likePattern),
                    cb.exists(subquery)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Solicitud> paginaSolicitudes = solicitudRepository.findAll(spec, pageable);

        if (paginaSolicitudes.isEmpty()) {
            return Page.empty(pageable);
        }

        Rol rolTesista = rolRepository.findByNombre(ROL_NOMBRE_TESISTA).orElse(null); // Cargar una vez

        List<ReasignacionPendienteDto> dtos = paginaSolicitudes.getContent().stream()
                .map(solicitud -> {
                    ReasignacionPendienteDto dto = new ReasignacionPendienteDto();
                    dto.setSolicitudOriginalId(solicitud.getId());
                    dto.setFechaAprobacionCese(solicitud.getFechaResolucion()); // Fecha en que se aprobó el cese
                    dto.setMotivoCeseOriginal(solicitud.getDescripcion());

                    Tema tema = solicitud.getTema();
                    if (tema != null) {
                        dto.setTemaId(tema.getId());
                        dto.setTemaTitulo(tema.getTitulo());

                        // Obtener estudiantes
                        if (rolTesista != null) {
                            List<UsuarioXTema> tesistasDelTema = usuarioXTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(tema.getId(), rolTesista.getId());
                            dto.setEstudiantes(tesistasDelTema.stream()
                                    .map(ut -> ut.getUsuario())
                                    .filter(u -> u != null)
                                    .map(u -> new EstudianteSimpleDto(u.getId(), u.getNombres(), u.getPrimerApellido(), u.getSegundoApellido()))
                                    .collect(Collectors.toList()));
                        } else {
                            dto.setEstudiantes(Collections.emptyList());
                        }
                    }

                    RolSolicitud rolAsesorSolicitanteCese = rolSolicitudRepository.findByNombre("ASESOR_ACTUAL")
                    .orElseThrow(() -> {
                        log.error("Configuración: Rol de solicitud 'ASESOR_ACTUAL' no encontrado en la BD.");
                        return new RuntimeException("Error de configuración interna: Rol ASESOR_ACTUAL no definido.");
                    });

                    UsuarioXSolicitud asesorActual = usuarioXSolicitudRepository
                            .findFirstBySolicitudIdAndRolSolicitud(solicitud.getId(), rolAsesorSolicitanteCese)
                            .orElse(null);
                    Usuario asesorOriginal = asesorActual.getUsuario(); // Asume que este campo existe y está poblado
                    if (asesorOriginal != null) {
                        dto.setAsesorOriginalId(asesorOriginal.getId());
                        dto.setAsesorOriginalNombres(asesorOriginal.getNombres());
                        dto.setAsesorOriginalPrimerApellido(asesorOriginal.getPrimerApellido());
                        dto.setAsesorOriginalCorreo(asesorOriginal.getCorreoElectronico());
                    }

                    dto.setEstadoReasignacion(solicitud.getEstadoSolicitud().getNombre());

                    RolSolicitud rolAsesorNuevoCese = rolSolicitudRepository.findByNombre("ASESOR_ENTRADA")
                    .orElseThrow(() -> {
                        log.error("Configuración: Rol de solicitud 'ASESOR_ENTRADA' no encontrado en la BD.");
                        return new RuntimeException("Error de configuración interna: Rol ASESOR_ENTRADA no definido.");
                    });

                    UsuarioXSolicitud asesorNuevo = usuarioXSolicitudRepository
                            .findFirstBySolicitudIdAndRolSolicitud(solicitud.getId(), rolAsesorNuevoCese)
                            .orElse(null);

                    if (asesorNuevo != null) {
                    Usuario asesorPropuesto = asesorNuevo.getUsuario();
                        dto.setAsesorPropuestoId(asesorPropuesto.getId());
                        dto.setAsesorPropuestoNombres(asesorPropuesto.getNombres());
                        dto.setAsesorPropuestoPrimerApellido(asesorPropuesto.getPrimerApellido());
                        // La 'fechaPropuestaNuevoAsesor' podría ser la fecha_modificacion de la solicitud
                        // cuando estadoReasignacion cambió a PENDIENTE_ACEPTACION_ASESOR
                        // o cuando se seteó el asesorPropuestoReasignacion.
                        // Por simplicidad, si se necesita, se podría añadir un campo específico o usar fechaModificacion.
                        // Aquí, si el asesor está propuesto, asumimos que la fecha de mod de la solicitud es relevante.
                        if ("PENDIENTE_ACEPTACION_ASESOR".equals(solicitud.getEstadoSolicitud().getNombre())) {
                            dto.setFechaPropuestaNuevoAsesor(solicitud.getFechaModificacion());
                        }
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, paginaSolicitudes.getTotalElements());
    }

}
