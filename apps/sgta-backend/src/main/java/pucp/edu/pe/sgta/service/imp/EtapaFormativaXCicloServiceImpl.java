package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.mapper.EtapaFormativaXCicloMapper;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloService;

import java.util.List;

@Service
public class EtapaFormativaXCicloServiceImpl implements EtapaFormativaXCicloService {

    private final EtapaFormativaXCicloRepository etapaFormativaXCicloRepository;

    public EtapaFormativaXCicloServiceImpl(EtapaFormativaXCicloRepository etapaFormativaXCicloRepository) {
        this.etapaFormativaXCicloRepository = etapaFormativaXCicloRepository;
    }

    @Override
    public List<EtapaFormativaXCicloDto> getAll() {
        return List.of();
    }

    @Override
    public EtapaFormativaXCicloDto findById(Integer id) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = etapaFormativaXCicloRepository.findById(id).orElse(null);
        if (etapaFormativaXCiclo != null) {
            return EtapaFormativaXCicloMapper.toDto(etapaFormativaXCiclo);
        }
        return null;
    }

    @Override
    public EtapaFormativaXCicloDto create(EtapaFormativaXCicloDto dto) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = EtapaFormativaXCicloMapper.toEntity(dto);
        EtapaFormativaXCiclo savedEtapaFormativaXCiclo = etapaFormativaXCicloRepository.save(etapaFormativaXCiclo);
        return EtapaFormativaXCicloMapper.toDto(savedEtapaFormativaXCiclo);
    }

    @Override
    public void update(EtapaFormativaXCicloDto dto) {
        
    }

    @Override
    public void delete(Integer id) {

    }

    //get all by carrera id, agregar que sea activo true
    @Override
    public List<EtapaFormativaXCicloDto> getAllByCarreraId(Integer id) {
        
        List<EtapaFormativaXCiclo> etapaFormativaXCiclos = etapaFormativaXCicloRepository.findAllByEtapaFormativa_Carrera_IdAndActivoTrue(id);
        if (etapaFormativaXCiclos.isEmpty()) {
            return List.of();
        }
        return etapaFormativaXCiclos.stream().map(EtapaFormativaXCicloMapper::toDto).toList();
    }

    //get all by carrera id and ciclo id
    @Override
    public List<EtapaFormativaXCicloDto> getAllByCarreraIdAndCicloId(Integer carreraId, Integer cicloId) {
        List<EtapaFormativaXCiclo> etapaFormativaXCiclos = etapaFormativaXCicloRepository.findAllByEtapaFormativa_Carrera_IdAndCiclo_IdAndActivoTrue(carreraId, cicloId);
        if (etapaFormativaXCiclos.isEmpty()) {
            return List.of();
        }
        return etapaFormativaXCiclos.stream().map(EtapaFormativaXCicloMapper::toDto).toList();
    }

}
