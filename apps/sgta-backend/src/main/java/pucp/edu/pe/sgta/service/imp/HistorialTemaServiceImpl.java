package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pucp.edu.pe.sgta.dto.HistorialTemaDto;
import pucp.edu.pe.sgta.mapper.HistorialTemaMapper;
import pucp.edu.pe.sgta.model.EstadoTema;
import pucp.edu.pe.sgta.model.HistorialTema;
import pucp.edu.pe.sgta.repository.EstadoTemaRepository;
import pucp.edu.pe.sgta.repository.HistorialTemaRepository;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.HistorialTemaService;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.Instant;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistorialTemaServiceImpl implements HistorialTemaService {

    private final HistorialTemaRepository historialTemaRepository;

    private final EstadoTemaRepository estadoTemaRepository;

    private final CarreraService carreraService;

    @PersistenceContext
    private EntityManager em;


    public HistorialTemaServiceImpl(HistorialTemaRepository historialTemaRepository,
                                    EstadoTemaRepository estadoTemaRepository,
                                    CarreraService carreraService) {
        this.historialTemaRepository = historialTemaRepository;
        this.estadoTemaRepository = estadoTemaRepository;
        this.carreraService = carreraService;
    }

    @Override
    public HistorialTemaDto findById(Integer id) {
        Optional<HistorialTema> historialTema = historialTemaRepository.findById(id);
        if(historialTema.isPresent()) {
            HistorialTemaDto dto = HistorialTemaMapper.toDto(historialTema.get());
            return dto;
        }
        return null;
    }

    @Override
    public List<HistorialTemaDto> findByTemaId(Integer id) {
        List<HistorialTema> historialTema =  historialTemaRepository.findByTemaId(id);
        List<HistorialTemaDto> historialDto = new ArrayList<>();
        if(!historialTema.isEmpty()) {
            for (HistorialTema tema : historialTema) {
                HistorialTemaDto dto = HistorialTemaMapper.toDto(tema);
                historialDto.add(dto);
            }
        }
        return historialDto;
    }

    @Override
    public void save(HistorialTemaDto dto) {
        // 1) Mapea todos los campos excepto el estadoTema
        HistorialTema entity = HistorialTemaMapper.toEntity(dto);

        // 2) Recupera la entidad EstadoTema ya persistida
        EstadoTema estado = estadoTemaRepository
            .findByNombre(dto.getEstadoTemaNombre())
            .orElseThrow(() -> new RuntimeException(
                "EstadoTema no encontrado: " + dto.getEstadoTemaNombre()));

        // 3) Asigna la instancia gestionada
        entity.setEstadoTema(estado);

        // 4) Persiste el historial
        historialTemaRepository.save(entity);
    }

    @Override
    public List<HistorialTemaDto> listarHistorialActivoPorTema(Integer temaId) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
            "SELECT " +
            "  historial_tema_id, tema_id, codigo, titulo, resumen, metodologia, objetivos, " +
            "  descripcion_cambio, portafolio_url, estado_tema_nombre, proyecto_id, carrera_id, " +
            "  subareas_snapshot, asesores_snapshot, tesistas_snapshot, activo, " +
            "  fecha_limite, fecha_finalizacion, fecha_creacion, fecha_modificacion " +
            "FROM listar_historial_tema_completo(:temaId)"
        )
        .setParameter("temaId", temaId)
        .getResultList();

        return rows.stream()
            .map(r -> {
                HistorialTemaDto dto = new HistorialTemaDto();
                dto.setId(((Number) r[0]).intValue());
                // puedes reconstruir el TemaDto si lo necesitas:
                dto.setTema(null); 
                dto.setCodigo((String) r[2]);
                dto.setTitulo((String) r[3]);
                dto.setResumen((String) r[4]);
                dto.setMetodologia((String) r[5]);
                dto.setObjetivos((String) r[6]);
                dto.setDescripcionCambio((String) r[7]);
                dto.setPortafolioUrl((String) r[8]);
                dto.setEstadoTemaNombre((String) r[9]);
                dto.setProyectoId(r[10] != null ? ((Number) r[10]).intValue() : null);
                Integer carreraId = (r[11] != null) ? ((Number) r[11]).intValue() : null;
                dto.setCarrera(
                    carreraId != null
                    ? carreraService.findById(carreraId)
                    : null
                );
                dto.setSubareasSnapshot((String) r[12]);
                dto.setAsesoresSnapshot((String) r[13]);
                dto.setTesistasSnapshot((String) r[14]);
                dto.setActivo((Boolean) r[15]);

                dto.setFechaLimite(toOffsetDateTime(r[16]));
                dto.setFechaFinalizacion(toOffsetDateTime(r[17]));
                dto.setFechaCreacion(toOffsetDateTime(r[18]));
                dto.setFechaModificacion(toOffsetDateTime(r[19]));
                return dto;
            })
            .collect(Collectors.toList());
    }

    /** Convierte un valor de columna TIMESTAMPTZ (Instant o Timestamp) a OffsetDateTime UTC */
    private OffsetDateTime toOffsetDateTime(Object dbValue) {
        if (dbValue == null) return null;
        Instant instant;
        if (dbValue instanceof Instant) {
            instant = (Instant) dbValue;
        } else if (dbValue instanceof Timestamp) {
            instant = ((Timestamp) dbValue).toInstant();
        } else {
            throw new IllegalArgumentException("Tipo inesperado de fecha: " + dbValue.getClass());
        }
        return instant.atOffset(ZoneOffset.UTC);
    }

    }
