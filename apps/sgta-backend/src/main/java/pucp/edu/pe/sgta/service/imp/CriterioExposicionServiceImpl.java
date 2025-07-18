package pucp.edu.pe.sgta.service.imp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.CriterioExposicionDto;
import pucp.edu.pe.sgta.mapper.CriterioExposicionMapper;
import pucp.edu.pe.sgta.model.CriterioExposicion;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.repository.CriterioExposicionRepository;
import pucp.edu.pe.sgta.service.inter.CriterioExposicionService;
import pucp.edu.pe.sgta.service.inter.HistorialAccionService;

@Service
public class CriterioExposicionServiceImpl implements CriterioExposicionService {
    private final CriterioExposicionRepository criterioExposicionRepository;
    private final HistorialAccionService historialAccionService;

    public CriterioExposicionServiceImpl(CriterioExposicionRepository criterioExposicionRepository,
                                          HistorialAccionService historialAccionService) {
        this.criterioExposicionRepository = criterioExposicionRepository;
        this.historialAccionService = historialAccionService;
    }

    @Override
    public List<CriterioExposicionDto> getAll() {
        List<CriterioExposicion> criteriosExposicion = criterioExposicionRepository.findAll();
        return criteriosExposicion.stream().map(CriterioExposicionMapper::toDto).collect(Collectors.toList());

    }

    @Override
    public List<CriterioExposicionDto> listarCriteriosExposicionXExposicion(Integer exposicionId) {

        List<Object[]> resultados = criterioExposicionRepository.listarCriteriosExposicionXExposicion(exposicionId);
        return resultados.stream()
                .map(resultado -> new CriterioExposicionDto(
                        ((Number) resultado[0]).intValue(), //id
                        ((Number) resultado[1]).intValue(), // id exposicion
                        (String) resultado[2], // nombre
                        (String) resultado[3], // descripcion
                        ((BigDecimal) resultado[4]) // nota maxima
                ))
                .collect(Collectors.toList());
    }

    @Override
    public CriterioExposicionDto findById(Integer id) {
        return criterioExposicionRepository.findById(id)
                .map(CriterioExposicionMapper::toDto)
                .orElse(null);
    }

    @Transactional
    @Override
    public Integer create(Integer exposicionId, CriterioExposicionDto dto, String cognitoId) {
        dto.setId(null);
        CriterioExposicion criterioExposicion = CriterioExposicionMapper.toEntity(dto);
        Exposicion exposicion = new Exposicion();
        exposicion.setId(exposicionId);
        criterioExposicion.setExposicion(exposicion);
        criterioExposicion.setFechaCreacion(OffsetDateTime.now());

        criterioExposicionRepository.save(criterioExposicion);
        historialAccionService.registrarAccion(cognitoId, "Se creó el criterio de exposición " + criterioExposicion.getId() +
                " para la exposición " + exposicionId);
        criterioExposicionRepository.asociarTemasACriterioExposicion(criterioExposicion.getId(), exposicionId);
        return criterioExposicion.getId();
    }

    @Transactional
    @Override
    public void update(CriterioExposicionDto dto, String cognitoId) {
        CriterioExposicion criterioToUpdate = criterioExposicionRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("CriterioExposicion no encontrado con ID: " + dto.getId()));

        criterioToUpdate.setNombre(dto.getNombre());
        criterioToUpdate.setDescripcion(dto.getDescripcion());
        criterioToUpdate.setNotaMaxima(dto.getNotaMaxima());
        criterioToUpdate.setFechaModificacion(OffsetDateTime.now());
        criterioExposicionRepository.save(criterioToUpdate);
        historialAccionService.registrarAccion(cognitoId, "Se actualizó el criterio de exposición " + dto.getId());
    }

    @Override
    public void delete(Integer id, String cognitoId) {
        CriterioExposicion criterioExposicionToDelete = criterioExposicionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CriterioExposicion no encontrado con ID: " + id));

        criterioExposicionToDelete.setActivo(false);
        criterioExposicionToDelete.setFechaModificacion(OffsetDateTime.now());
        criterioExposicionRepository.save(criterioExposicionToDelete);
        historialAccionService.registrarAccion(cognitoId, "Se eliminó el criterio de exposición " + id);
    }
}
