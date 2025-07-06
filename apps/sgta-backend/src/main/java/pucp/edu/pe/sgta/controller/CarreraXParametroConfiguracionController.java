package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import pucp.edu.pe.sgta.service.inter.CarreraXParametroConfiguracionService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestParam;

@RestController

@RequestMapping("/carreraXParametroConfiguracion")
public class CarreraXParametroConfiguracionController {

	@Autowired
	private CarreraXParametroConfiguracionService carreraXParametroConfiguracionService;

	@Autowired
	private JwtService jwtService;

	@PostMapping("/update")
	public void update(@RequestBody CarreraXParametroConfiguracionDto dto) {

		// ?DUDA: Se tiene que devolver ResponseEntity?

		this.carreraXParametroConfiguracionService.updateCarreraXParametroConfiguracion(dto);
	}

	@GetMapping("/parametros")
	public List<CarreraXParametroConfiguracionDto> getParametros(HttpServletRequest request) {
		String idCognito = jwtService.extractSubFromRequest(request);

		return this.carreraXParametroConfiguracionService.getParametrosPorCarrera(idCognito);
	}

	@GetMapping("/parametros-alumno")
	public List<CarreraXParametroConfiguracionDto> getParametrosPorAlumno(HttpServletRequest request) {
		String idCognito = jwtService.extractSubFromRequest(request);

		return this.carreraXParametroConfiguracionService.getParametrosPorAlumno(idCognito);
	}

	@GetMapping("/parametros-etapa-formativa")
	public List<CarreraXParametroConfiguracionDto> getParametrosPorEtapaFormativa(
			HttpServletRequest request,
			@RequestParam(required = false) Integer etapaFormativaId) {
		String idCognito = jwtService.extractSubFromRequest(request);

		return this.carreraXParametroConfiguracionService.getParametrosPorCarreraYEtapaFormativa(idCognito, etapaFormativaId);
	}
}
