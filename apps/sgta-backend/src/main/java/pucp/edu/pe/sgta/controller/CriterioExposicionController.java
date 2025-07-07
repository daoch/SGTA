package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CriterioExposicionDto;
import pucp.edu.pe.sgta.service.inter.CriterioExposicionService;
import pucp.edu.pe.sgta.service.inter.JwtService;

import java.util.List;

@RestController
@RequestMapping("/criterio-exposicion")
public class CriterioExposicionController {
    @Autowired
    private CriterioExposicionService criterioExposicionService;

    @Autowired
    JwtService jwtService;

    @GetMapping("/exposicion/{exposicionId}")
    public List<CriterioExposicionDto> listarCriteriosExposicionXExposicion(@PathVariable Integer exposicionId) {
        return criterioExposicionService.listarCriteriosExposicionXExposicion(exposicionId);
    }

    @PostMapping("exposicion/{exposicionId}")
    public Integer create(@PathVariable Integer exposicionId, @RequestBody CriterioExposicionDto dto, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return criterioExposicionService.create(exposicionId, dto, cognitoId);
    }

    @PutMapping("/update")
    public void update(@RequestBody CriterioExposicionDto dto, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        criterioExposicionService.update(dto, cognitoId);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer criterioExposicionId, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        criterioExposicionService.delete(criterioExposicionId, cognitoId);
    }

    @GetMapping("/getAll")
    public List<CriterioExposicionDto> getAll() {
        return criterioExposicionService.getAll();
    }

    @GetMapping("/{id}")
    public CriterioExposicionDto findById(@PathVariable Integer id) {
        return criterioExposicionService.findById(id);
    }
}