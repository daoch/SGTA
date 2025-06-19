package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import pucp.edu.pe.sgta.dto.asesores.AsesorDisponibleDto;
import pucp.edu.pe.sgta.dto.asesores.AsesorTemaActivoDto;
import pucp.edu.pe.sgta.dto.asesores.EstudianteSimpleDto;
import pucp.edu.pe.sgta.dto.asesores.InvitacionAsesoriaDto;
import pucp.edu.pe.sgta.exception.BusinessRuleException;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.service.inter.NotificacionService;
import pucp.edu.pe.sgta.service.inter.SolicitudAsesorService;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SolicitudAsesorServiceImpl implements SolicitudAsesorService {

    private static final Logger log = LoggerFactory.getLogger(SolicitudAsesorServiceImpl.class);

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private UsuarioXTemaRepository usuarioXTemaRepository;
    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioXCarreraRepository usuarioXCarreraRepository;

    @Autowired
    private EntityManager entityManager; // Para construir queries dinámicas con JPQL

    @Autowired
    private SolicitudRepository solicitudRepository; // Para buscar las solicitudes propuestas

    @Autowired
    private NotificacionService notificacionService; // Para enviar notificaciones

    private static final String ROL_NOMBRE_ASESOR = "Asesor";
    private static final String TIPO_USUARIO_PROFESOR = "Profesor";

    @Override
    @Transactional(readOnly = true) // Este método es de solo lectura
    public List<AsesorTemaActivoDto> findTemasActivosByAsesorCognitoSub(String asesorCognitoSub) {
        log.debug("Buscando temas activos para asesor con CognitoSub: {}", asesorCognitoSub);

        Usuario asesor = usuarioRepository.findByIdCognito(asesorCognitoSub)
                .orElseThrow(() -> {
                    log.warn("No se encontró usuario asesor con CognitoSub: {}", asesorCognitoSub);
                    return new ResourceNotFoundException("Usuario asesor no encontrado.");
                });

        if (asesor.getTipoUsuario() == null || !"profesor".equalsIgnoreCase(asesor.getTipoUsuario().getNombre())) {
            log.warn("Usuario con CognitoSub {} no es de tipo 'profesor'. No puede tener temas de asesoría.", asesorCognitoSub);
            return Collections.emptyList(); // O lanzar una excepción de permisos si se prefiere
        }

        Rol rolAsesor = rolRepository.findByNombre(ROL_NOMBRE_ASESOR)
                .orElseThrow(() -> {
                    log.error("Rol '{}' no encontrado en la base de datos. No se pueden buscar temas de asesor.", ROL_NOMBRE_ASESOR);
                    return new ResourceNotFoundException("Configuración de rol 'Asesor' faltante.");
                });

        // Usar el método del repositorio que busca por Usuario, Rol y activo.
        // Necesitamos asegurar que el método en UsuarioXTemaRepository tome el objeto Usuario y Rol.
        // Si no, modificaremos el repositorio.
        // Asumamos que tenemos: List<UsuarioXTema> findByUsuarioAndRolAndActivoTrue(Usuario usuario, Rol rol);

        List<UsuarioXTema> relacionesActivas = usuarioXTemaRepository.findByUsuarioAndRolAndActivoTrue(asesor, rolAsesor);

        if (relacionesActivas.isEmpty()) {
            log.info("Asesor ID {} (CognitoSub: {}) no tiene temas de asesoría activos.", asesor.getId(), asesorCognitoSub);
            return Collections.emptyList();
        }

        return relacionesActivas.stream()
                .filter(ut -> ut.getTema() != null) // Asegurar que el tema no sea nulo
                .map(ut -> new AsesorTemaActivoDto(ut.getTema().getId(), ut.getTema().getTitulo()))
                .distinct() // En caso de que haya múltiples relaciones al mismo tema (no debería)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AsesorDisponibleDto> buscarAsesoresDisponibles(
            String coordinadorCognitoSub,
            String searchTerm,
            List<Integer> areaConocimientoIds,
            Pageable pageable
    ) {
        log.info("Buscando asesores disponibles para coordinador CognitoSub: {}, searchTerm: '{}', areas: {}", 
                coordinadorCognitoSub, searchTerm, areaConocimientoIds);

        Usuario coordinador = usuarioRepository.findByIdCognito(coordinadorCognitoSub)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Coordinador no encontrado con CognitoSub: " + coordinadorCognitoSub));

        List<UsuarioXCarrera> asignacionesCarreraCoordinador = 
                usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId());
        if (asignacionesCarreraCoordinador.isEmpty()) {
            log.warn("Coordinador ID {} no tiene carreras activas asignadas. No se pueden listar asesores.", coordinador.getId());
            return Page.empty(pageable);
        }
        List<Integer> idsCarrerasDelCoordinador = asignacionesCarreraCoordinador.stream()
                .map(uc -> uc.getCarrera().getId())
                .distinct()
                .collect(Collectors.toList());

        log.warn("idsCarrerasDelCoordinador: {}", idsCarrerasDelCoordinador);

        // Construir la query JPQL dinámicamente
        StringBuilder jpqlBuilder = new StringBuilder(
                "SELECT DISTINCT u FROM Usuario u " +
                "JOIN u.tipoUsuario tu " +
                "JOIN UsuarioXCarrera uc ON u.id = uc.usuario.id " +
                "WHERE tu.nombre = :tipoProfesor " +
                "AND u.activo = true " +
                "AND uc.activo = true " +
                "AND uc.carrera.id IN :carrerasDelCoordinador "
        );

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("tipoProfesor", "profesor");
        parameters.put("carrerasDelCoordinador", idsCarrerasDelCoordinador);

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            jpqlBuilder.append(
                "AND (LOWER(u.nombres) LIKE LOWER(:searchTerm) OR " +
                "LOWER(u.primerApellido) LIKE LOWER(:searchTerm) OR " +
                "LOWER(u.segundoApellido) LIKE LOWER(:searchTerm) OR " +
                "LOWER(u.correoElectronico) LIKE LOWER(:searchTerm) OR " +
                "LOWER(u.codigoPucp) LIKE LOWER(:searchTerm)) "
            );
            parameters.put("searchTerm", "%" + searchTerm.trim() + "%");
        }

        if (areaConocimientoIds != null && !areaConocimientoIds.isEmpty()) {
            jpqlBuilder.append(
                "AND EXISTS (SELECT uac FROM UsuarioXAreaConocimiento uac " +
                "WHERE uac.usuario = u AND uac.areaConocimiento.id IN :areaConocimientoIds " +
                "AND uac.activo = true) "
            );
            parameters.put("areaConocimientoIds", areaConocimientoIds);
        }

        // Query para contar el total de elementos
        String countJpql = jpqlBuilder.toString().replace("SELECT DISTINCT u", "SELECT COUNT(DISTINCT u.id)");
        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        parameters.forEach(countQuery::setParameter);
        long totalAsesores = countQuery.getSingleResult();

        if (totalAsesores == 0) {
            log.info("No se encontraron asesores disponibles para coordinador={}, searchTerm='{}', areas={}", 
                    coordinadorCognitoSub, searchTerm, areaConocimientoIds);
            return Page.empty(pageable);
        }

        // Aplicar ordenación si existe
        if (pageable.getSort().isSorted()) {
            jpqlBuilder.append(" ORDER BY ");
            List<String> sortOrders = new ArrayList<>();
            pageable.getSort().forEach(order -> {
                sortOrders.add("u." + order.getProperty() + " " + order.getDirection().name());
            });
            jpqlBuilder.append(String.join(", ", sortOrders));
        }

        // Ejecutar consulta principal
        TypedQuery<Usuario> query = entityManager.createQuery(jpqlBuilder.toString(), Usuario.class);
        parameters.forEach(query::setParameter);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Usuario> asesoresEntidades = query.getResultList();

        if (asesoresEntidades.isEmpty()) {
            log.info("La consulta JPQL no retornó asesores (Query: {})", jpqlBuilder.toString());
        } else {
            log.info(
                "Asesores recuperados ({}): {}",
                asesoresEntidades.size(),
                asesoresEntidades.stream()
                    .map(a -> a.getId() + ":" + a.getNombres() + " " + a.getPrimerApellido())
                    .collect(Collectors.joining(", "))
            );
        }

        // Mapear a DTOs y regresar paginado
        List<AsesorDisponibleDto> asesoresDtos = asesoresEntidades.stream()
            .map(asesor -> {
                Integer cantidadTemas = usuarioXTemaRepository
                    .countByUsuarioAndRol_NombreAndActivoTrue(asesor, ROL_NOMBRE_ASESOR);
                return new AsesorDisponibleDto(
                    asesor.getId(),
                    asesor.getNombres(),
                    asesor.getPrimerApellido(),
                    asesor.getSegundoApellido(),
                    asesor.getCorreoElectronico(),
                    asesor.getCodigoPucp(),
                    cantidadTemas,
                    null
                );
            })
            .collect(Collectors.toList());

        return new PageImpl<>(asesoresDtos, pageable, totalAsesores);
    }

    // @Override
    // @Transactional(readOnly = true)
    // public Page<InvitacionAsesoriaDto> findInvitacionesAsesoriaPendientesByAsesor(String asesorCognitoSub, Pageable pageable) {
    //     log.info("Buscando invitaciones de asesoría pendientes para asesor CognitoSub: {}", asesorCognitoSub);

    //     Usuario asesorPropuesto = usuarioRepository.findByIdCognito(asesorCognitoSub)
    //             .orElseThrow(() -> new ResourceNotFoundException("Usuario asesor (propuesto) no encontrado con CognitoSub: " + asesorCognitoSub));

    //     // Buscar las solicitudes donde este asesor es el propuesto y el estado de reasignación es PENDIENTE_ACEPTACION_ASESOR
    //     // Necesitamos un método en SolicitudRepository
    //     //--------------------------- Me quede aqui, se necesita cambiar a usuarioXSolicitud para obtener la solicitud asociada al asesor propuesto.
    //     Page<Solicitud> solicitudesPropuestas = solicitudRepository.findByAsesorPropuestoReasignacionAndEstadoReasignacionAndActivoTrue(
    //             asesorPropuesto,
    //             SgtaConstants.ESTADO_REASIGNACION_PENDIENTE_ASESOR, // "PENDIENTE_ACEPTACION_ASESOR"
    //             pageable
    //     );

    //     if (solicitudesPropuestas.isEmpty()) {
    //         log.info("No hay invitaciones de asesoría pendientes para asesor ID {}", asesorPropuesto.getId());
    //         return Page.empty(pageable);
    //     }

    //     Rol rolTesista = rolRepository.findByNombre(SgtaConstants.ROL_NOMBRE_TESISTA)
    //             .orElseThrow(() -> new ResourceNotFoundException("Rol 'Tesista' no encontrado."));

    //     List<InvitacionAsesoriaDto> dtos = solicitudesPropuestas.getContent().stream()
    //             .map(solicitud -> {
    //                 Tema tema = solicitud.getTema();
    //                 Usuario asesorOriginal = solicitud.getUsuarioCreador(); // El que solicitó el cese

    //                 List<EstudianteSimpleDto> estudiantesDto = Collections.emptyList();
    //                 if (tema != null) {
    //                     List<UsuarioXTema> tesistasDelTema = usuarioXTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(tema.getId(), rolTesista.getId());
    //                     estudiantesDto = tesistasDelTema.stream()
    //                             .map(ut -> ut.getUsuario())
    //                             .filter(u -> u != null)
    //                             .map(u -> new EstudianteSimpleDto(u.getId(), u.getNombres(), u.getPrimerApellido(), u.getSegundoApellido()))
    //                             .collect(Collectors.toList());
    //                 }

    //                 String asesorOriginalNombres = (asesorOriginal != null) ? asesorOriginal.getNombres() : "N/A";
    //                 String asesorOriginalApellidos = (asesorOriginal != null) ? asesorOriginal.getPrimerApellido() + (asesorOriginal.getSegundoApellido() != null ? " " + asesorOriginal.getSegundoApellido() : "") : "";


    //                 return new InvitacionAsesoriaDto(
    //                         solicitud.getId(), // ID de la solicitud de cese original
    //                         (tema != null) ? tema.getId() : null,
    //                         (tema != null) ? tema.getTitulo() : "Tema no disponible",
    //                         (tema != null) ? tema.getResumen() : null,
    //                         estudiantesDto,
    //                         asesorOriginalNombres,
    //                         asesorOriginalApellidos,
    //                         solicitud.getFechaModificacion(), // Fecha en que se hizo la propuesta (cuando se actualizó asesor_propuesto)
    //                         solicitud.getDescripcion() // Motivo del cese original
    //                 );
    //             })
    //             .collect(Collectors.toList());

    //     return new PageImpl<>(dtos, pageable, solicitudesPropuestas.getTotalElements());
    // }

