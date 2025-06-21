package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.ConfiguracionRecordatorioDto;
import pucp.edu.pe.sgta.service.inter.ConfiguracionRecordatorioService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/reminder-config")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConfiguracionRecordatorioController {

    private final ConfiguracionRecordatorioService service;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<ConfiguracionRecordatorioDto> getConfig(HttpServletRequest request) {
        try {
            String cognitoSub = jwtService.extractSubFromRequest(request);
            Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
            ConfiguracionRecordatorioDto dto = service.getByUsuarioId(usuarioId);
            
            // Si no existe configuración, devolver valores por defecto
            if (dto == null) {
                dto = createDefaultConfigDto(usuarioId);
            }
            
            log.debug("Usuario {} consultó configuración de recordatorios", usuarioId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Error al obtener configuración de recordatorios: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<ConfiguracionRecordatorioDto> saveOrUpdateConfig(
            HttpServletRequest request,
            @RequestBody ConfiguracionRecordatorioDto dto) {
        try {
            String cognitoSub = jwtService.extractSubFromRequest(request);
            Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
            
            // Validaciones
            if (dto.getDiasAnticipacion() == null || dto.getDiasAnticipacion().length == 0) {
                return ResponseEntity.badRequest().build();
            }
            
            // Validar que los días de anticipación sean válidos (0-30 días)
            for (Integer dia : dto.getDiasAnticipacion()) {
                if (dia == null || dia < 0 || dia > 30) {
                    log.warn("Usuario {} intentó configurar día de anticipación inválido: {}", usuarioId, dia);
                    return ResponseEntity.badRequest().build();
                }
            }
            
            ConfiguracionRecordatorioDto saved = service.saveOrUpdate(usuarioId, dto);
            log.info("Usuario {} actualizó configuración de recordatorios", usuarioId);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error al guardar configuración de recordatorios: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /* 
    @GetMapping("/default")
    public ResponseEntity<ConfiguracionRecordatorioDto> getDefaultConfig(HttpServletRequest request) {
        try {
            String cognitoSub = jwtService.extractSubFromRequest(request);
            Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
            ConfiguracionRecordatorioDto defaultDto = createDefaultConfigDto(usuarioId);
            return ResponseEntity.ok(defaultDto);
        } catch (Exception e) {
            log.error("Error al obtener configuración por defecto: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    */

    
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetToDefault(HttpServletRequest request) {
        try {
            String cognitoSub = jwtService.extractSubFromRequest(request);
            Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
            
            ConfiguracionRecordatorioDto defaultDto = createDefaultConfigDto(usuarioId);
            service.saveOrUpdate(usuarioId, defaultDto);
            
            log.info("Usuario {} restableció configuración de recordatorios a valores por defecto", usuarioId);
            return ResponseEntity.ok(Map.of("message", "Configuración restablecida a valores por defecto"));
        } catch (Exception e) {
            log.error("Error al restablecer configuración: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al restablecer configuración"));
        }
    }

    private ConfiguracionRecordatorioDto createDefaultConfigDto(Integer usuarioId) {
        ConfiguracionRecordatorioDto dto = new ConfiguracionRecordatorioDto();
        dto.setUsuarioId(usuarioId);
        dto.setActivo(true);
        dto.setDiasAnticipacion(new Integer[]{7, 3, 1, 0}); // 7, 3, 1 días antes y el día de vencimiento
        dto.setCanalCorreo(true);
        dto.setCanalSistema(true);
        return dto;
    }
}