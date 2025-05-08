package pucp.edu.pe.sgta.service.imp;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.EtapaFormativaXSalaExposicionConEtapaFormativaDTO;
import pucp.edu.pe.sgta.dto.EtapaFormativaXSalaExposicionDto;
import pucp.edu.pe.sgta.mapper.EtapaFormativaXSalaExposicionMapper;
import pucp.edu.pe.sgta.model.EtapaFormativaXSalaExposicion;
import pucp.edu.pe.sgta.repository.EtapaFormativaXSalaExposicionRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXSalaExposicionService;

@Service
public class EtapaFormativaXSalaExposicionServiceImpl implements EtapaFormativaXSalaExposicionService {

    private final EtapaFormativaXSalaExposicionRepository etapaFormativaXSalaExposicionRepository;

    public EtapaFormativaXSalaExposicionServiceImpl(
            EtapaFormativaXSalaExposicionRepository etapaFormativaXSalaExposicionRepository) {
        this.etapaFormativaXSalaExposicionRepository = etapaFormativaXSalaExposicionRepository;
    }

    @Override
    public List<EtapaFormativaXSalaExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public EtapaFormativaXSalaExposicionDto findById(Integer id) {
        EtapaFormativaXSalaExposicion etapaFormativaXSalaExposicion = etapaFormativaXSalaExposicionRepository
                .findById(id).orElse(null);
        if (etapaFormativaXSalaExposicion != null) {
            return EtapaFormativaXSalaExposicionMapper.toDto(etapaFormativaXSalaExposicion);
        }
        return null;
    }

    @Override
    public void create(EtapaFormativaXSalaExposicionDto dto) {

    }

    @Override
    public void update(EtapaFormativaXSalaExposicionDto dto) {

    }

    @Override
    public void delete(Integer dto) {

    }

    @Override
    public List<EtapaFormativaXSalaExposicionConEtapaFormativaDTO> listarEtapasFormativasXSalaExposicion(
            Integer etapaFormativaId) {
        List<Object[]> result = etapaFormativaXSalaExposicionRepository
                .listarEtapasFormativasXSalaExposicion(etapaFormativaId);

        List<EtapaFormativaXSalaExposicionConEtapaFormativaDTO> dtoList = new ArrayList<>();
        for (Object[] row : result) {
            EtapaFormativaXSalaExposicionConEtapaFormativaDTO dto = new EtapaFormativaXSalaExposicionConEtapaFormativaDTO();
            dto.setEtapaFormativaXSalaExposicionId((Integer) row[0]);
            dto.setEtapaFormativaId((Integer) row[1]);
            dto.setSalaExposicionId((Integer) row[2]);
            dto.setNombreSalaExposicion((String) row[3]);
            dto.setNombreEtapaFormativa((String) row[4]);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