//     @Override
//     @Transactional
//     public void rechazarInvitacionDeAsesoria(Integer solicitudOriginalId, String asesorCognitoSub, String motivoRechazo) {
//         log.info("Asesor CognitoSub {} rechazando invitación de asesoría para Solicitud ID {} con motivo: '{}'",
//                 asesorCognitoSub, solicitudOriginalId, motivoRechazo);

//         Usuario asesorQueRechaza = usuarioRepository.findByIdCognito(asesorCognitoSub)
//                 .orElseThrow(() -> new ResourceNotFoundException("Usuario asesor (que rechaza) no encontrado con CognitoSub: " + asesorCognitoSub));

//         Solicitud solicitudOriginal = solicitudRepository.findById(solicitudOriginalId)
//                 .orElseThrow(() -> new ResourceNotFoundException("Solicitud original no encontrada con ID: " + solicitudOriginalId));

//         // Validar que el asesor que rechaza es el mismo que fue propuesto
//         if (solicitudOriginal.getAsesorPropuestoReasignacion() == null ||
//                 !solicitudOriginal.getAsesorPropuestoReasignacion().getId().equals(asesorQueRechaza.getId())) {
//             log.warn("Asesor ID {} (CognitoSub {}) intentó rechazar una propuesta de la Solicitud ID {} que no era para él. Asesor propuesto actual: {}",
//                     asesorQueRechaza.getId(), asesorCognitoSub, solicitudOriginalId,
//                     (solicitudOriginal.getAsesorPropuestoReasignacion() != null ? solicitudOriginal.getAsesorPropuestoReasignacion().getId() : "Nadie"));
//             throw new AccessDeniedException("No tiene permiso para rechazar esta propuesta de asesoría.");
//         }

