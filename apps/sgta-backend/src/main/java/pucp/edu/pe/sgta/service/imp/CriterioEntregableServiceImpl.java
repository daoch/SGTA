package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.dto.RevisionCriterioEntregableDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.CriterioEntregableMapper;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.repository.CriterioEntregableRepository;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;
import pucp.edu.pe.sgta.service.inter.HistorialAccionService;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class CriterioEntregableServiceImpl implements CriterioEntregableService {

    private final CriterioEntregableRepository criterioEntregableRepository;
    private final HistorialAccionService historialAccionService;

    @PersistenceContext
    private EntityManager entityManager;

    public CriterioEntregableServiceImpl(CriterioEntregableRepository criterioEntregableRepository,
                                         HistorialAccionService historialAccionService) {
        this.criterioEntregableRepository = criterioEntregableRepository;
        this.historialAccionService = historialAccionService;
    }

    @Override
    public List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(Integer entregableId) {
        // Ahora el repositorio ya devuelve directamente List<CriterioEntregableDto>
        return criterioEntregableRepository.listarCriteriosEntregableXEntregable(entregableId);
    }

    @Transactional
    @Override
    public int crearCriterioEntregable(Integer entregableId, CriterioEntregableDto criterioEntregableDto, String cognitoId) {
        criterioEntregableDto.setId(null);
        CriterioEntregable criterioEntregable = CriterioEntregableMapper.toEntity(criterioEntregableDto);
        Entregable entregable = new Entregable();
        entregable.setId(entregableId);
        criterioEntregable.setEntregable(entregable);
        criterioEntregable.setFechaCreacion(OffsetDateTime.now());
        criterioEntregableRepository.save(criterioEntregable);
        historialAccionService.registrarAccion(cognitoId, "Se creó el criterio de entregable " + criterioEntregable.getId()
                + " para el entregable " + entregableId);
        return criterioEntregable.getId();
    }

    @Transactional
    @Override
    public void update(CriterioEntregableDto criterioEntregableDto, String cognitoId) {
        CriterioEntregable criterioEntregableToUpdate = criterioEntregableRepository.findById(criterioEntregableDto.getId())
                .orElseThrow(() -> new RuntimeException("CriterioEntregable no encontrado con ID: " + criterioEntregableDto.getId()));

        criterioEntregableToUpdate.setNombre(criterioEntregableDto.getNombre());
        criterioEntregableToUpdate.setNotaMaxima(criterioEntregableDto.getNotaMaxima());
        criterioEntregableToUpdate.setDescripcion(criterioEntregableDto.getDescripcion());
        criterioEntregableToUpdate.setFechaModificacion(OffsetDateTime.now());
        criterioEntregableRepository.save(criterioEntregableToUpdate);
        historialAccionService.registrarAccion(cognitoId, "Se actualizó el criterio de entregable " + criterioEntregableDto.getId());
    }

    @Override
    public List<CriterioEntregableDto> listar_criterio_entregable_x_revisionID(Integer revision_entregable_id) {


        String sql = "SELECT * FROM listar_criterio_entregable_x_revisionID(:revision_entregable_id)";

        List<Object[]> resultados = entityManager
                .createNativeQuery(sql)
                .setParameter("revision_entregable_id", revision_entregable_id)
                .getResultList();
        List<CriterioEntregableDto> listaCriterios = new ArrayList<>();

        for (Object[] fila : resultados) {
            CriterioEntregableDto dto = new CriterioEntregableDto();
            dto.setRevision_documento_id((Integer) fila[0]);
            dto.setUsuario_revisor_id((Integer) fila[1]);
            dto.setTema_x_entregable_id((Integer) fila[2]);
            dto.setEntregable_id((Integer) fila[3]);
            dto.setEntregable_descripcion((String) fila[4]);
            dto.setId((Integer)fila[5]);
            dto.setDescripcion((String)fila[6]);
            dto.setNombre((String)fila[7]);
            dto.setNotaMaxima((BigDecimal)fila[8]);
            dto.setRevision_criterio_entregable_id((Integer) fila[9]);
            //dto.setNota(Double.valueOf((String)fila[10]));
            if (fila[10] != null) {
                dto.setNota(((BigDecimal) fila[10]).doubleValue());
            } else {
                dto.setNota(null);
            }
            dto.setObservacion((String)fila[11]);
            listaCriterios.add(dto);
        }

        return listaCriterios;
    }
    @Transactional
    @Override
    public void insertar_actualizar_revision_criterio_entregable(CriterioEntregableDto criterioEntregable) {


        String sql = "SELECT insertar_actualizar_criterio_entregable_id(:p_revision_criterio_entregable_id ,:p_entregable_x_tema_id ,:p_criterio_entregable_id, :p_revision_documento_id,:p_usuario_id ,:p_nota,:p_observacion)";

        entityManager
                .createNativeQuery(sql)
                .setParameter("p_revision_criterio_entregable_id", criterioEntregable.getRevision_criterio_entregable_id())
                .setParameter("p_entregable_x_tema_id", criterioEntregable.getTema_x_entregable_id())
                .setParameter("p_criterio_entregable_id", criterioEntregable.getId())
                .setParameter("p_revision_documento_id", criterioEntregable.getRevision_documento_id())
                .setParameter("p_usuario_id", criterioEntregable.getUsuario_revisor_id())
                .setParameter("p_nota", BigDecimal.valueOf(criterioEntregable.getNota()))
                .setParameter("p_observacion", criterioEntregable.getObservacion())
                .getResultList();
    }

    @Transactional
    @Override
    public void delete(Integer id, String cognitoId) {
        CriterioEntregable criterioEntregableToDelete = criterioEntregableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CriterioEntregable no encontrado con ID: " + id));

        criterioEntregableToDelete.setActivo(false);
        criterioEntregableToDelete.setFechaModificacion(OffsetDateTime.now());
        criterioEntregableRepository.save(criterioEntregableToDelete);
        historialAccionService.registrarAccion(cognitoId, "Se eliminó el criterio de entregable " + id);
    }

    @Override
    public Optional<CriterioEntregable> findById(Integer id) {
        return criterioEntregableRepository.findById(id);
    }
    @Override
    public List<RevisionCriterioEntregableDto> listarRevisionCriterioPorEntregableXTema(Integer entregableXtemaId) {
        List<Object[]> resultados = criterioEntregableRepository.listarRevisionCriterioPorEntregableXTema(entregableXtemaId);
        List<RevisionCriterioEntregableDto> lista = new ArrayList<>();

        for (Object[] fila : resultados) {
            RevisionCriterioEntregableDto dto = new RevisionCriterioEntregableDto(
                (Integer) fila[0],  // entregable_x_tema_id
                (Integer) fila[1],  // criterio_entregable_id
                (Integer) fila[2],  // usuario_id
                (String) fila[3],   // nombre completo usuario
                (Integer) fila[4],  // revision_documento_id
                fila[5] != null ? ((Number) fila[5]).doubleValue() : null, // nota
                (String) fila[6],   // observacion
                (Integer) fila[7],  // entregable_id
                (String) fila[8],   // nombre_criterio
                fila[9] != null ? ((Number) fila[9]).doubleValue() : null, // nota_maxima
                (String) fila[10]   // descripcion_criterio
            );
            lista.add(dto);
        }

        return lista;
    }
}
