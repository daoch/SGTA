package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.EtapaFormativaXSalaExposicionConEtapaFormativaDTO;
import pucp.edu.pe.sgta.dto.EtapaFormativaXSalaExposicionDto;

public interface EtapaFormativaXSalaExposicionService {

	List<EtapaFormativaXSalaExposicionDto> getAll();

	EtapaFormativaXSalaExposicionDto findById(Integer id);

	void create(EtapaFormativaXSalaExposicionDto dto);

	void update(EtapaFormativaXSalaExposicionDto dto);

	void delete(Integer id);

	List<EtapaFormativaXSalaExposicionConEtapaFormativaDTO> listarEtapasFormativasXSalaExposicion(
			Integer etapaFormativaId);

}