//         // Validar que el estado de reasignación sea el correcto ("PENDIENTE_ACEPTACION_ASESOR")
//         if (!SgtaConstants.ESTADO_REASIGNACION_PENDIENTE_ACEPTACION_ASESOR.equals(solicitudOriginal.getEstadoReasignacion())) {
//             log.warn("Intento de rechazar propuesta para Solicitud ID {} que no está en estado PENDIENTE_ACEPTACION_ASESOR. Estado actual: {}",
//                     solicitudOriginalId, solicitudOriginal.getEstadoReasignacion());
//             throw new BusinessRuleException("Esta propuesta de asesoría ya no está pendiente de su decisión o no puede ser rechazada en este momento.");
//         }

//         // Actualizar la solicitud original
//         solicitudOriginal.setEstadoReasignacion(SgtaConstants.ESTADO_REASIGNACION_RECHAZADA_POR_ASESOR);
//         //solicitudOriginal.setAsesorPropuestoReasignacion(null); // Limpiar el asesor propuesto
//         // Podrías añadir el motivo del rechazo a la solicitud si tienes un campo para ello,
//         // o simplemente se loguea y se notifica al coordinador.
//         // solicitudOriginal.setRespuestaReasignacion(motivoRechazo); // Si tuvieras un campo así
//         solicitudOriginal.setFechaModificacion(OffsetDateTime.now()); // Actualizar la fecha de modificación

