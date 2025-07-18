package pucp.edu.pe.sgta.service.imp;

import pucp.edu.pe.sgta.event.AuditoriaEvent;
import java.time.OffsetDateTime;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import pucp.edu.pe.sgta.mapper.CarreraXParametroConfiguracionMapper;
import pucp.edu.pe.sgta.model.CarreraXParametroConfiguracion;
import pucp.edu.pe.sgta.repository.CarreraXParametroConfiguracionRepository;
import pucp.edu.pe.sgta.service.inter.CarreraXParametroConfiguracionService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CarreraXParametroConfiguracionImpl implements CarreraXParametroConfiguracionService {

    private final CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository;
    private final CarreraRepository carreraRepository;
    private final ApplicationEventPublisher eventPublisher;
    private static final Logger log = LoggerFactory.getLogger(CarreraXParametroConfiguracionImpl.class);

    @Autowired
    private UsuarioService usuarioService;

    @Value("${app.default-max-limit}")
    private int defaultMaxLimit;

    @PersistenceContext
    private EntityManager entityManager;

    public CarreraXParametroConfiguracionImpl(
            CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository,
            UsuarioService usuarioService,
            CarreraRepository carreraRepository,
            ApplicationEventPublisher eventPublisher) {
        this.carreraXParametroConfiguracionRepository = carreraXParametroConfiguracionRepository;
        this.usuarioService = usuarioService;
        this.carreraRepository = carreraRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public void updateCarreraXParametroConfiguracion(String usuarioCognito,
            CarreraXParametroConfiguracionDto carreraXParametroConfiguracionDto) {
        // Por ahora se busca por ID, pero se puede buscar por otro campo si es
        // necesario
        CarreraXParametroConfiguracion entity = carreraXParametroConfiguracionRepository
                .findById(carreraXParametroConfiguracionDto.getId())
                .orElseThrow(() -> new RuntimeException(
                        "No se encontró la configuración con ID " + carreraXParametroConfiguracionDto.getId()));

        // Guardar el valor original para comparación
        String valorOriginal = entity.getValor();
        boolean valorCambio = false;

        // Update solo del campo valor y fechaModificacion
        if (carreraXParametroConfiguracionDto.getValor() != null && entity.getActivo()) {
            String nuevoValor = carreraXParametroConfiguracionDto.getValor().toString();
            if (!nuevoValor.equals(valorOriginal)) {
                entity.setValor(nuevoValor);
                valorCambio = true;
            }
        }

        entity.setFechaModificacion(java.time.OffsetDateTime.now());

        carreraXParametroConfiguracionRepository.save(entity);

        // Evento de auditoría - solo si el valor cambió
        if (valorCambio) {
            eventPublisher.publishEvent(
                    new AuditoriaEvent(
                            this,
                            usuarioCognito,
                            OffsetDateTime.now(),
                            "Actualizó los parametros de configuración de ID: " + carreraXParametroConfiguracionDto.getId()
                    )
            );
            //logs
            log.info("Usuario {} actualizó los parámetros de configuración de carrera con ID: {}",
                    usuarioCognito, carreraXParametroConfiguracionDto.getId());
        }

    }

    @Override
    public List<CarreraXParametroConfiguracionDto> getParametrosPorCarrera(String idCognito) {
        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + idCognito);
        }

        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            if (result != null) {
                Carrera carrera = new Carrera();
                carrera.setId((Integer) result[0]);
                carrera.setNombre((String) result[1]);
                Integer carreraId = carrera.getId();
                List<CarreraXParametroConfiguracion> entidades = carreraXParametroConfiguracionRepository
                        .findByCarreraId(Long.valueOf(carreraId));
                List<CarreraXParametroConfiguracionDto> dtos = entidades.stream()
                        .map(CarreraXParametroConfiguracionMapper::toDto)
                        .toList();
                return dtos;
            } else {
                throw new RuntimeException("No se encontró la carrera para el usuario con id: " + usuario.getId());
            }

        }
        return List.of(); // Retorna una lista vacía si no se encuentra la carrera
    }

    @Override
    public List<CarreraXParametroConfiguracionDto> getParametrosPorAlumno(String idCognito) {
        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + idCognito);
        }

        List<Object[]> results = carreraRepository.obtenerCarreraAlumno(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            if (result != null) {
                Carrera carrera = new Carrera();
                carrera.setId((Integer) result[0]);
                carrera.setNombre((String) result[1]);
                Integer carreraId = carrera.getId();
                List<CarreraXParametroConfiguracion> entidades = carreraXParametroConfiguracionRepository
                        .findByCarreraId(Long.valueOf(carreraId));
                List<CarreraXParametroConfiguracionDto> dtos = entidades.stream()
                        .map(CarreraXParametroConfiguracionMapper::toDto)
                        .toList();
                return dtos;
            } else {
                throw new RuntimeException("No se encontró la carrera para el usuario con id: " + usuario.getId());
            }

        }
        return List.of(); // Retorna una lista vacía si no se encuentra la carrera
    }

    @Override
    public List<CarreraXParametroConfiguracionDto> getParametrosPorCarreraYEtapaFormativa(String idCognito, Integer etapaFormativaId) {
        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + idCognito);
        }

        List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
        if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            if (result != null) {
                Carrera carrera = new Carrera();
                carrera.setId((Integer) result[0]);
                carrera.setNombre((String) result[1]);
                Integer carreraId = carrera.getId();
                
                List<CarreraXParametroConfiguracion> entidades;
                if (etapaFormativaId != null) {
                    // Filtrar por etapa formativa específica
                    entidades = carreraXParametroConfiguracionRepository
                            .findByCarreraIdAndEtapaFormativaId(Long.valueOf(carreraId), etapaFormativaId);
                } else {
                    // Obtener parámetros sin etapa formativa (generales)
                    entidades = carreraXParametroConfiguracionRepository
                            .findByCarreraIdAndEtapaFormativaIdIsNull(Long.valueOf(carreraId));
                }
                
                List<CarreraXParametroConfiguracionDto> dtos = entidades.stream()
                        .map(CarreraXParametroConfiguracionMapper::toDto)
                        .toList();
                return dtos;
            } else {
                throw new RuntimeException("No se encontró la carrera para el usuario con id: " + usuario.getId());
            }
        }
        return List.of(); // Retorna una lista vacía si no se encuentra la carrera
    }

    @Override
    public Boolean assertParametroLimiteNumericoPorNombreCarrera(String nombreParametro, Integer carreraId, Integer usuarioId) {
        String sql = "SELECT validar_parametro_por_nombre_carrera(" +
                "CAST(:p_nombre_parametro AS TEXT), " +
                "CAST(:p_carrera_id AS INTEGER), " +
                "CAST(:p_usuario_id AS INTEGER))";
        Object result = entityManager.createNativeQuery(sql)
                .setParameter("p_nombre_parametro", nombreParametro)
                .setParameter("p_carrera_id", carreraId)
                .setParameter("p_usuario_id", usuarioId)
                .getSingleResult();
        return result != null && (Boolean) result;
    }

}
