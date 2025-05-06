package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.mapper.EtapaFormativaXCicloMapper;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloService;

@Service
public class EtapaFormativaXCicloServiceImpl implements EtapaFormativaXCicloService {

    private final EtapaFormativaXCicloRepository repository;

    public EtapaFormativaXCicloServiceImpl(EtapaFormativaXCicloRepository repository) {
        this.repository = repository;
    }

    @Override
    public EtapaFormativaXCicloDto obtenerPorId(Integer id) {
        EtapaFormativaXCiclo etapaFormativaXCiclo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("EtapaFormativaXCiclo no encontrada"));
        return EtapaFormativaXCicloMapper.toDto(etapaFormativaXCiclo);
    }
}