//         solicitudRepository.save(solicitudOriginal);
//         log.info("Invitación de asesoría para Solicitud ID {} ha sido RECHAZADA por Asesor ID {}. Estado de reasignación actualizado.",
//                 solicitudOriginalId, asesorQueRechaza.getId());

//         // Notificar al Coordinador(es) de la carrera del tema
//         // Necesitamos encontrar al coordinador original o a los coordinadores de la carrera del tema
//         Tema temaDeLaSolicitud = solicitudOriginal.getTema();
//         if (temaDeLaSolicitud != null && temaDeLaSolicitud.getCarrera() != null) {
//             List<Usuario> coordinadores = usuarioRepository.findUsuariosActivosPorCarreraYTipo(
//                     temaDeLaSolicitud.getCarrera().getId(),
//                     SgtaConstants.TIPO_USUARIO_COORDINADOR // Usar constante
//             );

//             String mensajeNotificacionCoordinador = String.format(
//                     "El profesor %s %s ha RECHAZADO la propuesta de asesoría para el tema '%s' (Solicitud de Cese ID: %d). Motivo: %s. Por favor, proponga un nuevo asesor.",
//                     asesorQueRechaza.getNombres(),
//                     asesorQueRechaza.getPrimerApellido(),
//                     temaDeLaSolicitud.getTitulo(),
//                     solicitudOriginalId,
//                     motivoRechazo
//             );
//             String enlaceCoordinador = String.format("/coordinador/solicitudes-cese?id=%d&action=propose", solicitudOriginalId); // Llevarlo a la solicitud para reproponer

