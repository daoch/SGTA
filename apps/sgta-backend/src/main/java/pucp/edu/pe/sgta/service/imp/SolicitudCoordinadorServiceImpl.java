package pucp.edu.pe.sgta.service.imp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import pucp.edu.pe.sgta.exception.BusinessRuleException; // Excepción personalizada para reglas de negocio
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.model.*; // Todas tus entidades
import pucp.edu.pe.sgta.repository.*; // Todos tus repositorios
import pucp.edu.pe.sgta.service.inter.NotificacionService;
import pucp.edu.pe.sgta.service.inter.SolicitudCoordinadorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudCoordinadorServiceImpl implements SolicitudCoordinadorService {

    private static final Logger log = LoggerFactory.getLogger(SolicitudCoordinadorServiceImpl.class);

    // Repositorios
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private TemaRepository temaRepository;
    @Autowired private TipoSolicitudRepository tipoSolicitudRepository;
    @Autowired private EstadoSolicitudRepository estadoSolicitudRepository;
    @Autowired private SolicitudRepository solicitudRepository;
    @Autowired private UsuarioXTemaRepository usuarioTemaRepository;
    @Autowired private UsuarioXSolicitudRepository usuarioSolicitudRepository;
    @Autowired private RolRepository rolRepository;
    @Autowired private RolSolicitudRepository rolSolicitudRepository;
    @Autowired private AccionSolicitudRepository accionSolicitudRepository;

    // Otros Servicios
    @Autowired private NotificacionService notificacionService;


    // Nombres de referencia (idealmente serían Enums o constantes en una clase dedicada)
    private static final String ROL_NOMBRE_ASESOR = "Asesor";
    private static final String TIPO_SOLICITUD_NOMBRE_CESE = "Cese de Asesoria (por alumno)";
    private static final String ESTADO_SOLICITUD_NOMBRE_PENDIENTE = "PENDIENTE";
    private static final String ROL_SOLICITUD_ASESOR_CESE = "ASESOR_ACTUAL";
    private static final String ROL_SOLICITUD_COORDINADOR_GESTOR = "COORDINADOR_GESTOR";
    private static final String ROL_SOLICITUD_ESTUDIANTE_AFECTADO = "ESTUDIANTE_AFECTADO";
    private static final String ACCION_SOLICITUD_CREADA = "CREADA";
    private static final String ACCION_SOLICITUD_PENDIENTE_ACCION = "PENDIENTE_ACCION";
    private static final String ACCION_SOLICITUD_INFORMADO = "INFORMADO";

    // Nombres de Módulos y Tipos de Notificación (deben existir en tu BD)
    private static final String MODULO_NOMBRE_SOLICITUDES_CESE = "Asesores"; // Ejemplo, ajusta a tu BD
    private static final String MODULO_NOMBRE_ASESORIA_TEMA = "Asesores";     // Ejemplo, ajusta a tu BD

    // --- CONSTANTES DE TIPO_NOTIFICACION MODIFICADAS ---
    // Usar los nombres EXACTOS de tu tabla tipo_notificacion
        private static final String TIPO_NOTIF_INFORMATIVA = "informativa";
        private static final String TIPO_NOTIF_ADVERTENCIA = "advertencia";
    // private static final String TIPO_NOTIF_RECORDATORIO = "recordatorio"; // Si lo necesitas para otros casos
    // private static final String TIPO_NOTIF_ERROR = "error";             // Si lo necesitas para otros casos


    @Override
    @Transactional
    public Solicitud crearSolicitudCese(String asesorCognitoSub, Integer temaId, String motivo) {
        log.info("Creando solicitud de cese para asesor CognitoSub: {} y tema ID: {}", asesorCognitoSub, temaId);

        // 1. Validar y obtener entidades necesarias
        Usuario asesor = usuarioRepository.findByIdCognito(asesorCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con CognitoSub: " + asesorCognitoSub));

        Tema tema = temaRepository.findById(temaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tema no encontrado con ID: " + temaId));

        Rol rolAsesor = rolRepository.findByNombre(ROL_NOMBRE_ASESOR)
                .orElseThrow(() -> new ResourceNotFoundException("Rol '" + ROL_NOMBRE_ASESOR + "' no encontrado."));
        boolean esAsesorActivoDelTema = usuarioTemaRepository.existsByTema_IdAndUsuario_IdAndRol_IdAndActivoTrue(
                tema.getId(), asesor.getId(), rolAsesor.getId());

        if (!esAsesorActivoDelTema) {
            log.warn("Intento de crear solicitud de cese por usuario ID {} (CognitoSub: {}) que no es asesor activo del tema ID {}",
                    asesor.getId(), asesorCognitoSub, tema.getId());
            throw new BusinessRuleException("Usted no es el asesor activo de este tema.");
        }

        TipoSolicitud tipoCese = tipoSolicitudRepository.findByNombre(TIPO_SOLICITUD_NOMBRE_CESE)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de solicitud '" + TIPO_SOLICITUD_NOMBRE_CESE + "' no encontrado."));
        EstadoSolicitud estadoPendiente = estadoSolicitudRepository.findByNombre(ESTADO_SOLICITUD_NOMBRE_PENDIENTE)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de solicitud '" + ESTADO_SOLICITUD_NOMBRE_PENDIENTE + "' no encontrado."));

        List<Solicitud> solicitudesExistentes = solicitudRepository.findByTemaAndTipoSolicitudAndEstadoSolicitudAndActivoTrue(
                tema, tipoCese, estadoPendiente
        );
        for (Solicitud solExistente : solicitudesExistentes) {
            if (usuarioSolicitudRepository.existsBySolicitud_IdAndUsuario_IdAndRolSolicitud_Nombre(
                    solExistente.getId(), asesor.getId(), ROL_SOLICITUD_ASESOR_CESE
            )) {
                log.warn("Ya existe una solicitud de cese PENDIENTE para el tema ID {} por el asesor ID {} (CognitoSub: {})",
                        temaId, asesor.getId(), asesorCognitoSub);
                throw new BusinessRuleException("Ya tiene una solicitud de cese pendiente para este tema.");
            }
        }

        // 2. Crear la entidad Solicitud
        Solicitud nuevaSolicitud = new Solicitud();
        nuevaSolicitud.setTema(tema);
        nuevaSolicitud.setTipoSolicitud(tipoCese);
        nuevaSolicitud.setDescripcion(motivo);
        nuevaSolicitud.setEstadoSolicitud(estadoPendiente);
        nuevaSolicitud.setEstado(1); // Campo antiguo: 1 para PENDIENTE
        nuevaSolicitud.setActivo(true);
        nuevaSolicitud.setFechaCreacion(OffsetDateTime.now());
        nuevaSolicitud.setFechaModificacion(OffsetDateTime.now());
        // fechaCreacion y fechaModificacion se establecen por @PrePersist en la entidad Solicitud

        Solicitud solicitudGuardada = solicitudRepository.save(nuevaSolicitud);
        log.info("Solicitud de cese guardada con ID: {}", solicitudGuardada.getId());

        // 3. Crear entradas en UsuarioSolicitud
        RolSolicitud rolSolAsesorCese = rolSolicitudRepository.findByNombre(ROL_SOLICITUD_ASESOR_CESE)
                .orElseThrow(() -> new ResourceNotFoundException("RolSolicitud '" + ROL_SOLICITUD_ASESOR_CESE + "' no encontrado."));

        UsuarioXSolicitud usAsesor = new UsuarioXSolicitud();
        usAsesor.setSolicitud(solicitudGuardada);
        usAsesor.setUsuario(asesor);
        usAsesor.setRolSolicitud(rolSolAsesorCese);
        usAsesor.setComentario(motivo);
        usAsesor.setActivo(true);
        usAsesor.setFechaAccion(OffsetDateTime.now());
        usAsesor.setSolicitudCompletada(false);
        usAsesor.setAprobado(false);
        usAsesor.setDestinatario(false);
        usAsesor.setFechaCreacion(OffsetDateTime.now());
        usAsesor.setFechaModificacion(OffsetDateTime.now());
        usuarioSolicitudRepository.save(usAsesor);
        log.info("UsuarioSolicitud para asesor ID {} (CognitoSub: {}) y solicitud ID {} creada.",
                asesor.getId(), asesorCognitoSub, solicitudGuardada.getId());

        // Añadir REMITENTE
        RolSolicitud rolSolRemitente = rolSolicitudRepository.findByNombre("REMITENTE")
                .orElseThrow(() -> new ResourceNotFoundException("RolSolicitud '" + "REMITENTE" + "' no encontrado."));

        UsuarioXSolicitud usRemitente = new UsuarioXSolicitud();
        usRemitente.setSolicitud(solicitudGuardada);
        usRemitente.setUsuario(asesor);
        usRemitente.setRolSolicitud(rolSolRemitente);
        usRemitente.setComentario(motivo);
        usRemitente.setActivo(true);
        usRemitente.setFechaAccion(OffsetDateTime.now());
        usRemitente.setSolicitudCompletada(false);
        usRemitente.setAprobado(false);
        usRemitente.setDestinatario(false);
        usRemitente.setFechaCreacion(OffsetDateTime.now());
        usRemitente.setFechaModificacion(OffsetDateTime.now());
        usuarioSolicitudRepository.save(usRemitente);
        log.info("UsuarioSolicitud para asesor ID {} (CognitoSub: {}) y solicitud ID {} creada.",
        asesor.getId(), asesorCognitoSub, solicitudGuardada.getId());

        // Notificar al/los coordinador(es)
        // RolSolicitud rolSolCoordGestor = rolSolicitudRepository.findByNombre(ROL_SOLICITUD_COORDINADOR_GESTOR)
        //         .orElseThrow(() -> new ResourceNotFoundException("RolSolicitud '" + ROL_SOLICITUD_COORDINADOR_GESTOR + "' no encontrado."));
        // AccionSolicitud accionSolPendiente = accionSolicitudRepository.findByNombre(ACCION_SOLICITUD_PENDIENTE_ACCION)
        //         .orElseThrow(() -> new ResourceNotFoundException("AccionSolicitud '" + ACCION_SOLICITUD_PENDIENTE_ACCION + "' no encontrada."));

        // if (tema.getCarrera() == null) {
        //     log.error("El tema ID {} no tiene una carrera asociada. No se puede notificar a coordinadores.", tema.getId());
        //     throw new BusinessRuleException("El tema no está asociado a ninguna carrera, no se puede procesar la solicitud.");
        // }
        // List<Usuario> coordinadores = usuarioRepository.findUsuariosActivosPorCarreraYTipo(
        //         tema.getCarrera().getId(), "coordinador"
        // );
        // if (coordinadores.isEmpty()) {
        //     log.warn("No se encontraron coordinadores activos para la carrera ID: {} del tema ID: {}",
        //             tema.getCarrera().getId(), tema.getId());
        // }

        // for (Usuario coordinador : coordinadores) {
        //     UsuarioSolicitud usCoordinador = new UsuarioSolicitud();
        //     usCoordinador.setSolicitud(solicitudGuardada);
        //     usCoordinador.setUsuario(coordinador);
        //     usCoordinador.setRolSolicitud(rolSolCoordGestor);
        //     usCoordinador.setAccionSolicitud(accionSolPendiente);
        //     usCoordinador.setActivo(true);
        //     usCoordinador.setDestinatario(true);
        //     usuarioSolicitudRepository.save(usCoordinador);
        //     log.info("UsuarioSolicitud para coordinador ID {} y solicitud ID {} creada.", coordinador.getId(), solicitudGuardada.getId());

        //     // Enviar notificación al coordinador
        //     try {
        //         String enlaceCoordinador = String.format("/coordinador/solicitudes/cese?id=%d&status=pending", solicitudGuardada.getId()); // Ejemplo de enlace
        //         notificacionService.crearNotificacionParaUsuario(
        //                 coordinador.getId(),
        //                 MODULO_NOMBRE_SOLICITUDES_CESE,
        //                 TIPO_NOTIF_INFORMATIVA,
        //                 String.format("El asesor %s %s ha solicitado el cese de asesoría para el tema '%s'. Solicitud ID: %d.",
        //                         asesor.getNombres(), asesor.getPrimerApellido(), tema.getTitulo(), solicitudGuardada.getId()),
        //                 "SISTEMA", // Canal
        //                 enlaceCoordinador
        //         );
        //         log.info("Notificación creada para coordinador ID {}", coordinador.getId());
        //     } catch (Exception e) {
        //         log.error("Error al crear notificación para coordinador ID {}: {}", coordinador.getId(), e.getMessage(), e);
        //         // Decide si este error debe detener la transacción o solo registrarse.
        //     }
        // }

        // Notificar al/los estudiante(s)
        RolSolicitud rolSolEstudianteAfectado = rolSolicitudRepository.findByNombre(ROL_SOLICITUD_ESTUDIANTE_AFECTADO)
                .orElseThrow(() -> new ResourceNotFoundException("RolSolicitud '" + ROL_SOLICITUD_ESTUDIANTE_AFECTADO + "' no encontrado."));
        Rol rolTesista = rolRepository.findByNombre("Tesista")
                .orElseThrow(() -> new ResourceNotFoundException("Rol 'Tesista' no encontrado."));

        List<UsuarioXTema> tesistasDelTema = usuarioTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(tema.getId(), rolTesista.getId());
        if (tesistasDelTema.isEmpty()) {
            log.warn("El tema ID {} no tiene tesistas activos asociados para notificar.", tema.getId());
        }
        for (UsuarioXTema relacionTesista : tesistasDelTema) {
            Usuario tesista = relacionTesista.getUsuario();
            if (tesista == null) {
                log.warn("Relación UsuarioXTema ID {} para tema ID {} tiene un usuario nulo.", relacionTesista.getId(), tema.getId());
                continue;
            }
            UsuarioXSolicitud usEstudiante = new UsuarioXSolicitud();
            usEstudiante.setSolicitud(solicitudGuardada);
            usEstudiante.setUsuario(tesista);
            usEstudiante.setRolSolicitud(rolSolEstudianteAfectado);
            usEstudiante.setActivo(true);
            usEstudiante.setDestinatario(true);
            usEstudiante.setFechaAccion(OffsetDateTime.now());
            usEstudiante.setFechaCreacion(OffsetDateTime.now());
            usEstudiante.setFechaModificacion(OffsetDateTime.now());
            usuarioSolicitudRepository.save(usEstudiante);
            log.info("UsuarioSolicitud para estudiante ID {} y solicitud ID {} creada.", tesista.getId(), solicitudGuardada.getId());

            // Enviar notificación al estudiante
            // try {
            //     String enlaceEstudiante = String.format("/alumno/mis-temas/%d/solicitud-cese/%d", tema.getId(), solicitudGuardada.getId()); // Ejemplo
            //     notificacionService.crearNotificacionParaUsuario(
            //             tesista.getId(),
            //             MODULO_NOMBRE_ASESORIA_TEMA,
            //             TIPO_NOTIF_ADVERTENCIA,
            //             String.format("Su asesor, %s %s, ha solicitado el cese de la asesoría para su tema: '%s'.",
            //                     asesor.getNombres(), asesor.getPrimerApellido(), tema.getTitulo()),
            //             "SISTEMA",
            //             enlaceEstudiante
            //     );
            //     log.info("Notificación creada para estudiante ID {}", tesista.getId());
            // } catch (Exception e) {
            //     log.error("Error al crear notificación para estudiante ID {}: {}", tesista.getId(), e.getMessage(), e);
            // }
        }

        return solicitudGuardada;
    }

}