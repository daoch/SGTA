package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.mapper.EntregableMapper;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.service.inter.EntregableService;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class EntregableServiceImpl implements EntregableService {

    private final EntregableRepository entregableRepository;

    private final Logger logger = Logger.getLogger(EntregableServiceImpl.class.getName());

    public EntregableServiceImpl(EntregableRepository entregableRepository) {
        this.entregableRepository = entregableRepository;
    }

    @Override
    public List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId) {

        List<Object[]> resultados = entregableRepository.listarEntregablesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
        return resultados.stream()
                .map(resultado -> new EntregableDto(
                        ((Number) resultado[0]).intValue(), //id
                        (String) resultado[1], // nombre
                        (String) resultado[2], // descripcion
                        ((Instant) resultado[3]).atOffset(ZoneOffset.UTC), // fecha inicio
                        ((Instant) resultado[4]).atOffset(ZoneOffset.UTC), // fecha fin
                        (boolean) resultado[5] // estado
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public int crearEntregable(Integer etapaFormativaXCicloId, EntregableDto entregableDto) {
        entregableDto.setId(null);
        Entregable entregable = EntregableMapper.toEntity(entregableDto);
        EtapaFormativaXCiclo efc = new EtapaFormativaXCiclo();
        efc.setId(etapaFormativaXCicloId);
        entregable.setEtapaFormativaXCiclo(efc);
        entregable.setFechaCreacion(OffsetDateTime.now());

        entregableRepository.save(entregable);
        return entregable.getId();
    }

    @Transactional
    @Override
    public void update(EntregableDto entregableDto) {
        //Aqui se necesitan todos los atributos del DTO para actualizar el objeto
        Entregable entregableToUpdate = entregableRepository.findById(entregableDto.getId())
                .orElseThrow(() -> new RuntimeException("Entregable no encontrado con ID: " + entregableDto.getId()));

        entregableToUpdate.setNombre(entregableDto.getNombre());
        entregableToUpdate.setDescripcion(entregableDto.getDescripcion());
        entregableToUpdate.setFechaInicio(entregableDto.getFechaInicio());
        entregableToUpdate.setFechaFin(entregableDto.getFechaFin());
        entregableToUpdate.setEsEvaluable(entregableDto.isEsEvaluable());
        entregableToUpdate.setFechaModificacion(OffsetDateTime.now());
        entregableRepository.save(entregableToUpdate);
    }

    @Transactional
    @Override
    public void delete(EntregableDto entregableDto) {
        //Aqui solo se necesita el id del entregable para eliminar (lógicamente) el objeto
        Entregable entregableToDelete = entregableRepository.findById(entregableDto.getId())
                .orElseThrow(() -> new RuntimeException("Entregable no encontrado con ID: " + entregableDto.getId()));

        entregableToDelete.setActivo(false);
        entregableToDelete.setFechaModificacion(OffsetDateTime.now());
        entregableRepository.save(entregableToDelete);
    }

    @Override
    public List<EntregableDto> getAll() {
        List<Entregable> entregables = entregableRepository.findAll();
        return entregables.stream().map(EntregableMapper::toDto).toList();
    }

    @Override
    public Entregable findById(int id) {
        return entregableRepository.findById(id);
    }
}