//             for (Usuario coordinador : coordinadores) {
//                 try {
//                     notificacionService.crearNotificacionParaUsuario(
//                             coordinador.getId(),
//                             SgtaConstants.MODULO_SOLICITUDES_CESE, // O un módulo más específico
//                             SgtaConstants.TIPO_NOTIF_ADVERTENCIA,  // O un tipo específico "PropuestaRechazada"
//                             mensajeNotificacionCoordinador,
//                             "SISTEMA",
//                             enlaceCoordinador
//                     );
//                     log.info("Notificación de rechazo de propuesta enviada a coordinador ID {}", coordinador.getId());
//                 } catch (Exception e) {
//                     log.error("Error al crear notificación de rechazo para coordinador ID {}: {}", coordinador.getId(), e.getMessage(), e);
//                 }
//             }
//         } else {
//             log.warn("No se pudo notificar a coordinadores porque el tema o la carrera de la Solicitud ID {} no está definida.", solicitudOriginalId);
//         }
//     }

//     @Override
//     @Transactional
//     public void aceptarInvitacionDeAsesoria(Integer solicitudOriginalId, String asesorCognitoSub) {
//         log.info("Asesor CognitoSub {} aceptando invitación de asesoría para Solicitud ID: {}",
//                 asesorCognitoSub, solicitudOriginalId);

//         Usuario asesorQueAcepta = usuarioRepository.findByIdCognito(asesorCognitoSub)
//                 .orElseThrow(() -> new ResourceNotFoundException("Usuario asesor (que acepta) no encontrado con CognitoSub: " + asesorCognitoSub));

//         Solicitud solicitudOriginal = solicitudRepository.findById(solicitudOriginalId)
//                 .orElseThrow(() -> new ResourceNotFoundException("Solicitud original no encontrada con ID: " + solicitudOriginalId));

//         // 1. Validar que el asesor que acepta es el mismo que fue propuesto
//         if (solicitudOriginal.getAsesorPropuestoReasignacion() == null ||
//                 !solicitudOriginal.getAsesorPropuestoReasignacion().getId().equals(asesorQueAcepta.getId())) {
//             log.warn("Asesor ID {} (CognitoSub {}) intentó aceptar una propuesta de la Solicitud ID {} que no era para él. Asesor propuesto actual: {}",
//                     asesorQueAcepta.getId(), asesorCognitoSub, solicitudOriginalId,
//                     (solicitudOriginal.getAsesorPropuestoReasignacion() != null ? solicitudOriginal.getAsesorPropuestoReasignacion().getId() : "Nadie"));
//             throw new AccessDeniedException("No tiene permiso para aceptar esta propuesta de asesoría.");
//         }

//         // 2. Validar que el estado de reasignación sea el correcto ("PENDIENTE_ACEPTACION_ASESOR")
//         /*if (!SgtaConstants.ESTADO_REASIGNacion_PENDIENTE_ACEPTACION_ASESOR.equals(solicitudOriginal.getEstadoReasignacion())) {
//             log.warn("Intento de aceptar propuesta para Solicitud ID {} que no está en estado PENDIENTE_ACEPTACION_ASESOR. Estado actual: {}",
//                     solicitudOriginalId, solicitudOriginal.getEstadoReasignacion());
//             throw new BusinessRuleException("Esta propuesta de asesoría ya no está pendiente de su decisión o ya fue procesada.");
//         }*/

