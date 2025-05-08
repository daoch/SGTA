package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaDTO;
import pucp.edu.pe.sgta.mapper.EtapaFormativaMapper;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import java.util.List;

@Service
public class EtapaFormativaServiceImpl implements EtapaFormativaService {

    private final EtapaFormativaRepository etapaFormativaRepository;

    public EtapaFormativaServiceImpl(EtapaFormativaRepository etapaFormativaRepository) {
        this.etapaFormativaRepository = etapaFormativaRepository;
    }

    @Override
    public List<EtapaFormativaDTO> getAll() {
        return List.of();
    }

    @Override
    public EtapaFormativaDTO findById(Integer id) {
        EtapaFormativa etapaFormativa = etapaFormativaRepository.findById(id).orElse(null);
        if (etapaFormativa != null) {
            return EtapaFormativaMapper.toDto(etapaFormativa);
        }
        return null;
    }

    @Override
    public void create(EtapaFormativaDTO dto) {

    }

    @Override
    public void update(EtapaFormativaDTO dto) {

    }

    @Override
    public void delete(Integer id) {

    }

}
