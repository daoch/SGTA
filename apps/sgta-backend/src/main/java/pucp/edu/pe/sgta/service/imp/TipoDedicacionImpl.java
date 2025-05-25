package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.model.TipoDedicacion;
import pucp.edu.pe.sgta.repository.TipoDedicacionRepository;
import pucp.edu.pe.sgta.service.inter.TipoDedicacionService;

@Service
public class TipoDedicacionImpl implements TipoDedicacionService {

	@Autowired
	private TipoDedicacionRepository tipoDedicacionRepository;

	@Override
	public List<TipoDedicacion> findAllTipoDedicacion() {
		return tipoDedicacionRepository.findAll();
	}

}
