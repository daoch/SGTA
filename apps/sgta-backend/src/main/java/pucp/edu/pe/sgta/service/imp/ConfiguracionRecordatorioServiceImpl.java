package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.ConfiguracionRecordatorioDto;
import pucp.edu.pe.sgta.mapper.ConfiguracionRecordatorioMapper;
import pucp.edu.pe.sgta.model.ConfiguracionRecordatorio;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.ConfiguracionRecordatorioRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.service.inter.ConfiguracionRecordatorioService;

@Service
@RequiredArgsConstructor
public class ConfiguracionRecordatorioServiceImpl implements ConfiguracionRecordatorioService {

    private final ConfiguracionRecordatorioRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final ConfiguracionRecordatorioMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public ConfiguracionRecordatorioDto getByUsuarioId(Integer usuarioId) {
        return repository.findByUsuarioId(usuarioId)
                .map(mapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional
    public ConfiguracionRecordatorioDto saveOrUpdate(Integer usuarioId, ConfiguracionRecordatorioDto dto) {
        ConfiguracionRecordatorio entity = repository.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    ConfiguracionRecordatorio cr = new ConfiguracionRecordatorio();
                    Usuario usuario = usuarioRepository.findById(usuarioId)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                    cr.setUsuario(usuario);
                    return cr;
                });
        mapper.updateEntityFromDto(dto, entity);
        return mapper.toDto(repository.save(entity));
    }
}