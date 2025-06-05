package pucp.edu.pe.sgta.service.imp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import pucp.edu.pe.sgta.config.SgtaConstants;
import pucp.edu.pe.sgta.dto.asesores.EstudianteSimpleDto;
import pucp.edu.pe.sgta.dto.asesores.ReasignacionPendienteDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudActualizadaDto;
import pucp.edu.pe.sgta.exception.BusinessRuleException;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.CoordinadorSolicitudService;
import pucp.edu.pe.sgta.service.inter.NotificacionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException; // Para permisos

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification; // Para queries dinámicas
import jakarta.persistence.criteria.Predicate; // Para Criteria API

@Service
public class CoordinadorSolicitudServiceImpl implements CoordinadorSolicitudService {
    private static final Logger log = LoggerFactory.getLogger(CoordinadorSolicitudServiceImpl.class);

    @Autowired private SolicitudRepository solicitudRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private UsuarioXCarreraRepository usuarioXCarreraRepository;
    @Autowired private EstadoSolicitudRepository estadoSolicitudRepository;
    @Autowired private UsuarioSolicitudRepository usuarioSolicitudRepository;
    @Autowired private AccionSolicitudRepository accionSolicitudRepository;
    @Autowired private NotificacionService notificacionService;
    @Autowired private TipoSolicitudRepository tipoSolicitudRepository; // Para obtener el tipo "Cese Asesoria"
    @Autowired private UsuarioXTemaRepository usuarioXTemaRepository; // Para obtener estudiantes

    @Autowired
    private RolSolicitudRepository rolSolicitudRepository; // AÑADIR SI FALTA

    @Autowired
    private RolRepository rolRepository; // AÑADIR SI FALTA

    @Autowired
    private UsuarioXTemaRepository usuarioTemaRepository; // AÑADIR SI FALTA

    // Constantes de nombres de estados, roles, acciones, módulos, tipos de notificación
    private static final String ESTADO_SOLICITUD_PENDIENTE = "PENDIENTE";
    private static final String ESTADO_SOLICITUD_APROBADA = "APROBADA";
    private static final String ACCION_SOLICITUD_ACEPTADO = "ACEPTADO"; // Para la acción del coordinador
    private static final String MODULO_NOMBRE_SOLICITUDES_CESE = "Asesores"; // Debe existir en BD
    private static final String TIPO_NOTIF_SOLICITUD_APROBADA = "informativa"; // Debe existir en BD
    private static final String ROL_SOLICITUD_COORDINADOR_GESTOR = "COORDINADOR_GESTOR";
    public static final String ROL_SOLICITUD_ASESOR_CESE = "ASESOR_SOLICITANTE_CESE";

    @Override
    @Transactional
    public SolicitudActualizadaDto aprobarSolicitudCese(Integer solicitudId, String comentarioAprobacion, String coordinadorCognitoSub) {
        log.info("Coordinador {} aprobando solicitud ID {}", coordinadorCognitoSub, solicitudId);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinadorCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException("Coordinador no encontrado con CognitoSub: " + coordinadorCognitoSub));

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con ID: " + solicitudId));

        // Validación de permiso: El coordinador debe pertenecer a la carrera del tema de la solicitud
        validarPermisoCoordinadorSobreSolicitud(coordinador, solicitud);

        // Validar que la solicitud esté PENDIENTE
        if (solicitud.getEstadoSolicitud() == null || !ESTADO_SOLICITUD_PENDIENTE.equalsIgnoreCase(solicitud.getEstadoSolicitud().getNombre())) {
            throw new BusinessRuleException("La solicitud ID " + solicitudId + " no está en estado PENDIENTE y no puede ser aprobada.");
        }

        EstadoSolicitud estadoAprobada = estadoSolicitudRepository.findByNombre(ESTADO_SOLICITUD_APROBADA)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de solicitud '" + ESTADO_SOLICITUD_APROBADA + "' no encontrado."));

        solicitud.setEstadoSolicitud(estadoAprobada);
        solicitud.setEstado(0); // Fallback campo antiguo: 0 para aprobada
        solicitud.setRespuesta(comentarioAprobacion);
        solicitud.setFechaResolucion(OffsetDateTime.now());
        solicitud.setFechaModificacion(OffsetDateTime.now()); // JPA @PreUpdate también lo haría
        // asesor_propuesto_reasignacion_id y estado_reasignacion se manejan en el siguiente flujo

        Solicitud solicitudActualizada = solicitudRepository.save(solicitud);

        // Actualizar UsuarioSolicitud para el coordinador
        AccionSolicitud accionAceptado = accionSolicitudRepository.findByNombre(ACCION_SOLICITUD_ACEPTADO)
                .orElseThrow(() -> new ResourceNotFoundException("AccionSolicitud '" + ACCION_SOLICITUD_ACEPTADO + "' no encontrado."));

