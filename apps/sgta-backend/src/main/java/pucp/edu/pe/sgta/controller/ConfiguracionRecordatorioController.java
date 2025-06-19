package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.ConfiguracionRecordatorioDto;
import pucp.edu.pe.sgta.service.inter.ConfiguracionRecordatorioService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

@RestController
@RequestMapping("/reminder-config")
@RequiredArgsConstructor
public class ConfiguracionRecordatorioController {

    private final ConfiguracionRecordatorioService service;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<ConfiguracionRecordatorioDto> getConfig(HttpServletRequest request) {
        String cognitoSub = jwtService.extractSubFromRequest(request);
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        ConfiguracionRecordatorioDto dto = service.getByUsuarioId(usuarioId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<ConfiguracionRecordatorioDto> saveOrUpdateConfig(
            HttpServletRequest request,
            @RequestBody ConfiguracionRecordatorioDto dto) {
        String cognitoSub = jwtService.extractSubFromRequest(request);
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        ConfiguracionRecordatorioDto saved = service.saveOrUpdate(usuarioId, dto);
        return ResponseEntity.ok(saved);
    }
}