//         Tema temaAReasignar = solicitudOriginal.getTema();
//         if (temaAReasignar == null) {
//             throw new IllegalStateException("La solicitud ID " + solicitudOriginalId + " no tiene un tema asociado. No se puede reasignar.");
//         }

//         Usuario asesorOriginalQueCeso = solicitudOriginal.getUsuarioCreador(); // El que solicitó el cese
//         if (asesorOriginalQueCeso == null) {
//             // Esto no debería pasar si el flujo de creación de solicitud es correcto
//             log.error("La Solicitud ID {} no tiene un usuario creador (asesor original). No se puede determinar a quién desvincular.", solicitudOriginalId);
//             throw new IllegalStateException("Falta información del asesor original en la solicitud.");
//         }

//         Rol rolAsesor = rolRepository.findByNombre(SgtaConstants.ROL_NOMBRE_ASESOR)
//                 .orElseThrow(() -> new ResourceNotFoundException("Rol 'Asesor' no encontrado."));

//         // 3. Desvincular al asesor original del tema (marcar como inactiva su relación UsuarioXTema)
//         List<UsuarioXTema> relacionesAntiguas = usuarioXTemaRepository.findByTema_IdAndUsuario_IdAndRol_IdAndActivoTrue(
//                 temaAReasignar.getId(), asesorOriginalQueCeso.getId(), rolAsesor.getId()
//         );
//         if (relacionesAntiguas.isEmpty()) {
//             log.warn("No se encontró una relación activa para el asesor original ID {} y tema ID {} para desactivar.",
//                     asesorOriginalQueCeso.getId(), temaAReasignar.getId());
//             // Continuar de todas formas, puede que ya estuviera inactivo o se haya borrado por otro proceso.
//         }
//         for (UsuarioXTema relacionAntigua : relacionesAntiguas) {
//             relacionAntigua.setActivo(false);
//             relacionAntigua.setFechaModificacion(OffsetDateTime.now());
//             // Podrías añadir un comentario: "Cese aprobado y tema reasignado a Prof. X"
//             // relacionAntigua.setComentario("Reasignado a " + asesorQueAcepta.getNombres() + " " + asesorQueAcepta.getPrimerApellido());
//             usuarioXTemaRepository.save(relacionAntigua);
//             log.info("Relación UsuarioXTema ID {} (Asesor original ID {}, Tema ID {}) marcada como inactiva.",
//                     relacionAntigua.getId(), asesorOriginalQueCeso.getId(), temaAReasignar.getId());
//         }

//         // 4. Vincular al nuevo asesor (Asesor B - asesorQueAcepta) con el tema
//         // Verificar si ya existe una relación (quizás inactiva) y reactivarla, o crear una nueva.
//         UsuarioXTema relacionNuevaAsesor = usuarioXTemaRepository
//                 .findFirstByTema_IdAndUsuario_IdAndRol_IdOrderByFechaCreacionDesc(temaAReasignar.getId(), asesorQueAcepta.getId(), rolAsesor.getId())
//                 .orElse(new UsuarioXTema()); // Crea una nueva si no existe

//         relacionNuevaAsesor.setTema(temaAReasignar);
//         relacionNuevaAsesor.setUsuario(asesorQueAcepta);
//         relacionNuevaAsesor.setRol(rolAsesor);
//         relacionNuevaAsesor.setAsignado(true);
//         relacionNuevaAsesor.setActivo(true);
//         relacionNuevaAsesor.setCreador(false); // No es el creador del tema, fue asignado
//         // relacionNuevaAsesor.setComentario("Asesoría aceptada tras propuesta de reasignación.");
//         // fechaCreacion se setea en @PrePersist si es nueva, fechaModificacion en @PreUpdate
//         usuarioXTemaRepository.save(relacionNuevaAsesor);
//         log.info("Relación UsuarioXTema para nuevo asesor ID {} y tema ID {} creada/actualizada a activa.",
//                 asesorQueAcepta.getId(), temaAReasignar.getId());