        // Encontrar la entrada UsuarioSolicitud del coordinador para esta solicitud
        // Asumiendo que el coordinador ya está vinculado con rol COORDINADOR_GESTOR y acción PENDIENTE_ACCION
        UsuarioSolicitud usCoordinador = usuarioSolicitudRepository.findBySolicitud_IdAndUsuario_IdAndRolSolicitud_Nombre(
                        solicitudId, coordinador.getId(), ROL_SOLICITUD_COORDINADOR_GESTOR)
                .stream().filter(us -> "PENDIENTE_ACCION".equals(us.getAccionSolicitud().getNombre())).findFirst()
                .orElseGet(() -> { // Si no existe, crear una nueva (esto es un fallback, idealmente ya existe)
                    log.warn("No se encontró UsuarioSolicitud PENDIENTE_ACCION para coordinador {} y solicitud {}. Creando una nueva.", coordinador.getId(), solicitudId);
                    UsuarioSolicitud nuevaUs = new UsuarioSolicitud();
                    nuevaUs.setSolicitud(solicitudActualizada);
                    nuevaUs.setUsuario(coordinador);
                    nuevaUs.setRolSolicitud(rolSolicitudRepository.findByNombre(ROL_SOLICITUD_COORDINADOR_GESTOR).orElse(null));
                    return nuevaUs;
                });

        usCoordinador.setAccionSolicitud(accionAceptado);
        usCoordinador.setComentario(comentarioAprobacion);
        usCoordinador.setFechaAccion(OffsetDateTime.now());
        usCoordinador.setAprobado(true); // Campo antiguo
        usCoordinador.setSolicitudCompletada(true); // Campo antiguo
        usuarioSolicitudRepository.save(usCoordinador);


        // Notificar al asesor solicitante y a los estudiantes
        // 1. Encontrar al asesor solicitante original
        Usuario asesorSolicitante = encontrarAsesorSolicitante(solicitudActualizada);
        if (asesorSolicitante != null) {
            notificacionService.crearNotificacionParaUsuario(
                    asesorSolicitante.getId(),
                    MODULO_NOMBRE_SOLICITUDES_CESE,
                    TIPO_NOTIF_SOLICITUD_APROBADA, // Necesitas este tipo de notificación
                    "Su solicitud de cese de asesoría para el tema '" + solicitudActualizada.getTema().getTitulo() + "' ha sido APROBADA.",
                    "SISTEMA",
                    null // Enlace opcional
            );
        }

        // 2. Notificar a los estudiantes del tema
        Rol rolTesista = rolRepository.findByNombre("Tesista").orElse(null);
        if (rolTesista != null) {
            List<UsuarioXTema> tesistasDelTema = usuarioTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(
                    solicitudActualizada.getTema().getId(), rolTesista.getId());
            for (UsuarioXTema ut : tesistasDelTema) {
                notificacionService.crearNotificacionParaUsuario(
                        ut.getUsuario().getId(),
                        MODULO_NOMBRE_SOLICITUDES_CESE,
                        TIPO_NOTIF_SOLICITUD_APROBADA,
                        "La solicitud de cese de su asesor para el tema '" + solicitudActualizada.getTema().getTitulo() + "' ha sido APROBADA. Se procederá con la reasignación.",
                        "SISTEMA",
                        null // Enlace opcional
                );
            }
        }

