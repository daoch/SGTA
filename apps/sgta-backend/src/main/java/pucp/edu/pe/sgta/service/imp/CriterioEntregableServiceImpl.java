package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.mapper.CriterioEntregableMapper;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.repository.CriterioEntregableRepository;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CriterioEntregableServiceImpl implements CriterioEntregableService {

    private final CriterioEntregableRepository criterioEntregableRepository;

    public CriterioEntregableServiceImpl(CriterioEntregableRepository criterioEntregableRepository) {
        this.criterioEntregableRepository = criterioEntregableRepository;
    }

    @Override
    public List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(Integer entregableId) {
        List<Object[]> resultados = criterioEntregableRepository.listarCriteriosEntregableXEntregable(entregableId);
        return resultados.stream()
                .map(resultado -> new CriterioEntregableDto(
                        ((Number) resultado[0]).intValue(), //id
                        (String) resultado[1], // nombre
                        (BigDecimal) resultado[2], // Nota maxima
                        (String) resultado[3] //Descripcion
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public int crearCriterioEntregable(Integer entregableId, CriterioEntregableDto criterioEntregableDto) {
        criterioEntregableDto.setId(null);
        CriterioEntregable criterioEntregable = CriterioEntregableMapper.toEntity(criterioEntregableDto);
        Entregable entregable = new Entregable();
        entregable.setId(entregableId);
        criterioEntregable.setEntregable(entregable);
        criterioEntregable.setFechaCreacion(OffsetDateTime.now());
        criterioEntregableRepository.save(criterioEntregable);
        return criterioEntregable.getId();
    }

    @Transactional
    @Override
    public void update(CriterioEntregableDto criterioEntregableDto) {
        CriterioEntregable criterioEntregableToUpdate = criterioEntregableRepository.findById(criterioEntregableDto.getId())
                .orElseThrow(() -> new RuntimeException("CriterioEntregable no encontrado con ID: " + criterioEntregableDto.getId()));

        criterioEntregableToUpdate.setNombre(criterioEntregableDto.getNombre());
        criterioEntregableToUpdate.setNotaMaxima(criterioEntregableDto.getNotaMaxima());
        criterioEntregableToUpdate.setDescripcion(criterioEntregableDto.getDescripcion());
        criterioEntregableToUpdate.setFechaModificacion(OffsetDateTime.now());
        criterioEntregableRepository.save(criterioEntregableToUpdate);
    }

    @Transactional
    @Override
    public void delete(Integer id) {
        CriterioEntregable criterioEntregableToDelete = criterioEntregableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CriterioEntregable no encontrado con ID: " + id));

        criterioEntregableToDelete.setActivo(false);
        criterioEntregableToDelete.setFechaModificacion(OffsetDateTime.now());
        criterioEntregableRepository.save(criterioEntregableToDelete);
    }

    @Override
    public CriterioEntregable findById(int id) {
        return criterioEntregableRepository.findById(id);
    }
}