//         // 5. Actualizar la solicitud original
//         solicitudOriginal.setEstadoReasignacion(SgtaConstants.ESTADO_REASIGNACION_COMPLETADA);
//         // asesorPropuestoReasignacion ya es el asesorQueAcepta, se mantiene.
//         solicitudOriginal.setRespuesta( // Actualizar la respuesta de la solicitud de cese
//                 (solicitudOriginal.getRespuesta() != null ? solicitudOriginal.getRespuesta() + "\n" : "") +
//                         "Reasignación completada. Nuevo asesor: Prof. " + asesorQueAcepta.getNombres() + " " + asesorQueAcepta.getPrimerApellido() + "."
//         );
//         solicitudOriginal.setFechaModificacion(OffsetDateTime.now());
//         // Considera si fechaResolucion de la solicitud original también debe actualizarse aquí,
//         // o si ya se actualizó cuando el coordinador aprobó el cese.
//         // Si esta aceptación es la "resolución final" del proceso de cese, actualízala.
//         // solicitudOriginal.setFechaResolucion(OffsetDateTime.now());

//         solicitudRepository.save(solicitudOriginal);
//         log.info("Solicitud ID {} actualizada a ESTADO_REASIGNACION_COMPLETADA.", solicitudOriginalId);

//         // 6. Notificar a todas las partes
//         // a. Coordinador
//         List<Usuario> coordinadores = usuarioRepository.findUsuariosActivosPorCarreraYTipo(
//                 temaAReasignar.getCarrera().getId(), SgtaConstants.TIPO_USUARIO_COORDINADOR);
//         String msgCoord = String.format("El Prof. %s %s ha ACEPTADO la propuesta de asesoría para el tema '%s' (Solicitud Cese ID: %d). La reasignación está completa.",
//                 asesorQueAcepta.getNombres(), asesorQueAcepta.getPrimerApellido(), temaAReasignar.getTitulo(), solicitudOriginalId);
//         String enlaceCoord = String.format("/coordinador/solicitudes-cese?id=%d", solicitudOriginalId);
//         for (Usuario coord : coordinadores) {
//             notificacionService.crearNotificacionParaUsuario(coord.getId(), SgtaConstants.MODULO_SOLICITUDES_CESE, SgtaConstants.TIPO_NOTIF_INFORMATIVA, msgCoord, "SISTEMA", enlaceCoord);
//         }

//         // b. Estudiantes
//         Rol rolTesista = rolRepository.findByNombre(SgtaConstants.ROL_NOMBRE_TESISTA).orElse(null);
//         if (rolTesista != null) {
//             List<UsuarioXTema> tesistasDelTema = usuarioXTemaRepository.findByTema_IdAndRol_IdAndActivoTrue(temaAReasignar.getId(), rolTesista.getId());
//             String msgEst = String.format("Se ha asignado un nuevo asesor para su tema '%s'. Su nuevo asesor es el Prof. %s %s.",
//                     temaAReasignar.getTitulo(), asesorQueAcepta.getNombres(), asesorQueAcepta.getPrimerApellido());
//             String enlaceEst = String.format("/alumno/mis-temas/%d", temaAReasignar.getId());
//             for (UsuarioXTema ut : tesistasDelTema) {
//                 notificacionService.crearNotificacionParaUsuario(ut.getUsuario().getId(), SgtaConstants.MODULO_ASESORIA_TEMA, SgtaConstants.TIPO_NOTIF_INFORMATIVA, msgEst, "SISTEMA", enlaceEst);
//             }
//         }

//         // c. Asesor Original (que cesó)
//         if (asesorOriginalQueCeso != null) {
//             String msgAsesorOrig = String.format("La reasignación para su cese del tema '%s' (Solicitud ID: %d) ha sido completada. El nuevo asesor es el Prof. %s %s.",
//                     temaAReasignar.getTitulo(), solicitudOriginalId, asesorQueAcepta.getNombres(), asesorQueAcepta.getPrimerApellido());
//             notificacionService.crearNotificacionParaUsuario(asesorOriginalQueCeso.getId(), SgtaConstants.MODULO_SOLICITUDES_CESE, SgtaConstants.TIPO_NOTIF_INFORMATIVA, msgAsesorOrig, "SISTEMA", null);
//         }
//     }
}