        return new SolicitudActualizadaDto(
                solicitudActualizada.getId(),
                solicitudActualizada.getEstadoSolicitud().getNombre(),
                solicitudActualizada.getRespuesta(),
                solicitudActualizada.getFechaResolucion()
        );
    }

    // Método auxiliar para validar permiso del coordinador
    private void validarPermisoCoordinadorSobreSolicitud(Usuario coordinador, Solicitud solicitud) {
        if (solicitud.getTema() == null || solicitud.getTema().getCarrera() == null) {
            throw new BusinessRuleException("La solicitud no tiene un tema o carrera asociada para validar permisos.");
        }
        Integer carreraDeLaSolicitudId = solicitud.getTema().getCarrera().getId();
        boolean perteneceACarreraDelCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId())
                .stream()
                .anyMatch(uc -> uc.getCarrera() != null && uc.getCarrera().getId().equals(carreraDeLaSolicitudId));
        if (!perteneceACarreraDelCoordinador) {
            throw new AccessDeniedException("No tiene permisos para gestionar esta solicitud ya que no pertenece a su carrera.");
        }
    }

    // Método auxiliar para encontrar al asesor que creó la solicitud
    private Usuario encontrarAsesorSolicitante(Solicitud solicitud) {
        // Necesitas un método en UsuarioSolicitudRepository que busque por solicitudId y rolSolicitud.nombre
        // y devuelva List<UsuarioSolicitud> o Optional<UsuarioSolicitud> si esperas solo uno.
        // Por ejemplo: findBySolicitud_IdAndRolSolicitud_Nombre(Integer solicitudId, String rolNombre)

        String rolAsesorCese = ROL_SOLICITUD_ASESOR_CESE; // Usando la clase de constantes
        // O la constante local: private static final String ROL_SOLICITUD_ASESOR_CESE = "ASESOR_SOLICITANTE_CESE";


        List<UsuarioSolicitud> usAsesores = usuarioSolicitudRepository.findBySolicitud_IdAndRolSolicitud_Nombre(
                solicitud.getId(),
                rolAsesorCese
        );

        if (!usAsesores.isEmpty()) {
            // Asumimos que solo debería haber un ASESOR_SOLICITANTE_CESE por solicitud
            return usAsesores.get(0).getUsuario();
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
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
        TipoSolicitud tipoCese = tipoSolicitudRepository.findByNombre(SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de solicitud '" + SgtaConstants.TIPO_SOLICITUD_NOMBRE_CESE + "' no encontrado."));

        EstadoSolicitud estadoAprobada = estadoSolicitudRepository.findByNombre(SgtaConstants.ESTADO_SOLICITUD_APROBADA)
                .orElseThrow(() -> new ResourceNotFoundException("Estado de solicitud '" + SgtaConstants.ESTADO_SOLICITUD_APROBADA + "' no encontrado."));

        // Lista de estados de reasignación que indican acción pendiente por el coordinador
        List<String> estadosReasignacionPendienteCoord = Arrays.asList(
                SgtaConstants.ESTADO_REASIGNACION_PENDIENTE_PROPUESTA,
                SgtaConstants.ESTADO_REASIGNACION_RECHAZADA_POR_ASESOR,
                SgtaConstants.ESTADO_REASIGNACION_PENDIENTE_ASESOR
                // SgtaConstants.ESTADO_REASIGNACION_CANCELADA_POR_COORDINADOR // Si este requiere acción también
        );
        // También podríamos incluir PENDIENTE_ACEPTACION_ASESOR si queremos que el coordinador vea a quién propuso
        // y potencialmente pueda cancelar esa propuesta para proponer a otro.
        // Por ahora, nos enfocaremos en los que requieren que *él* proponga.

        // Usar Specification para construir la query dinámicamente
        Specification<Solicitud> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("tipoSolicitud"), tipoCese));
            predicates.add(cb.equal(root.get("estadoSolicitud"), estadoAprobada));
            predicates.add(root.get("tema").get("carrera").get("id").in(idsCarrerasDelCoordinador));
            predicates.add(cb.isTrue(root.get("activo")));
            predicates.add(root.get("estadoReasignacion").in(estadosReasignacionPendienteCoord));

            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String likePattern = "%" + searchTerm.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("tema").get("titulo")), likePattern),
                        cb.like(cb.lower(root.get("usuarioCreador").get("nombres")), likePattern), // Asesor original
                        cb.like(cb.lower(root.get("usuarioCreador").get("primerApellido")), likePattern)
                ));
            }
            // Evitar N+1 problems para las relaciones que usaremos al mapear
            // Esto es opcional aquí si las relaciones son EAGER o si el número de resultados por página es pequeño
            // query.distinct(true); // Si hay joins que puedan causar duplicados de Solicitud
            // root.fetch("tema", JoinType.LEFT);
            // root.fetch("usuarioCreador", JoinType.LEFT);
            // root.fetch("asesorPropuestoReasignacion", JoinType.LEFT);

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Solicitud> paginaSolicitudes = solicitudRepository.findAll(spec, pageable);

        if (paginaSolicitudes.isEmpty()) {
            return Page.empty(pageable);
        }

        Rol rolTesista = rolRepository.findByNombre(SgtaConstants.ROL_NOMBRE_TESISTA).orElse(null); // Cargar una vez

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

                    Usuario asesorOriginal = solicitud.getUsuarioCreador(); // Asume que este campo existe y está poblado
                    if (asesorOriginal != null) {
                        dto.setAsesorOriginalId(asesorOriginal.getId());
                        dto.setAsesorOriginalNombres(asesorOriginal.getNombres());
                        dto.setAsesorOriginalPrimerApellido(asesorOriginal.getPrimerApellido());
                        dto.setAsesorOriginalCorreo(asesorOriginal.getCorreoElectronico());
                    }

                    dto.setEstadoReasignacion(solicitud.getEstadoReasignacion());

                    Usuario asesorPropuesto = solicitud.getAsesorPropuestoReasignacion();
                    if (asesorPropuesto != null) {
                        dto.setAsesorPropuestoId(asesorPropuesto.getId());
                        dto.setAsesorPropuestoNombres(asesorPropuesto.getNombres());
                        dto.setAsesorPropuestoPrimerApellido(asesorPropuesto.getPrimerApellido());
                        // La 'fechaPropuestaNuevoAsesor' podría ser la fecha_modificacion de la solicitud
                        // cuando estadoReasignacion cambió a PENDIENTE_ACEPTACION_ASESOR
                        // o cuando se seteó el asesorPropuestoReasignacion.
                        // Por simplicidad, si se necesita, se podría añadir un campo específico o usar fechaModificacion.
                        // Aquí, si el asesor está propuesto, asumimos que la fecha de mod de la solicitud es relevante.
                        if (SgtaConstants.ESTADO_REASIGNACION_PENDIENTE_ACEPTACION_ASESOR.equals(solicitud.getEstadoReasignacion())) {
                            dto.setFechaPropuestaNuevoAsesor(solicitud.getFechaModificacion());
                        }
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, paginaSolicitudes.getTotalElements());
    }
}