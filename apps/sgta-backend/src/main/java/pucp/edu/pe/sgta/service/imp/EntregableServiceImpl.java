package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.mapper.EntregableMapper;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.service.inter.EntregableService;

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
    public List<EntregableDto> getAll() {
        List<Entregable> entregables = entregableRepository.findAll();
        List<EntregableDto> entregablesDto = entregables.stream().map(EntregableMapper::toDto).toList(); // we map
        // to
        // DTO
        return entregablesDto;
    }

//    @Override
//    public List<EntregableDto> findByEtapaFormativa(Integer idEtapaFormativa) {
//        List<Entregable> entregables = entregableRepository.findByEtapaFormativaId(idEtapaFormativa);
//        return entregables.stream()
//                .map(entregable -> new EntregableDto(entregable.getId(), entregable.getNombre(), entregable.getDescripcion()))
//                .collect(Collectors.toList());
//    }

//    @Override
//    public EntregableDto findById(Integer idEntregable) {
//        Entregable entregable = entregableRepository.findById(idEntregable)
//                .orElseThrow(() -> new RuntimeException("Entregable no encontrado"));
//        return new EntregableDto(entregable.getId(), entregable.getNombre(), entregable.getDescripcion());
//    }
}
