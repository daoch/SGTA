package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import pucp.edu.pe.sgta.service.inter.CarreraXParametroConfiguracionService;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController

@RequestMapping("/carreraXParametroConfiguracion")
public class CarreraXParametroConfiguracionController {

	@Autowired
	private CarreraXParametroConfiguracionService carreraXParametroConfiguracionService;

	@PostMapping("/update")
	public void update(@RequestBody CarreraXParametroConfiguracionDto dto) {

        //?DUDA: Se tiene que devolver ResponseEntity?

		this.carreraXParametroConfiguracionService.updateCarreraXParametroConfiguracion(dto);
	}

    @GetMapping("/{carreraId}/parametros")
    public List<CarreraXParametroConfiguracionDto> getParametros(@PathVariable Long carreraId) {
        return this.carreraXParametroConfiguracionService.getParametrosPorCarrera(carreraId);
    }
}
