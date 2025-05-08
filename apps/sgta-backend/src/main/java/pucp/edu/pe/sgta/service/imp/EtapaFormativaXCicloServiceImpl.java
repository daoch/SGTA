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
    public void create(EtapaFormativaXCicloDto dto) {

    }

    @Override
    public void update(EtapaFormativaXCicloDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

}
