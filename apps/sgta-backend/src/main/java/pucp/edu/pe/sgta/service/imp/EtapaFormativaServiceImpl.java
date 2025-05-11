package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.mapper.EtapaFormativaMapper;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import java.util.List;

import pucp.edu.pe.sgta.dto.EtapaFormativaDto;

@Service
public class EtapaFormativaServiceImpl implements EtapaFormativaService {

    private final EtapaFormativaRepository etapaFormativaRepository;

    public EtapaFormativaServiceImpl(EtapaFormativaRepository etapaFormativaRepository) {
        this.etapaFormativaRepository = etapaFormativaRepository;
    }

    @Override
    public List<EtapaFormativaDto> getAll() {
        return List.of();
    }

    @Override
    public EtapaFormativaDto findById(Integer id) {
        EtapaFormativa etapaFormativa = etapaFormativaRepository.findById(id).orElse(null);
        if (etapaFormativa != null) {
            return EtapaFormativaMapper.toDto(etapaFormativa);
        }
        return null;
    }

    @Override
    public void create(EtapaFormativaDto dto) {

    }

    @Override
    public void update(EtapaFormativaDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<EtapaFormativaNombreDTO> findToInitializeByCoordinador(Integer coordiandorId) {
        List<EtapaFormativaNombreDTO> etapasFormativas = etapaFormativaRepository.findToInitializeByCoordinador(coordiandorId);
        return etapasFormativas.stream()
                .map(ef -> new EtapaFormativaNombreDTO(ef.getEtapaFormativaId(), ef.getNombre()))
                .toList();
    }

    @Override
    public List<EtapaFormativaDto> findAllActivas() {
        return etapaFormativaRepository.findAllActivas();
    }
}
