package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.mapper.EntregableMapper;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.service.inter.EntregableService;
import pucp.edu.pe.sgta.util.EstadoActividad;

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
                        ((Number) resultado[1]).intValue(), // id etapa formativa x ciclo
                        (String) resultado[2], // nombre
                        (String) resultado[3], // descripcion
                        ((Instant) resultado[4]).atOffset(ZoneOffset.UTC), // fecha inicio
                        ((Instant) resultado[5]).atOffset(ZoneOffset.UTC), // fecha fin
                        EstadoActividad.valueOf((String) resultado[6]), // estado
                        (boolean) resultado[7], // es evaluable
                        ((Number) resultado[8]).intValue(), // maximo_documentos
                        (String) resultado[9], // extensiones_permitidas
                        ((Number) resultado[10]).intValue() // peso_maximo_documento
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public Integer create(Integer etapaFormativaXCicloId, EntregableDto entregableDto) {
        entregableDto.setId(null);
        Entregable entregable = EntregableMapper.toEntity(entregableDto);
        EtapaFormativaXCiclo efc = new EtapaFormativaXCiclo();
        efc.setId(etapaFormativaXCicloId);
        entregable.setEtapaFormativaXCiclo(efc);
        entregable.setFechaCreacion(OffsetDateTime.now());
        if (entregable.getEstado() == null) {
            entregable.setEstado(EstadoActividad.no_iniciado);
        }
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
        entregableToUpdate.setMaximoDocumentos(entregableDto.getMaximoDocumentos());
        entregableToUpdate.setExtensionesPermitidas(entregableDto.getExtensionesPermitidas());
        entregableToUpdate.setPesoMaximoDocumento(entregableDto.getPesoMaximoDocumento());
        entregableToUpdate.setFechaModificacion(OffsetDateTime.now());
        entregableRepository.save(entregableToUpdate);
    }

    @Transactional
    @Override
    public void delete(Integer id) {
        //Aqui solo se necesita el id del entregable para eliminar (lógicamente) el objeto
        Entregable entregableToDelete = entregableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entregable no encontrado con ID: " + id));

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
    public EntregableDto findById(Integer id) {
        return entregableRepository.findById(id)
                .map(EntregableMapper::toDto)
                .orElse(null);
    }
}
