package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.model.TipoDedicacion;
import pucp.edu.pe.sgta.service.inter.TipoDedicacionService;

@RestController
@RequestMapping("/tipodedicacion")
public class TipoDedicacionController {

	@Autowired
	private TipoDedicacionService tipoDedicacionService;

	@GetMapping()
	public List<TipoDedicacion> findAllTipoDedicacion() {
		return tipoDedicacionService.findAllTipoDedicacion();
	}

}
